#!/bin/bash
# ==============================================================================
# SICE-CBA - Script de Respaldo Automatizado, Cifrado AES-256 y Estrategia 3-2-1
# Colegio Bellas Artes • Servidor de Producción On-Premise
# ==============================================================================

set -euo pipefail

# 1. Configuración de Variables
DB_NAME="siceba_production"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/siceba"
TEMP_DUMP="${BACKUP_DIR}/siceba_${TIMESTAMP}.sql"
ENCRYPTED_DUMP="${BACKUP_DIR}/siceba_${TIMESTAMP}.sql.gpg"
CHECKSUM_FILE="${BACKUP_DIR}/siceba_${TIMESTAMP}.sha256"

# Clave o passphrase de cifrado seguro (obtenida preferiblemente de secret manager o archivo restringido 400)
ENCRYPTION_PASSPHRASE_FILE="/etc/siceba/backup_secret.key"

mkdir -p "${BACKUP_DIR}"
chmod 700 "${BACKUP_DIR}"

echo "[$(date)] INICIANDO RESPALDO DE SICE-CBA..."

# 2. Volcado en caliente con pg_dump (consistente y transaccional)
pg_dump -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -F c -b -v -f "${TEMP_DUMP}" "${DB_NAME}"

# 3. Cifrado simétrico AES-256 con GPG (Anti-Ransomware y confidencialidad)
echo "[$(date)] CIFRANDO RESPALDO CON ALGORITMO AES-256..."
gpg --batch --yes --symmetric --cipher-algo AES256 --passphrase-file "${ENCRYPTION_PASSPHRASE_FILE}" -o "${ENCRYPTED_DUMP}" "${TEMP_DUMP}"

# 4. Generación de Hash SHA-256 para verificación de integridad
sha256sum "${ENCRYPTED_DUMP}" > "${CHECKSUM_FILE}"

# 5. Eliminación segura del archivo temporal sin cifrar
shred -u -z -n 3 "${TEMP_DUMP}" || rm -f "${TEMP_DUMP}"

# 6. Replicación Estrategia 3-2-1
# Destino 1: Servidor Local (/var/backups/siceba)
# Destino 2: NAS Local CBA (Almacenamiento en red institucional)
NAS_DESTINATION="/mnt/cba_nas/backups/siceba"
if [ -d "${NAS_DESTINATION}" ]; then
    echo "[$(date)] COPIANDO RESPALDO A NAS LOCAL..."
    cp "${ENCRYPTED_DUMP}" "${CHECKSUM_FILE}" "${NAS_DESTINATION}/"
fi

# Destino 3: Repositorio Inmutable / Air-Gapped (Dispositivo de almacenamiento desconectable)
AIRGAP_MOUNT="/mnt/airgap_drive"
if mountpoint -q "${AIRGAP_MOUNT}"; then
    echo "[$(date)] COPIANDO RESPALDO A UNIDAD AIR-GAPPED OFF-SITE..."
    cp "${ENCRYPTED_DUMP}" "${CHECKSUM_FILE}" "${AIRGAP_MOUNT}/"
    sync
    echo "[AVISO DE SEGURIDAD CBA] Respaldo copiado exitosamente a unidad desconectable física. Desmonte y guarde en bóveda."
fi

# 7. Política de Retención Local: Eliminar copias de más de 30 días
find "${BACKUP_DIR}" -type f -name "siceba_*.sql.gpg" -mtime +30 -delete
find "${BACKUP_DIR}" -type f -name "siceba_*.sha256" -mtime +30 -delete

echo "[$(date)] RESPALDO CIFRADO GENERADO EXITOSAMENTE: ${ENCRYPTED_DUMP}"
