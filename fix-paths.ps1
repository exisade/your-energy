# Скрипт для виправлення шляхів зображень в HTML файлах

Write-Host "Fixing image paths in HTML files..." -ForegroundColor Green

# Знайти всі HTML файли в src
$htmlFiles = Get-ChildItem -Path "src" -Recurse -Filter "*.html"

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Замінити всі варіанти неправильних шляхів
    $content = $content -replace 'src="\./img/', 'src="/img/'
    $content = $content -replace 'src="img/', 'src="/img/'
    $content = $content -replace "src='\./img/", "src='/img/"
    $content = $content -replace "src='img/", "src='/img/"
    
    # Зберегти тільки якщо були зміни
    if ($content -ne $originalContent) {
        Set-Content $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.FullName)" -ForegroundColor Yellow
    }
}

Write-Host "`nDone! Now run: npm run build" -ForegroundColor Green
