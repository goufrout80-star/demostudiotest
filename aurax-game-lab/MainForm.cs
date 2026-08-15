using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace AuraXGameLab;

public sealed class MainForm : Form
{
    private const int WM_HOTKEY = 0x0312;
    private const int HOTKEY_ID_F2 = 0xA642;
    private const uint MOD_NOREPEAT = 0x4000;
    private const uint VK_F2 = 0x71;

    [DllImport("user32.dll", SetLastError = true)]
    private static extern bool RegisterHotKey(IntPtr hWnd, int id, uint fsModifiers, uint vk);

    [DllImport("user32.dll", SetLastError = true)]
    private static extern bool UnregisterHotKey(IntPtr hWnd, int id);

    private readonly AppState _state;
    private readonly OverlayForm _overlay;
    private readonly Label _status = new();
    private readonly Label _speedReadout = new();
    private readonly RichTextBox _logBox = new();
    private readonly System.Windows.Forms.Timer _uiTimer = new();
    private DateTime _speedStart;
    private string _lastProbeSignature = "";
    private bool _hotkeyRegistered;

    public MainForm(AppState state)
    {
        _state = state;
        _overlay = new OverlayForm(_state);

        Text = "AuraX Game Lab Beta 0.7 Offline Training Control";
        StartPosition = FormStartPosition.CenterScreen;
        Size = new Size(760, 860);
        MinimumSize = new Size(760, 760);
        BackColor = Color.FromArgb(12, 12, 15);
        ForeColor = Color.White;
        Font = new Font("Segoe UI", 10f);

        BuildUi();

        DiagnosticLog.LineAdded += OnLogLine;
        DiagnosticLog.Info("AuraX Game Lab Beta 0.7 started.");
        DiagnosticLog.Info($"Executable folder: {AppContext.BaseDirectory}");
        DiagnosticLog.Info($"Expected process: {_state.ProcessName}.exe");
        DiagnosticLog.Info($"Offline telemetry path: {OfflineTelemetry.TelemetryPath}");

        Shown += (_, _) =>
        {
            _overlay.Show();
            RegisterMenuHotkey();
        };

        FormClosed += (_, _) =>
        {
            if (_hotkeyRegistered) UnregisterHotKey(Handle, HOTKEY_ID_F2);
            DiagnosticLog.Info("Application closing.");
            DiagnosticLog.LineAdded -= OnLogLine;
            _overlay.Close();
        };

        _uiTimer.Interval = 500;
        _uiTimer.Tick += (_, _) => RefreshStatus();
        _uiTimer.Start();
    }

    private void RegisterMenuHotkey()
    {
        _hotkeyRegistered = RegisterHotKey(Handle, HOTKEY_ID_F2, MOD_NOREPEAT, VK_F2);
        if (_hotkeyRegistered)
            DiagnosticLog.Info("Global F2 menu hotkey registered. Press F2 to hide/show AuraX.");
        else
            DiagnosticLog.Warn($"Could not register global F2 hotkey. Win32 error={Marshal.GetLastWin32Error()}");
    }

    protected override void WndProc(ref Message m)
    {
        if (m.Msg == WM_HOTKEY && m.WParam.ToInt32() == HOTKEY_ID_F2)
        {
            ToggleMenuVisibility();
            return;
        }
        base.WndProc(ref m);
    }

    private void ToggleMenuVisibility()
    {
        if (Visible && WindowState != FormWindowState.Minimized)
        {
            Hide();
            DiagnosticLog.Info("Menu hidden with F2.");
        }
        else
        {
            Show();
            WindowState = FormWindowState.Normal;
            BringToFront();
            Activate();
            DiagnosticLog.Info("Menu shown with F2.");
        }
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
            Text = "Beta 0.7 • offline/bot control build • F2 hides/shows this menu",
            ForeColor = Color.FromArgb(165, 165, 175),
            AutoSize = true,
            Location = new Point(31, 70)
        };
        Controls.Add(subtitle);

        _status.AutoSize = true;
        _status.Location = new Point(31, 108);
        _status.Font = new Font("Segoe UI Semibold", 10f);
        Controls.Add(_status);

        int y = 145;
        AddToggle("Overlay", "Master overlay switch", y, _state.OverlayEnabled, v => _state.OverlayEnabled = v); y += 55;
        AddToggle("Real Offline ESP", "Uses telemetry from the modified local bot build; no fake targets", y, _state.EspBoxes, v => _state.EspBoxes = v); y += 55;
        AddToggle("Crosshair", "Centered training crosshair", y, _state.Crosshair, v => _state.Crosshair = v); y += 55;
        AddToggle("Aim Trainer", "FOV visualization; gameplay aim assist belongs in the offline source-mod build", y, _state.AimTrainerFov, v => _state.AimTrainerFov = v); y += 55;

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
        y += 58;

        AddToggle("Speed Trainer", "Practice timer here; real speed modifier is offline-fork-only", y, false, v =>
        {
            _state.SpeedTrainer = v;
            if (v) _speedStart = DateTime.Now;
            DiagnosticLog.Info($"Speed trainer {(v ? "enabled" : "disabled")}");
        });
        _speedReadout.AutoSize = true;
        _speedReadout.ForeColor = Color.FromArgb(165, 165, 175);
        _speedReadout.Location = new Point(215, y + 29);
        Controls.Add(_speedReadout);
        y += 65;

        AddToggle("Invulnerability Lab", "Indicator here; real invulnerability is offline-fork-only", y, false, v =>
        {
            _state.InvulnerabilitySimulation = v;
            DiagnosticLog.Info($"Invulnerability simulation {(v ? "enabled" : "disabled")}");
        });
        y += 65;

