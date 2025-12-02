$sourceDir = "Z:\ARCHIVOS"
$items = Get-ChildItem -Path $sourceDir

# Definición de Categorías Actualizada
$categories = @{
    "Juegos" = @("GTA", "SteamLibrary", "GTA SAN ANDREAS.rar")
    "Proyectos_Trabajo" = @("FREELANCE", "Proyectos EXPERTS", "Curriculums y Resumes", "documentacion experts", "TESIS", "ROBLOX") # ROBLOX movido aquí por ser proyectos de código
    "Diseño_Multimedia" = @("PIXEL", "pixel adobe", "SVG", "VIRTUAL IMAGENES", "landing forma.ai", "vectorizado.ai")
    "Software" = @("PROGRAMAS", "Tor Browser")
    "Backups" = @("copia huawei")
}

# Archivos/Carpetas a ignorar (incluye la carpeta actual del proyecto para no romper la sesión)
$ignored = @("KHANDA_Projects", "organize_files.ps1", "organize_folders.ps1", "Juegos", "Proyectos_Trabajo", "Diseño_Multimedia", "Software", "Backups", "Otros")

foreach ($item in $items) {
    if ($ignored -contains $item.Name) {
        Write-Host "Saltando (Ignorado/Ya organizado): $($item.Name)" -ForegroundColor Gray
        continue
    }

    $moved = $false
    
    foreach ($cat in $categories.Keys) {
        if ($categories[$cat] -contains $item.Name) {
            $destPath = Join-Path -Path $sourceDir -ChildPath $cat
            
            if (-not (Test-Path -Path $destPath)) {
                New-Item -ItemType Directory -Path $destPath | Out-Null
                Write-Host "Creada carpeta de categoría: $cat" -ForegroundColor Cyan
            }
            
            Move-Item -Path $item.FullName -Destination $destPath -Force
            Write-Host "Movido: $($item.Name) -> $cat" -ForegroundColor Green
            $moved = $true
            break
        }
    }
    
    if (-not $moved) {
        Write-Host "Sin categoría asignada (Se queda igual): $($item.Name)" -ForegroundColor Yellow
    }
}
