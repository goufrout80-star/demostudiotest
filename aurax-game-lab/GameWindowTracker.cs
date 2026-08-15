using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace AuraXGameLab;

internal sealed record GameWindowDiagnostic(
    bool Found,
    bool Minimized,
    string ProcessName,
    int ProcessId,
    string WindowTitle,
    IntPtr WindowHandle,
    Rectangle Bounds,
    string Reason,
    string CandidateProcesses);

internal static class GameWindowTracker
{
    [StructLayout(LayoutKind.Sequential)]
    private struct RECT { public int Left, Top, Right, Bottom; }

    [StructLayout(LayoutKind.Sequential)]
    private struct POINT { public int X, Y; }

    [DllImport("user32.dll")] private static extern bool GetClientRect(IntPtr hWnd, out RECT lpRect);
    [DllImport("user32.dll")] private static extern bool ClientToScreen(IntPtr hWnd, ref POINT lpPoint);
    [DllImport("user32.dll")] private static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
    [DllImport("user32.dll")] private static extern bool IsWindowVisible(IntPtr hWnd);
    [DllImport("user32.dll")] private static extern bool IsIconic(IntPtr hWnd);
    [DllImport("dwmapi.dll")] private static extern int DwmGetWindowAttribute(IntPtr hwnd, int dwAttribute, out RECT pvAttribute, int cbAttribute);

    private const int DWMWA_EXTENDED_FRAME_BOUNDS = 9;
    private static readonly string[] KnownNames = { "ac_client", "assaultcube", "assaultcube_client" };

    public static bool TryGetClientBounds(string processName, out Rectangle bounds)
    {
        var result = Probe(processName);
        bounds = result.Bounds;
        return result.Found && !result.Minimized;
    }

    public static GameWindowDiagnostic Probe(string preferredProcessName)
    {
        try
        {
            var all = Process.GetProcesses();
            string candidates = BuildCandidateSummary(all);

            var names = new List<string>();
            if (!string.IsNullOrWhiteSpace(preferredProcessName)) names.Add(preferredProcessName.Trim());
            foreach (var known in KnownNames)
                if (!names.Contains(known, StringComparer.OrdinalIgnoreCase)) names.Add(known);

            var matching = new List<Process>();
            foreach (var name in names)
            {
                try { matching.AddRange(Process.GetProcessesByName(name)); } catch { }
            }

            foreach (var p in all)
            {
                try
                {
                    string n = p.ProcessName ?? string.Empty;
                    string t = p.MainWindowTitle ?? string.Empty;
                    bool looksRelevant =
                        n.Contains("assault", StringComparison.OrdinalIgnoreCase) ||
                        n.Contains("cube", StringComparison.OrdinalIgnoreCase) ||
                        n.Contains("ac_client", StringComparison.OrdinalIgnoreCase) ||
                        t.Contains("AssaultCube", StringComparison.OrdinalIgnoreCase);
                    if (looksRelevant && matching.All(x => x.Id != p.Id)) matching.Add(p);
                }
                catch { }
            }

            if (matching.Count == 0)
            {
                return new GameWindowDiagnostic(false, false, preferredProcessName, 0, "", IntPtr.Zero, Rectangle.Empty,
                    "No AssaultCube-like process found.", candidates);
            }

            foreach (var process in matching.OrderByDescending(p => p.MainWindowHandle != IntPtr.Zero))
            {
                try
                {
                    string pname = process.ProcessName;
                    int pid = process.Id;
                    IntPtr hwnd = process.MainWindowHandle;
                    string title = process.MainWindowTitle ?? "";

                    if (hwnd == IntPtr.Zero) continue;
                    if (!IsWindowVisible(hwnd)) continue;

                    // Exclusive fullscreen applications commonly move their HWND to
                    // (-32000,-32000) with a tiny 160x28 rect when Alt+Tabbed/minimized.
                    // Never treat that placeholder as a real overlay target.
                    if (IsIconic(hwnd))
                    {
                        Rectangle monitor = SafeMonitorBounds(hwnd);
                        return new GameWindowDiagnostic(true, true, pname, pid, title, hwnd, monitor,
                            "Game process/window detected but it is currently minimized. Overlay is paused until AssaultCube is restored.", candidates);
                    }

                    // 1. Preferred path: actual client area.
                    if (GetClientRect(hwnd, out var clientRect))
                    {
                        int width = clientRect.Right - clientRect.Left;
                        int height = clientRect.Bottom - clientRect.Top;
                        var topLeft = new POINT();

                        if (width > 0 && height > 0 && ClientToScreen(hwnd, ref topLeft))
                        {
                            var clientBounds = new Rectangle(topLeft.X, topLeft.Y, width, height);
                            if (IsUsableBounds(clientBounds))
                            {
                                return new GameWindowDiagnostic(true, false, pname, pid, title, hwnd, clientBounds,
                                    "Game detected via client bounds.", candidates);
                            }
                        }
                    }

                    // 2. DWM fallback. Reject minimized/off-screen placeholder rectangles.
                    try
                    {
                        if (DwmGetWindowAttribute(hwnd, DWMWA_EXTENDED_FRAME_BOUNDS, out var dwmRect, Marshal.SizeOf<RECT>()) == 0)
                        {
                            var dwmBounds = ToRectangle(dwmRect);
                            if (IsUsableBounds(dwmBounds))
                            {
                                return new GameWindowDiagnostic(true, false, pname, pid, title, hwnd, dwmBounds,
                                    "Game detected via DWM extended frame bounds fallback.", candidates);
                            }
                        }
                    }
                    catch { }

                    // 3. Raw window rectangle fallback.
                    if (GetWindowRect(hwnd, out var windowRect))
                    {
                        var windowBounds = ToRectangle(windowRect);
                        if (IsUsableBounds(windowBounds))
                        {
                            return new GameWindowDiagnostic(true, false, pname, pid, title, hwnd, windowBounds,
                                "Game detected via GetWindowRect fallback.", candidates);
                        }
                    }

                    // 4. Fullscreen monitor fallback. This is appropriate when OpenGL
                    // reports a 0x0 client rect but the game is visibly fullscreen.
                    Rectangle monitorBounds = SafeMonitorBounds(hwnd);
                    if (monitorBounds.Width > 0 && monitorBounds.Height > 0)
                    {
                        return new GameWindowDiagnostic(true, false, pname, pid, title, hwnd, monitorBounds,
                            "Game detected via fullscreen monitor-bounds fallback.", candidates);
                    }
                }
                catch { }
            }

            var first = matching[0];
            return new GameWindowDiagnostic(false, false,
                Safe(() => first.ProcessName, "unknown"),
                Safe(() => first.Id, 0),
                Safe(() => first.MainWindowTitle, ""),
                Safe(() => first.MainWindowHandle, IntPtr.Zero),
                Rectangle.Empty,
                "Matching process found, but no usable visible game bounds were available.",
                candidates);
        }
        catch (Exception ex)
        {
            return new GameWindowDiagnostic(false, false, preferredProcessName, 0, "", IntPtr.Zero, Rectangle.Empty,
                $"Process scan failed: {ex.GetType().Name}: {ex.Message}", "unavailable");
        }
    }

