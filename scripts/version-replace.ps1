param(
    [Parameter(Mandatory = $true)]
    [String]$BuildName = '0.0.0',

    [Parameter(Mandatory = $true)]
    [String]$WorkingDirectory = '0.0.0'
) 

$VersionRegex = "\d+\.\d+\.\d+"
$VersionData = [regex]::matches($BuildName, $VersionRegex)

if ($VersionData.Count -eq 0) {
    Write-Error "Could not find version number data in build name ($BuildName)"
    exit 1
}

$Version = $VersionData[0]

Write-Host "----------------------------------------------------------------------"
Write-Host "build name:=$BuildName, directory:=$WorkingDirectory version:=$Version"
Write-Host "----------------------------------------------------------------------"

$Files = Get-ChildItem $WorkingDirectory -recurse -Include "package.json" -Exclude "*node_modules*", "*docs*"

foreach ($File in $Files) {
    $IsSourceFile = (([regex]::matches($File, '/src/')).Count -gt 0)

    if ($IsSourceFile -eq $false) {
        continue
    }

    Write-Host "attempting to change version (file-path:=$File) ..."

    $FileContent = Get-Content($File)
    # attrib $file -r
    $ChangeVersionRegex = """version"": ""$VersionRegex"""
    $Replacement = """version"": ""$Version"""
    $FileContent -replace $ChangeVersionRegex, $Replacement | Out-File $File
    
    $ChangedContent = Get-Content($File)
    $ChangedContentMatches = [regex]::matches($ChangedContent, $Replacement)
    
    if ($ChangedContentMatches.Count -gt 0) {
        Write-Host "version applied (file-path:=$File)"
        # Write-Host $ChangedContent
        continue
    }

    Write-Error "Failed to replace version number (file-path:=$File)"
    exit 1
}