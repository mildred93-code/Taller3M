#!/usr/bin/env bash
set -e

echo "=== [1/4] Instalando PostgreSQL ==="
sudo apt update -y
sudo apt install -y postgresql postgresql-contrib

echo "=== [2/4] Configurando Base de Datos y Usuario ==="
sudo -u postgres psql -c "DROP DATABASE IF EXISTS tienda_db;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE tienda_db;"
sudo -u postgres psql -c "DROP USER IF EXISTS tienda_user;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE USER tienda_user WITH ENCRYPTED PASSWORD 'admin123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE tienda_db TO tienda_user;"
sudo -u postgres psql -d tienda_db -c "GRANT ALL ON SCHEMA public TO tienda_user;"

echo "=== [3/4] Habilitando conexiones remotas ==="
PG_CONF=$(sudo find /etc/postgresql -name "postgresql.conf" | head -n 1)
PG_HBA=$(sudo find /etc/postgresql -name "pg_hba.conf" | head -n 1)

# Habilitar escucha en todas las interfaces
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/g" "$PG_CONF"
sudo sed -i "s/listen_addresses = 'localhost'/listen_addresses = '*'/g" "$PG_CONF"

# Permitir conexiones remotas
if ! sudo grep -q "0.0.0.0/0" "$PG_HBA"; then
    echo "host    all             all             0.0.0.0/0               md5" | sudo tee -a "$PG_HBA"
fi

sudo systemctl restart postgresql

echo "=== [4/4] Ejecutando tablas.sql ==="
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCHEMA_PATH="$SCRIPT_DIR/../bd/tablas.sql"

if [ -f "$SCHEMA_PATH" ]; then
    cat "$SCHEMA_PATH" | sudo -u postgres psql -d tienda_db
    sudo -u postgres psql -d tienda_db -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tienda_user;"
    sudo -u postgres psql -d tienda_db -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tienda_user;"
    sudo -u postgres psql -d tienda_db -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO tienda_user;"
    sudo -u postgres psql -d tienda_db -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO tienda_user;"
    echo "Tablas creadas y permisos otorgados a tienda_user exitosamente."
else
    echo "Error: No se encontró el archivo $SCHEMA_PATH"
    exit 1
fi

echo ""
echo "=========================================================="
echo "Base de datos configurada con éxito."
echo "IP Privada de esta máquina: $(hostname -I | awk '{print $1}')"
echo "=========================================================="
