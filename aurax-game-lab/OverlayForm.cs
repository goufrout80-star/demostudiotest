using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Numerics;
using System.Windows.Forms;

namespace AuraXGameLab;

public sealed class OverlayForm : Form
{
    private const int WS_EX_TRANSPARENT = 0x20;
    private const int WS_EX_LAYERED = 0x80000;
    private const int WS_EX_TOOLWINDOW = 0x80;
    private const int WS_EX_NOACTIVATE = 0x08000000;

    private readonly AppState _state;
    private readonly System.Windows.Forms.Timer _timer = new();
    private bool _gameFound;
    private bool _lastLoggedFound;
    private bool _lastLoggedMinimized;
    private bool _hasLoggedState;
    private Rectangle _lastGoodBounds = Rectangle.Empty;
    private OfflineTelemetryFrame _telemetry = new();
    private bool _telemetryActive;
    private string _telemetryReason = "Waiting for offline telemetry.";
    private string _lastTelemetrySignature = "";

    public OverlayForm(AppState state)
    {
        _state = state;
        Text = "AuraX Overlay";
        FormBorderStyle = FormBorderStyle.None;
        ShowInTaskbar = false;
        TopMost = true;
        BackColor = Color.Fuchsia;
        TransparencyKey = Color.Fuchsia;
        DoubleBuffered = true;
        Bounds = HiddenBounds();

        _timer.Interval = 16;
        _timer.Tick += (_, _) => TickOverlay();
        _timer.Start();
    }

    protected override bool ShowWithoutActivation => true;

    protected override CreateParams CreateParams
    {
        get
        {
            var cp = base.CreateParams;
            cp.ExStyle |= WS_EX_TRANSPARENT | WS_EX_LAYERED | WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE;
            return cp;
        }
    }

    private void TickOverlay()
    {
        var probe = GameWindowTracker.Probe(_state.ProcessName);
        _gameFound = probe.Found && !probe.Minimized;

        if (_gameFound)
        {
            _lastGoodBounds = probe.Bounds;
            if (Bounds != probe.Bounds) Bounds = probe.Bounds;
            if (!Visible) Show();
        }
        else
        {
            var hidden = HiddenBounds();
            if (Bounds != hidden) Bounds = hidden;
        }

        if (!_hasLoggedState || _lastLoggedFound != probe.Found || _lastLoggedMinimized != probe.Minimized)
        {
            _hasLoggedState = true;
            _lastLoggedFound = probe.Found;
            _lastLoggedMinimized = probe.Minimized;

            if (probe.Found && probe.Minimized)
            {
                string last = _lastGoodBounds.IsEmpty ? "none" : $"{_lastGoodBounds.Width}x{_lastGoodBounds.Height}";
                DiagnosticLog.Info($"Overlay paused: AssaultCube minimized. Last valid bounds={last}");
            }
            else if (probe.Found)
            {
                DiagnosticLog.Info($"Overlay attached to {probe.ProcessName}.exe pid={probe.ProcessId} bounds={probe.Bounds.Width}x{probe.Bounds.Height} ({probe.Reason})");
            }
            else
            {
                DiagnosticLog.Warn($"Overlay detached: {probe.Reason}");
            }
        }

        _telemetryActive = OfflineTelemetry.TryRead(out _telemetry, out _telemetryReason);
        string telemetrySignature = _telemetryActive
            ? $"on|{_telemetry.Entities.Count}"
            : $"off|{_telemetryReason}";
        if (telemetrySignature != _lastTelemetrySignature)
        {
            _lastTelemetrySignature = telemetrySignature;
            if (_telemetryActive)
                DiagnosticLog.Info($"REAL OFFLINE TELEMETRY ACTIVE: {_telemetry.Entities.Count} entities from {OfflineTelemetry.TelemetryPath}");
            else
                DiagnosticLog.Warn($"Offline telemetry inactive: {_telemetryReason}");
        }

        Invalidate();
    }

    private static Rectangle HiddenBounds() => new(-10000, -10000, 10, 10);

