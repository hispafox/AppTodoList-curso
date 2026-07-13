#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Genera informe HTML de cobertura de tests en local
.DESCRIPTION
    Ejecuta los tests con cobertura, instala ReportGenerator si no existe,
    y genera un informe HTML detallado en la carpeta coverage-report/
.EXAMPLE
    .\generar-informe-cobertura.ps1
#>

Write-Host "🧪 Ejecutando tests con cobertura..." -ForegroundColor Cyan
dotnet test --configuration Release --collect:"XPlat Code Coverage" --results-directory TestResults

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Los tests fallaron" -ForegroundColor Red
    exit 1
}

Write-Host "`n📊 Generando informe HTML de cobertura..." -ForegroundColor Cyan

# Instalar ReportGenerator si no existe
if (-not (Test-Path ".\.tools\reportgenerator.exe")) {
    Write-Host "📥 Instalando ReportGenerator..." -ForegroundColor Yellow
    dotnet tool install --tool-path ./.tools dotnet-reportgenerator-globaltool
}

# Generar informe
.\.tools\reportgenerator.exe `
    -reports:TestResults\**\coverage.cobertura.xml `
    -targetdir:coverage-report `
    -reporttypes:HtmlInline_AzurePipelines

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Informe generado en: coverage-report\index.html" -ForegroundColor Green
    Write-Host "`n🌐 Abriendo informe en el navegador..." -ForegroundColor Cyan
    Start-Process coverage-report\index.html
} else {
    Write-Host "❌ Error al generar el informe" -ForegroundColor Red
    exit 1
}
