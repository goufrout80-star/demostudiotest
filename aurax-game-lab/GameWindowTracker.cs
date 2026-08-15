using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;

namespace AuraXGameLab;

internal sealed record GameWindowDiagnostic(
    bool Found,
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

    private static readonly string[] KnownNames = { "ac_client", "assaultcube", "assaultcube_client" };

    public static bool TryGetClientBounds(string processName, out Rectangle bounds)
    {
        var result = Probe(processName);
        bounds = result.Bounds;
        return result.Found;
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

            // Fallback: inspect visible process/window names containing Assault/Cube/ac_client.
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
                return new GameWindowDiagnostic(false, preferredProcessName, 0, "", IntPtr.Zero, Rectangle.Empty,
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

                    if (hwnd == IntPtr.Zero)
                    {
                        continue;
                    }

                    if (!GetClientRect(hwnd, out var rect))
                    {
                        continue;
                    }

                    var topLeft = new POINT();
                    if (!ClientToScreen(hwnd, ref topLeft))
                    {
                        continue;
                    }

                    int width = rect.Right - rect.Left;
                    int height = rect.Bottom - rect.Top;
                    if (width <= 0 || height <= 0)
                    {
                        continue;
                    }

                    var bounds = new Rectangle(topLeft.X, topLeft.Y, width, height);
                    return new GameWindowDiagnostic(true, pname, pid, title, hwnd, bounds,
                        "Game client window detected.", candidates);
                }
                catch { }
            }

            var first = matching[0];
            string firstName = Safe(() => first.ProcessName, "unknown");
            int firstPid = Safe(() => first.Id, 0);
            string firstTitle = Safe(() => first.MainWindowTitle, "");
            IntPtr firstHandle = Safe(() => first.MainWindowHandle, IntPtr.Zero);

            return new GameWindowDiagnostic(false, firstName, firstPid, firstTitle, firstHandle, Rectangle.Empty,
                "Matching process found, but it has no usable main client window yet. Try running AssaultCube in windowed/borderless mode and keep the game window open.", candidates);
        }
        catch (Exception ex)
        {
            return new GameWindowDiagnostic(false, preferredProcessName, 0, "", IntPtr.Zero, Rectangle.Empty,
                $"Process scan failed: {ex.GetType().Name}: {ex.Message}", "unavailable");
        }
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