    protected override void OnPaint(PaintEventArgs e)
    {
        base.OnPaint(e);
        if (!_state.OverlayEnabled || !_gameFound) return;

        var g = e.Graphics;
        g.SmoothingMode = SmoothingMode.AntiAlias;

        using var white = new Pen(Color.FromArgb(235, 255, 255, 255), 2f);
        using var dim = new Pen(Color.FromArgb(110, 255, 255, 255), 1.5f);
        using var text = new SolidBrush(Color.White);
        using var panel = new SolidBrush(Color.FromArgb(185, 10, 10, 13));
        using var font = new Font("Segoe UI", 9f);
        using var bold = new Font("Segoe UI Semibold", 10f);

        g.FillRectangle(panel, 12, 12, 390, 55);
        g.DrawString("AuraX Game Lab • Beta 0.6", bold, text, 24, 22);
        g.DrawString(_telemetryActive
            ? $"REAL offline telemetry • {_telemetry.Entities.Count} entities"
            : "Waiting for offline bot telemetry", font, Brushes.LightGray, 24, 43);

        float cx = ClientSize.Width / 2f;
        float cy = ClientSize.Height / 2f;

        if (_state.Crosshair)
        {
            g.DrawLine(white, cx - 9, cy, cx + 9, cy);
            g.DrawLine(white, cx, cy - 9, cx, cy + 9);
        }

        if (_state.AimTrainerFov)
        {
            float r = _state.AimTrainerRadius;
            g.DrawEllipse(dim, cx - r, cy - r, r * 2, r * 2);
        }

        if (_state.EspBoxes)
        {
            if (_telemetryActive)
            {
                DrawRealOfflineEntities(g, white, text, font);
            }
            else
            {
                using var waitPanel = new SolidBrush(Color.FromArgb(190, 10, 10, 13));
                const string waiting = "ESP waiting for OFFLINE telemetry";
                var sz = g.MeasureString(waiting, bold);
                g.FillRectangle(waitPanel, cx - sz.Width / 2 - 14, 84, sz.Width + 28, 34);
                g.DrawString(waiting, bold, text, cx - sz.Width / 2, 92);
            }
        }

        if (_state.InvulnerabilitySimulation)
        {
            string msg = "INVULNERABILITY LAB: SIMULATION ONLY";
            var size = g.MeasureString(msg, bold);
            g.FillRectangle(panel, cx - size.Width / 2 - 12, ClientSize.Height - 58, size.Width + 24, 34);
            g.DrawString(msg, bold, text, cx - size.Width / 2, ClientSize.Height - 50);
        }
    }

    private void DrawRealOfflineEntities(Graphics g, Pen pen, Brush text, Font font)
    {
        foreach (var entity in _telemetry.Entities)
        {
            if (!entity.Alive || entity.Health <= 0) continue;

            var world = new Vector3(entity.X, entity.Y, entity.Z);
            if (!TryWorldToScreen(world, _telemetry.Camera, ClientSize.Width, ClientSize.Height, out var screen, out float distance))
                continue;

            float h = Math.Clamp(900f / Math.Max(distance, 1f), 30f, 220f);
            float w = h * 0.44f;
            float x = screen.X - w / 2f;
            float y = screen.Y - h * 0.52f;
            string dist = $"{distance:0.0} u";
            DrawTarget(g, entity.Name, entity.Health, x, y, w, h, dist, pen, text, font);
        }
    }

    private static bool TryWorldToScreen(Vector3 world, TelemetryCamera camera, int width, int height, out PointF screen, out float distance)
    {
        screen = PointF.Empty;
        var cam = new Vector3(camera.X, camera.Y, camera.Z);
        var rel = world - cam;
        distance = rel.Length();
        if (distance < 0.01f) return false;

        float yaw = camera.Yaw * MathF.PI / 180f;
        float pitch = camera.Pitch * MathF.PI / 180f;

        var forward = Vector3.Normalize(new Vector3(
            -MathF.Sin(yaw) * MathF.Cos(pitch),
             MathF.Cos(yaw) * MathF.Cos(pitch),
             MathF.Sin(pitch)));
        var right = Vector3.Normalize(new Vector3(MathF.Cos(yaw), MathF.Sin(yaw), 0f));
        var up = Vector3.Normalize(Vector3.Cross(right, forward));

        float depth = Vector3.Dot(rel, forward);
        if (depth <= 0.05f) return false;

        float horizontal = Vector3.Dot(rel, right);
        float vertical = Vector3.Dot(rel, up);
        float fov = Math.Clamp(camera.Fov, 30f, 140f) * MathF.PI / 180f;
        float focal = height / (2f * MathF.Tan(fov / 2f));

        float sx = width / 2f + (horizontal / depth) * focal;
        float sy = height / 2f - (vertical / depth) * focal;
        if (sx < -200 || sx > width + 200 || sy < -300 || sy > height + 300) return false;

        screen = new PointF(sx, sy);
        return true;
    }

    private static void DrawTarget(Graphics g, string name, int hp, float x, float y, float w, float h, string distance, Pen pen, Brush text, Font font)
    {
        var rect = new RectangleF(x, y, w, h);
        g.DrawRectangle(pen, rect.X, rect.Y, rect.Width, rect.Height);
        g.DrawString($"{name}  {hp} HP", font, text, rect.X, rect.Y - 20);
        g.DrawString(distance, font, text, rect.X, rect.Bottom + 3);

        float hpPct = Math.Clamp(hp, 0, 100) / 100f;
        using var barBg = new SolidBrush(Color.FromArgb(150, 0, 0, 0));
        using var barFg = new SolidBrush(Color.White);
        g.FillRectangle(barBg, rect.X - 8, rect.Y, 4, rect.Height);
        g.FillRectangle(barFg, rect.X - 8, rect.Bottom - rect.Height * hpPct, 4, rect.Height * hpPct);
    }
}
