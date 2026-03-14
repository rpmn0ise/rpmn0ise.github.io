# generate-all-wiki.ps1
# Script PowerShell pour générer toutes les pages wiki HTML

Write-Host "🚀 Génération de toutes les pages wiki..." -ForegroundColor Green
Write-Host ""

$mdFiles = Get-ChildItem -Path "wiki\sources\*.md"

if ($mdFiles.Count -eq 0) {
    Write-Host "❌ Aucun fichier .md trouvé dans wiki\sources\" -ForegroundColor Red
    exit 1
}

$success = 0
$failed = 0

foreach ($file in $mdFiles) {
    Write-Host "⏳ Traitement de $($file.Name)..." -ForegroundColor Yellow
    
    try {
        python scripts\update-wiki.py $file.FullName
        $success++
    }
    catch {
        Write-Host "❌ Erreur: $_" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "✅ Terminé ! $success réussies, $failed échouées" -ForegroundColor Green
