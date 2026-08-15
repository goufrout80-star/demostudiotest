namespace AuraXGameLab;

public sealed class AppState
{
    public bool OverlayEnabled { get; set; } = true;
    public bool EspBoxes { get; set; } = true;
    public bool Crosshair { get; set; } = true;
    public bool AimTrainerFov { get; set; } = true;
    public int AimTrainerRadius { get; set; } = 120;
    public bool SpeedTrainer { get; set; } = false;
    public bool InvulnerabilitySimulation { get; set; } = false;
    public string ProcessName { get; set; } = "ac_client";
}
