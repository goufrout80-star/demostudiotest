using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Runtime.InteropServices;
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
    private float _phase;
    private bool _gameFound;

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
        Bounds = new Rectangle(100, 100, 900, 600);

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
        _phase += 0.035f;
        if (GameWindowTracker.TryGetClientBounds(_state.ProcessName, out var bounds))
        {
            _gameFound = true;
            if (Bounds != bounds) Bounds = bounds;
        }
        else
        {
            _gameFound = false;
            var area = Screen.PrimaryScreen?.WorkingArea ?? new Rectangle(0, 0, 1280, 720);
            var preview = new Rectangle(area.Right - 920, area.Bottom - 640, 880, 580);
            if (Bounds != preview) Bounds = preview;
        }
        Invalidate();
    }

    protected override void OnPaint(PaintEventArgs e)
    {
        base.OnPaint(e);
        if (!_state.OverlayEnabled) return;

        var g = e.Graphics;
        g.SmoothingMode = SmoothingMode.AntiAlias;

        using var white = new Pen(Color.FromArgb(235, 255, 255, 255), 2f);
        using var dim = new Pen(Color.FromArgb(110, 255, 255, 255), 1.5f);
        using var text = new SolidBrush(Color.White);
        using var panel = new SolidBrush(Color.FromArgb(185, 10, 10, 13));
        using var font = new Font("Segoe UI", 9f);
        using var bold = new Font("Segoe UI Semibold", 10f);

        g.FillRectangle(panel, 12, 12, 290, 55);
        g.DrawString("AuraX Game Lab • Beta 0.2", bold, text, 24, 22);
        g.DrawString(_gameFound ? "AssaultCube detected • offline/bot lab" : "Preview mode • launch AssaultCube", font, Brushes.LightGray, 24, 43);

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
            DrawTarget(g, "BOT_ALPHA", 100, ClientSize.Width * .27f + MathF.Sin(_phase) * 22f, ClientSize.Height * .28f, 58, 128, "18.4 m", white, text, font);
            DrawTarget(g, "BOT_BRAVO", 64, ClientSize.Width * .56f + MathF.Cos(_phase * .8f) * 30f, ClientSize.Height * .38f, 50, 112, "31.7 m", white, text, font);
            DrawTarget(g, "BOT_CHARLIE", 27, ClientSize.Width * .73f - MathF.Sin(_phase) * 18f, ClientSize.Height * .23f, 44, 100, "46.2 m", white, text, font);
        }

        if (_state.InvulnerabilitySimulation)
        {
            string msg = "INVULNERABILITY LAB: SIMULATION ON";
            var size = g.MeasureString(msg, bold);
            g.FillRectangle(panel, cx - size.Width / 2 - 12, ClientSize.Height - 58, size.Width + 24, 34);
            g.DrawString(msg, bold, text, cx - size.Width / 2, ClientSize.Height - 50);
        }
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
