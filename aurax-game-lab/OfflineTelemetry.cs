using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

namespace AuraXGameLab;

internal sealed class OfflineTelemetryFrame
{
    public int Version { get; set; }
    public bool Offline { get; set; }
    public long Timestamp { get; set; }
    public TelemetryCamera Camera { get; set; } = new();
    public List<TelemetryEntity> Entities { get; set; } = new();
}

internal sealed class TelemetryCamera
{
    public float X { get; set; }
    public float Y { get; set; }
    public float Z { get; set; }
    public float Yaw { get; set; }
    public float Pitch { get; set; }
    public float Fov { get; set; } = 90f;
}

internal sealed class TelemetryEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = "BOT";
    public int Health { get; set; }
    public int Team { get; set; }
    public bool Alive { get; set; }
    public float X { get; set; }
    public float Y { get; set; }
    public float Z { get; set; }
}

internal static class OfflineTelemetry
{
    public static string TelemetryPath => Path.Combine(Path.GetTempPath(), "aurax_assaultcube_telemetry.json");

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public static bool TryRead(out OfflineTelemetryFrame frame, out string reason)
    {
        frame = new OfflineTelemetryFrame();
        reason = "Telemetry not available.";

        try
        {
            if (!File.Exists(TelemetryPath))
            {
                reason = $"Waiting for offline telemetry file: {TelemetryPath}";
                return false;
            }

            var age = DateTime.UtcNow - File.GetLastWriteTimeUtc(TelemetryPath);
            if (age.TotalSeconds > 2.0)
            {
                reason = $"Offline telemetry is stale ({age.TotalSeconds:0.0}s old).";
                return false;
            }

            string json = File.ReadAllText(TelemetryPath);
            var parsed = JsonSerializer.Deserialize<OfflineTelemetryFrame>(json, JsonOptions);
            if (parsed is null)
            {
                reason = "Telemetry JSON could not be parsed.";
                return false;
            }

            if (!parsed.Offline)
            {
                reason = "Telemetry rejected because the game did not mark the session as offline/bot mode.";
                return false;
            }

            if (parsed.Version != 1)
            {
                reason = $"Unsupported telemetry version {parsed.Version}.";
                return false;
            }

            frame = parsed;
            reason = $"Offline telemetry active ({frame.Entities.Count} entities).";
            return true;
        }
        catch (IOException ex)
        {
            reason = $"Telemetry file busy: {ex.Message}";
            return false;
        }
        catch (Exception ex)
        {
            reason = $"Telemetry error: {ex.GetType().Name}: {ex.Message}";
            return false;
        }
    }
}
