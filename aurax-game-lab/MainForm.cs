using System;
using System.Drawing;
using System.Windows.Forms;

namespace AuraXGameLab;

public sealed class MainForm : Form
{
    private readonly AppState _state;
    private readonly OverlayForm _overlay;
    private readonly Label _status = new();
    private readonly Label _speedReadout = new();
    private readonly System.Windows.Forms.Timer _uiTimer = new();
    private DateTime _speedStart;

    public MainForm(AppState state)
    {
        _state = state;
        _overlay = new OverlayForm(_state);

        Text = "AuraX Game Lab Beta 0.2";
        StartPosition = FormStartPosition.CenterScreen;
        Size = new Size(620, 650);
        MinimumSize = new Size(620, 650);
        BackColor = Color.FromArgb(12, 12, 15);
        ForeColor = Color.White;
        Font = new Font("Segoe UI", 10f);

        BuildUi();

        Shown += (_, _) => _overlay.Show();
        FormClosed += (_, _) => _overlay.Close();

        _uiTimer.Interval = 100;
        _uiTimer.Tick += (_, _) => RefreshStatus();
        _uiTimer.Start();
    }

    private void BuildUi()
    {
        var title = new Label
        {
            Text = "AuraX Game Lab",
            Font = new Font("Segoe UI Semibold", 24f),
            AutoSize = true,
            Location = new Point(28, 22)
        };
        Controls.Add(title);

        var subtitle = new Label
        {
            Text = "Beta 0.2 • AssaultCube offline / bot training overlay",
            ForeColor = Color.FromArgb(165, 165, 175),
            AutoSize = true,
            Location = new Point(31, 70)
        };
        Controls.Add(subtitle);

        _status.AutoSize = true;
        _status.Location = new Point(31, 108);
        _status.Font = new Font("Segoe UI Semibold", 10f);
        Controls.Add(_status);

        int y = 150;
        AddToggle("Overlay", "Master overlay switch", y, _state.OverlayEnabled, v => _state.OverlayEnabled = v); y += 62;
        AddToggle("ESP Preview", "Demo entity boxes, HP and distance", y, _state.EspBoxes, v => _state.EspBoxes = v); y += 62;
        AddToggle("Crosshair", "Centered training crosshair", y, _state.Crosshair, v => _state.Crosshair = v); y += 62;
        AddToggle("Aim Trainer", "Draw a configurable FOV circle for aim practice", y, _state.AimTrainerFov, v => _state.AimTrainerFov = v); y += 62;

        var fovLabel = new Label { Text = "Aim FOV radius", AutoSize = true, Location = new Point(31, y + 7) };
        Controls.Add(fovLabel);
        var fov = new TrackBar
        {
            Minimum = 40,
            Maximum = 300,
            Value = _state.AimTrainerRadius,
            TickFrequency = 20,
            Width = 330,
            Location = new Point(215, y)
        };
        fov.ValueChanged += (_, _) => _state.AimTrainerRadius = fov.Value;
        Controls.Add(fov);
        y += 65;

        AddToggle("Speed Trainer", "Starts a local movement-practice timer", y, false, v =>
        {
            _state.SpeedTrainer = v;
            if (v) _speedStart = DateTime.Now;
        });
        _speedReadout.AutoSize = true;
        _speedReadout.ForeColor = Color.FromArgb(165, 165, 175);
        _speedReadout.Location = new Point(215, y + 34);
        Controls.Add(_speedReadout);
        y += 70;

        AddToggle("Invulnerability Lab", "Sandbox indicator only; does not patch game memory", y, false, v => _state.InvulnerabilitySimulation = v);
        y += 80;

        var note = new Label
        {
            Text = "Safety scope: no memory scanning/writing, injection, hooks or anti-cheat bypass.\nUse this build for offline/bot overlay and aim-training experiments.",
            ForeColor = Color.FromArgb(150, 150, 160),
            AutoSize = true,
            Location = new Point(31, y)
        };
        Controls.Add(note);
    }

    private void AddToggle(string title, string description, int y, bool initial, Action<bool> setter)
    {
        var cb = new CheckBox
        {
            Text = title,
            Checked = initial,
            AutoSize = true,
            Font = new Font("Segoe UI Semibold", 11f),
            Location = new Point(31, y)
        };
        cb.CheckedChanged += (_, _) => setter(cb.Checked);
        Controls.Add(cb);

        var desc = new Label
        {
            Text = description,
            ForeColor = Color.FromArgb(150, 150, 160),
            AutoSize = true,
            Location = new Point(52, y + 29)
        };
        Controls.Add(desc);
    }

    private void RefreshStatus()
    {
        bool found = GameWindowTracker.TryGetClientBounds(_state.ProcessName, out _);
        _status.Text = found ? "● AssaultCube detected" : "○ Waiting for ac_client.exe";
        _status.ForeColor = found ? Color.FromArgb(115, 230, 150) : Color.FromArgb(235, 180, 90);

        _speedReadout.Text = _state.SpeedTrainer
            ? $"Timer: {(DateTime.Now - _speedStart):mm\\:ss\\.f}"
            : "Timer: stopped";
    }
}
