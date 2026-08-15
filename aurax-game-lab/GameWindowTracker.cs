using System;
using System.Diagnostics;
using System.Drawing;
using System.Runtime.InteropServices;

namespace AuraXGameLab;

internal static class GameWindowTracker
{
    [StructLayout(LayoutKind.Sequential)]
    private struct RECT { public int Left, Top, Right, Bottom; }

    [StructLayout(LayoutKind.Sequential)]
    private struct POINT { public int X, Y; }

    [DllImport("user32.dll")] private static extern bool GetClientRect(IntPtr hWnd, out RECT lpRect);
    [DllImport("user32.dll")] private static extern bool ClientToScreen(IntPtr hWnd, ref POINT lpPoint);

    public static bool TryGetClientBounds(string processName, out Rectangle bounds)
    {
        bounds = Rectangle.Empty;
        try
        {
            foreach (var process in Process.GetProcessesByName(processName))
            {
                var hwnd = process.MainWindowHandle;
                if (hwnd == IntPtr.Zero) continue;
                if (!GetClientRect(hwnd, out var rect)) continue;
                var topLeft = new POINT();
                if (!ClientToScreen(hwnd, ref topLeft)) continue;
                int width = rect.Right - rect.Left;
                int height = rect.Bottom - rect.Top;
                if (width <= 0 || height <= 0) continue;
                bounds = new Rectangle(topLeft.X, topLeft.Y, width, height);
                return true;
            }
        }
        catch { }
        return false;
    }
}