    private static Rectangle ToRectangle(RECT rect)
        => new(rect.Left, rect.Top, rect.Right - rect.Left, rect.Bottom - rect.Top);

    private static bool IsUsableBounds(Rectangle bounds)
    {
        if (bounds.Width < 320 || bounds.Height < 200) return false;
        if (bounds.X <= -30000 || bounds.Y <= -30000) return false;
        if (bounds.Right <= -10000 || bounds.Bottom <= -10000) return false;
        return true;
    }

    private static Rectangle SafeMonitorBounds(IntPtr hwnd)
    {
        try { return Screen.FromHandle(hwnd).Bounds; }
        catch { return Screen.PrimaryScreen?.Bounds ?? Rectangle.Empty; }
    }

    private static string BuildCandidateSummary(Process[] processes)
    {
        var items = new List<string>();
        foreach (var p in processes)
        {
            try
            {
                string name = p.ProcessName;
                string title = p.MainWindowTitle ?? "";
                if (name.Contains("assault", StringComparison.OrdinalIgnoreCase) ||
                    name.Contains("cube", StringComparison.OrdinalIgnoreCase) ||
                    name.Contains("ac_", StringComparison.OrdinalIgnoreCase) ||
                    title.Contains("Assault", StringComparison.OrdinalIgnoreCase) ||
                    title.Contains("Cube", StringComparison.OrdinalIgnoreCase))
                {
                    items.Add($"{name}.exe(pid={p.Id}, hwnd=0x{p.MainWindowHandle.ToInt64():X}, title=\"{title}\")");
                }
            }
            catch { }
        }
        return items.Count == 0 ? "none" : string.Join(" | ", items.Take(12));
    }

    private static T Safe<T>(Func<T> f, T fallback)
    {
        try { return f(); } catch { return fallback; }
    }
}
