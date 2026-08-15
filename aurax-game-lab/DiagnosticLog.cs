using System;
using System.Collections.Generic;
using System.IO;

namespace AuraXGameLab;

internal static class DiagnosticLog
{
    private static readonly object Gate = new();
    private static readonly Queue<string> Recent = new();
    private const int MaxRecent = 250;

    public static string LogPath => Path.Combine(AppContext.BaseDirectory, "aurax-log.txt");
    public static event Action<string>? LineAdded;

    public static void Info(string message) => Write("INFO", message);
    public static void Warn(string message) => Write("WARN", message);
    public static void Error(string message) => Write("ERROR", message);

    public static IReadOnlyList<string> Snapshot()
    {
        lock (Gate) return Recent.ToArray();
    }

    private static void Write(string level, string message)
    {
        string line = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] [{level}] {message}";
        lock (Gate)
        {
            Recent.Enqueue(line);
            while (Recent.Count > MaxRecent) Recent.Dequeue();
            try { File.AppendAllText(LogPath, line + Environment.NewLine); } catch { }
        }
        try { LineAdded?.Invoke(line); } catch { }
    }
}
