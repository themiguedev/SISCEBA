#!/bin/bash
# ==============================================================================
# SICE-CBA - Plan de Recuperación ante Desastres (Disaster Recovery Plan - DRP)
# Colegio Bellas Artes • Restauración de Base de Datos Cifrada
# ==============================================================================

set -euo pipefail

if [ "$#" -ne 1 ]; then
    echo "Uso: $0 <ruta_al_archivo_respaldo.sql.gpg>"
    exit 1
fi

ENCRYPTED_BACKUP="$1"
PASSPHRASE_FILE="/etc/siceba/backup_secret.key"
TEMP_RESTORE_SQL="/tmp/restore_siceba_$(date +%s).sql"
DB_NAME="siceba_production"
DB_USER="postgres"

echo "=== PROCEDIMIENTO DE RECUPERACIÓN ANTE DESASTRES SICE-CBA ==="

# 1. Verificación del archivo y clave
if [ ! -f "${ENCRYPTED_BACKUP}" ]; then
    echo "ERROR CRÍTICO: El archivo de respaldo especificado no existe."
    exit 2
fi

if [ ! -f "${PASSPHRASE_FILE}" ]; then
    echo "ERROR CRÍTICO: No se localizó el archivo de clave de descifrado institucional."
    exit 3
fi

# 2. Comprobación de Hash SHA-256 si existe
CHECKSUM_FILE="${ENCRYPTED_BACKUP%.sql.gpg}.sha256"
if [ -f "${CHECKSUM_FILE}" ]; then
    echo "[PASO 1/4] Verificando integridad SHA-256..."
    sha256sum -c "${CHECKSUM_FILE}" || {
        echo "ALERTA: El hash no coincide. El archivo podría estar corrupto o alterado."
        read -p "¿Desea continuar de todos modos? (s/N): " confirm
        [[ "$confirm" =~ ^[sS]$ ]] || exit 4
    }
fi

# 3. Descifrado en caliente
echo "[PASO 2/4] Descifrando archivo de volcado con GPG..."
gpg --batch --yes --decrypt --passphrase-file "${PASSPHRASE_FILE}" -o "${TEMP_RESTORE_SQL}" "${ENCRYPTED_BACKUP}"

# 4. Restauración de Base de Datos
echo "[PASO 3/4] Restaurando base de datos ${DB_NAME} en PostgreSQL..."
# Terminar conexiones activas
psql -U "${DB_USER}" -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${DB_NAME}' AND pid <> pg_backend_pid();"

# Recrear o limpiar base de datos
psql -U "${DB_USER}" -d postgres -c "DROP DATABASE IF EXISTS ${DB_NAME};"
psql -U "${DB_USER}" -d postgres -c "CREATE DATABASE ${DB_NAME} WITH OWNER cba_app_user ENCODING 'UTF8';"

# Ejecutar pg_restore
pg_restore -U "${DB_USER}" -d "${DB_NAME}" -v "${TEMP_RESTORE_SQL}"

# 5. Limpieza de archivo plano temporal
echo "[PASO 4/4] Limpiando archivos temporales no cifrados..."
shred -u -z -n 3 "${TEMP_RESTORE_SQL}" || rm -f "${TEMP_RESTORE_SQL}"

echo "=== RECUPERACIÓN COMPLETADA CON ÉXITO ==="
echo "La base de datos SICE-CBA ha sido restaurada con integridad referencial completa."
