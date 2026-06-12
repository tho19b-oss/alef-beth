# Startet einen kleinen lokalen Webserver für die Alef-Beth-App und öffnet den Browser.
# Nötig, weil der Service Worker (Offline-Funktion) nicht über file:// läuft.
# Aufruf:  Rechtsklick → "Mit PowerShell ausführen"  (oder "App starten.bat" doppelklicken)

param(
    [int]$Port = 8351,
    [switch]$NoBrowser
)

$root = $PSScriptRoot
$mime = @{
    '.html'        = 'text/html; charset=utf-8'
    '.js'          = 'text/javascript; charset=utf-8'
    '.css'         = 'text/css; charset=utf-8'
    '.json'        = 'application/json; charset=utf-8'
    '.webmanifest' = 'application/manifest+json; charset=utf-8'
    '.svg'         = 'image/svg+xml'
    '.png'         = 'image/png'
    '.ico'         = 'image/x-icon'
    '.woff2'       = 'font/woff2'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
try {
    $listener.Start()
} catch {
    Write-Host "Konnte Port $Port nicht oeffnen: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "  Alef Beth laeuft auf  http://localhost:$Port/" -ForegroundColor Green
Write-Host "  Zum Beenden dieses Fenster schliessen (oder Strg+C)." -ForegroundColor DarkGray
Write-Host ""

if (-not $NoBrowser) { Start-Process "http://localhost:$Port/" }

while ($listener.IsListening) {
    try { $ctx = $listener.GetContext() } catch { break }
    try {
        $req = $ctx.Request
        $res = $ctx.Response
        $isHead = $req.HttpMethod -eq 'HEAD'

        $rel = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath).TrimStart('/')
        if ($rel -eq '') { $rel = 'index.html' }
        $file = Join-Path $root $rel
        $full = try { [System.IO.Path]::GetFullPath($file) } catch { $null }

        if ($full -and $full.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase) -and (Test-Path $full -PathType Leaf)) {
            $ext = [System.IO.Path]::GetExtension($full).ToLowerInvariant()
            $type = $mime[$ext]
            if (-not $type) { $type = 'application/octet-stream' }
            $bytes = [System.IO.File]::ReadAllBytes($full)
            $res.StatusCode = 200
            $res.ContentType = $type
            $res.ContentLength64 = $bytes.Length
            if (-not $isHead) { $res.OutputStream.Write($bytes, 0, $bytes.Length) }
            Write-Host "200  $($req.HttpMethod)  /$rel"
        } else {
            $res.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes('404 - nicht gefunden')
            $res.ContentLength64 = $msg.Length
            if (-not $isHead) { $res.OutputStream.Write($msg, 0, $msg.Length) }
            Write-Host "404  $($req.HttpMethod)  /$rel" -ForegroundColor Yellow
        }
        $res.OutputStream.Close()
    } catch {
        Write-Host "Fehler bei Request: $_" -ForegroundColor Yellow
        try { $ctx.Response.Abort() } catch {}
    }
}