        var diagTitle = new Label
        {
            Text = "Diagnostics Log",
            Font = new Font("Segoe UI Semibold", 12f),
            AutoSize = true,
            Location = new Point(31, y)
        };
        Controls.Add(diagTitle);

        var scanBtn = new Button
        {
            Text = "Scan Now",
            Location = new Point(455, y - 4),
            Size = new Size(105, 31),
            FlatStyle = FlatStyle.Flat,
            ForeColor = Color.White,
            BackColor = Color.FromArgb(34, 34, 40)
        };
        scanBtn.Click += (_, _) => RunManualScan();
        Controls.Add(scanBtn);

        var openLogBtn = new Button
        {
            Text = "Open Log",
            Location = new Point(570, y - 4),
            Size = new Size(105, 31),
            FlatStyle = FlatStyle.Flat,
            ForeColor = Color.White,
            BackColor = Color.FromArgb(34, 34, 40)
        };
        openLogBtn.Click += (_, _) => OpenLogFile();
        Controls.Add(openLogBtn);

        y += 35;
        _logBox.Location = new Point(31, y);
        _logBox.Size = new Size(644, 235);
        _logBox.Anchor = AnchorStyles.Left | AnchorStyles.Right | AnchorStyles.Top | AnchorStyles.Bottom;
        _logBox.ReadOnly = true;
        _logBox.BackColor = Color.FromArgb(7, 7, 9);
        _logBox.ForeColor = Color.FromArgb(205, 205, 215);
        _logBox.BorderStyle = BorderStyle.FixedSingle;
        _logBox.Font = new Font("Consolas", 8.5f);
        Controls.Add(_logBox);

        var note = new Label
        {
            Text = "F2 = hide/show menu globally. Stock AssaultCube does not expose gameplay telemetry or offline modifiers.",
            ForeColor = Color.FromArgb(150, 150, 160),
            AutoSize = true,
            Location = new Point(31, y + 245)
        };
        note.Anchor = AnchorStyles.Left | AnchorStyles.Bottom;
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
            Location = new Point(52, y + 27)
        };
        Controls.Add(desc);
    }

    private void RefreshStatus()
    {
        var probe = GameWindowTracker.Probe(_state.ProcessName);
        string gameState = probe.Found
            ? (probe.Minimized ? "minimized" : $"{probe.Bounds.Width}x{probe.Bounds.Height}")
            : "not attached";
        bool telemetry = OfflineTelemetry.TryRead(out var frame, out var telemetryReason);

        _status.Text = probe.Found
            ? $"● {probe.ProcessName}.exe PID {probe.ProcessId} • {gameState} • telemetry {(telemetry ? $"ON ({frame.Entities.Count})" : "OFF")}"
            : $"○ Not attached • {probe.Reason}";
        _status.ForeColor = probe.Found ? Color.FromArgb(115, 230, 150) : Color.FromArgb(235, 180, 90);

        string signature = $"{probe.Found}|{probe.Minimized}|{probe.ProcessName}|{probe.ProcessId}|{probe.WindowHandle}|{probe.Bounds}|{probe.Reason}|{probe.CandidateProcesses}";
        if (signature != _lastProbeSignature)
        {
            _lastProbeSignature = signature;
            if (probe.Found)
            {
                DiagnosticLog.Info($"GAME FOUND process={probe.ProcessName}.exe pid={probe.ProcessId} hwnd=0x{probe.WindowHandle.ToInt64():X} title=\"{probe.WindowTitle}\" bounds={probe.Bounds.X},{probe.Bounds.Y},{probe.Bounds.Width},{probe.Bounds.Height} minimized={probe.Minimized} reason={probe.Reason}");
            }
            else
            {
                DiagnosticLog.Warn($"GAME NOT FOUND: {probe.Reason}");
                DiagnosticLog.Info($"Relevant process candidates: {probe.CandidateProcesses}");
            }
        }

        _speedReadout.Text = _state.SpeedTrainer
            ? $"Timer: {(DateTime.Now - _speedStart):mm\\:ss\\.f}"
            : "Timer: stopped";
    }

    private void RunManualScan()
    {
        DiagnosticLog.Info("Manual process scan requested.");
        var probe = GameWindowTracker.Probe(_state.ProcessName);
        DiagnosticLog.Info($"Scan result: found={probe.Found}; minimized={probe.Minimized}; process={probe.ProcessName}; pid={probe.ProcessId}; hwnd=0x{probe.WindowHandle.ToInt64():X}; title=\"{probe.WindowTitle}\"; bounds={probe.Bounds}; reason={probe.Reason}");
        DiagnosticLog.Info($"Candidates: {probe.CandidateProcesses}");
        bool telemetry = OfflineTelemetry.TryRead(out var frame, out var reason);
        DiagnosticLog.Info($"Telemetry scan: active={telemetry}; entities={frame.Entities.Count}; path={OfflineTelemetry.TelemetryPath}; reason={reason}");
    }

    private void OpenLogFile()
    {
        try
        {
            if (!File.Exists(DiagnosticLog.LogPath)) File.WriteAllText(DiagnosticLog.LogPath, "AuraX log initialized." + Environment.NewLine);
            Process.Start(new ProcessStartInfo(DiagnosticLog.LogPath) { UseShellExecute = true });
        }
        catch (Exception ex)
        {
            MessageBox.Show($"Could not open log: {ex.Message}", "AuraX Diagnostics", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }
    }

    private void OnLogLine(string line)
    {
        if (IsDisposed) return;
        if (InvokeRequired)
        {
            BeginInvoke(new Action<string>(OnLogLine), line);
            return;
        }
        _logBox.AppendText(line + Environment.NewLine);
        _logBox.SelectionStart = _logBox.TextLength;
        _logBox.ScrollToCaret();
    }
}
