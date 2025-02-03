# Get all files recursively, excluding node_modules, dist, and .git directories
$files = Get-ChildItem -Path . -Recurse -File |
    Where-Object {
        $_.FullName -notmatch '\\node_modules\\' -and
        $_.FullName -notmatch '\\dist\\' -and
        $_.FullName -notmatch '\\.git\\' -and
        $_.Extension -match '\.(js|jsx|ts|tsx|css|scss|less|html|vue)$'
    }

# Initialize counters
$totalLines = 0
$fileStats = @{}

# Count lines for each file type
foreach ($file in $files) {
    $content = Get-Content $file.FullName
    $lineCount = @($content).Count
    $totalLines += $lineCount
    
    # Track statistics by file extension
    $ext = $file.Extension
    if (!$fileStats.ContainsKey($ext)) {
        $fileStats[$ext] = @{
            'count' = 0
            'lines' = 0
        }
    }
    $fileStats[$ext]['count']++
    $fileStats[$ext]['lines'] += $lineCount
}

# Display results
Write-Host "`nTotal Lines of Code: $totalLines`n"
Write-Host "Breakdown by file type:"
Write-Host "---------------------"
foreach ($ext in $fileStats.Keys | Sort-Object) {
    $count = $fileStats[$ext]['count']
    $lines = $fileStats[$ext]['lines']
    Write-Host "$ext files: $count files with $lines lines"
}