using System;
using System.Windows.Forms;

namespace AuraXGameLab;

internal static class Program
{
    [STAThread]
    static void Main()
    {
        ApplicationConfiguration.Initialize();
        var state = new AppState();
        Application.Run(new MainForm(state));
    }
}
