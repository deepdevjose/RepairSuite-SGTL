# Script de configuración inicial para RepairSuite + SQL Server
Write-Host "🚀 Configuración de RepairSuite con SQL Server" -ForegroundColor Cyan
Write-Host "=" -ForegroundColor Gray

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Ejecuta este script desde la raíz del proyecto" -ForegroundColor Red
    exit 1
}

# Paso 1: Instalar dependencias
Write-Host "`n📦 Paso 1: Instalando dependencias..." -ForegroundColor Yellow
pnpm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error instalando dependencias. Intenta con 'npm install'" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencias instaladas" -ForegroundColor Green

# Paso 2: Configurar .env
Write-Host "`n⚙️ Paso 2: Configurando archivo .env..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Archivo .env creado desde .env.example" -ForegroundColor Green
    Write-Host "⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales de SQL Server" -ForegroundColor Yellow
    Write-Host "   Formato: sqlserver://localhost:1433;database=RepairSuite;user=USUARIO;password=PASSWORD;encrypt=true;trustServerCertificate=true" -ForegroundColor Cyan
    
    # Preguntar si quiere editar ahora
    $response = Read-Host "`n¿Quieres editar el .env ahora? (s/n)"
    if ($response -eq "s" -or $response -eq "S") {
        notepad .env
        Write-Host "⏸️  Presiona cualquier tecla cuando hayas guardado el .env..." -ForegroundColor Yellow
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    } else {
        Write-Host "⚠️  Recuerda editar el .env antes de continuar" -ForegroundColor Yellow
        exit 0
    }
} else {
    Write-Host "ℹ️  El archivo .env ya existe" -ForegroundColor Cyan
}

# Paso 3: Generar cliente de Prisma
Write-Host "`n🔧 Paso 3: Generando cliente de Prisma..." -ForegroundColor Yellow
pnpm db:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error generando cliente de Prisma" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Cliente de Prisma generado" -ForegroundColor Green

# Paso 4: Aplicar schema a la base de datos
Write-Host "`n🗄️ Paso 4: Creando tablas en SQL Server..." -ForegroundColor Yellow
Write-Host "   Asegúrate de que SQL Server esté corriendo y la BD 'RepairSuite' exista" -ForegroundColor Cyan
$response = Read-Host "¿Continuar? (s/n)"
if ($response -ne "s" -and $response -ne "S") {
    Write-Host "⚠️  Configuración pausada. Ejecuta 'pnpm db:push' cuando estés listo" -ForegroundColor Yellow
    exit 0
}

pnpm db:push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error creando tablas. Verifica tu conexión y credenciales" -ForegroundColor Red
    Write-Host "   Ayuda: Abre SSMS y ejecuta: CREATE DATABASE RepairSuite;" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Tablas creadas exitosamente" -ForegroundColor Green

# Paso 5: Poblar base de datos
Write-Host "`n🌱 Paso 5: ¿Quieres poblar la base de datos con datos de prueba?" -ForegroundColor Yellow
Write-Host "   Esto creará usuarios, clientes, productos, etc." -ForegroundColor Cyan
$response = Read-Host "¿Continuar? (s/n)"
if ($response -eq "s" -or $response -eq "S") {
    pnpm db:seed
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Base de datos poblada con datos de prueba" -ForegroundColor Green
        Write-Host "`n📝 Credenciales de acceso:" -ForegroundColor Cyan
        Write-Host "   Admin: jose@jlaboratories.com / password123" -ForegroundColor White
        Write-Host "   Técnico: kevis@jlaboratories.com / password123" -ForegroundColor White
        Write-Host "   Recepción: adriana@jlaboratories.com / password123" -ForegroundColor White
    } else {
        Write-Host "⚠️  Error poblando la base de datos" -ForegroundColor Yellow
    }
}

# Resumen final
Write-Host "`n" -ForegroundColor Green
Write-Host "🎉 ¡Configuración completada!" -ForegroundColor Green
Write-Host "=" -ForegroundColor Gray
Write-Host "`nPróximos pasos:" -ForegroundColor Cyan
Write-Host "1. Ejecuta: pnpm dev" -ForegroundColor White
Write-Host "2. Abre: http://localhost:3000" -ForegroundColor White
Write-Host "3. (Opcional) Abre Prisma Studio: pnpm db:studio" -ForegroundColor White
Write-Host "`nDocumentación completa en: DATABASE_SETUP.md" -ForegroundColor Yellow
