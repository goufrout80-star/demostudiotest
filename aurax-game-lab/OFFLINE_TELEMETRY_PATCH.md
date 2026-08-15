# AuraX Beta 0.6 - AssaultCube OFFLINE telemetry patch

This patch is intentionally limited to **single-player / bot mode**. It refuses to write telemetry when AssaultCube is in a multiplayer session.

Official AssaultCube source: `assaultcube/AC`.

## 1. Add this code to `source/src/clientgame.cpp`

Place it after the global `player1` / `players` declarations near the top of the file.

```cpp
// AuraX local training telemetry. OFFLINE/BOT MODE ONLY.
// Writes a small JSON snapshot into the current user's TEMP directory.
static void auraxtelemetry()
{
    // Hard guardrail: never expose this data in a network multiplayer session.
    if(!m_botmode || multiplayer(NULL) || !player1) return;

    const char *tmp = getenv("TEMP");
    if(!tmp || !*tmp) tmp = getenv("TMP");
    if(!tmp || !*tmp) tmp = ".";

    string path;
    formatstring(path)("%s/aurax_assaultcube_telemetry.json", tmp);

    FILE *f = fopen(path, "w");
    if(!f) return;

    fprintf(f,
        "{\"version\":1,\"offline\":true,\"timestamp\":%d,"
        "\"camera\":{\"x\":%.6f,\"y\":%.6f,\"z\":%.6f,\"yaw\":%.6f,\"pitch\":%.6f,\"fov\":%.6f},"
        "\"entities\":[",
        totalmillis,
        player1->o.x, player1->o.y, player1->o.z,
        player1->yaw, player1->pitch, fovy);

    bool first = true;
    loopv(players)
    {
        playerent *p = players[i];
        if(!p || p == player1) continue;

        if(!first) fprintf(f, ",");
        first = false;

        // Use a generated label instead of player-controlled strings so the JSON
        // cannot be broken by quotes or other characters in names.
        fprintf(f,
            "{\"id\":%d,\"name\":\"BOT_%d\",\"health\":%d,\"team\":%d,"
            "\"alive\":%s,\"x\":%.6f,\"y\":%.6f,\"z\":%.6f}",
            p->clientnum,
            p->clientnum,
            p->health,
            p->team,
            p->state == CS_ALIVE ? "true" : "false",
            p->o.x, p->o.y, p->o.z);
    }

    fprintf(f, "]}");
    fclose(f);
}
COMMAND(auraxtelemetry, "");
```

If your compiler reports missing declarations for `FILE`, `fopen`, `fprintf`, `fclose`, or `getenv`, add these includes near the top:

```cpp
#include <cstdio>
#include <cstdlib>
```

## 2. Add the local CubeScript loop

Add this to your local `config/autoexec.cfg` for the modified training build:

```text
alias aurax_telemetry_loop [
    auraxtelemetry
    sleep 50 [aurax_telemetry_loop]
]
aurax_telemetry_loop
```

That writes a snapshot about 20 times per second.

## 3. What Beta 0.6 reads

AuraX Game Lab reads:

```text
%TEMP%\aurax_assaultcube_telemetry.json
```

The overlay rejects the snapshot unless:

- `offline` is `true`
- `version` is `1`
- the file is less than two seconds old

The source command itself refuses to write when `multiplayer(NULL)` is true, so this training telemetry path is for local bot/single-player sessions only.

## Expected log

When everything is connected:

```text
REAL OFFLINE TELEMETRY ACTIVE: 5 entities
```

If the stock/unmodified AssaultCube executable is used, Beta 0.6 will simply say that it is waiting for offline telemetry instead of drawing fake ESP boxes.
