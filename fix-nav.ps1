$files = Get-ChildItem -Path .\app -Recurse -Include *.tsx
foreach ($file in $files) {
    $c = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $o = $c
    
    # 1. Make text gold
    $c = $c -replace 'text-white hover:text-gold-bright transition text-sm font-bold tracking-wider uppercase drop-shadow-md', 'text-gold-bright hover:text-white transition text-sm font-bold tracking-wider uppercase drop-shadow-lg'
    $c = $c -replace 'text-white hover:text-gold transition text-sm font-medium', 'text-gold-bright hover:text-white transition text-sm font-bold'
    $c = $c -replace 'text-ivory/80 hover:text-gold transition text-sm font-medium', 'text-gold-bright hover:text-white transition text-sm font-bold'
    
    # 2. Fix broken characters using Unicode codes (Safe from quotes breaking)
    $c = $c -replace 'â†', '\u2190'       # Left arrow
    $c = $c -replace 'â€”', '\u2014'       # Em dash
    $c = $c -replace 'ðŸ›’', '\uD83D\uDED2' # Cart
    $c = $c -replace 'ðŸ“ž', '\uD83D\uDCDE' # Phone

    if ($c -ne $o) {
        [System.IO.File]::WriteAllText($file.FullName, $c, [System.Text.UTF8Encoding]::new($false))
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
    }
}
Write-Host "Done!" -ForegroundColor Cyan
