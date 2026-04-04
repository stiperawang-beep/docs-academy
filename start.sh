#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════════════╗
# ║          victory.docs — Full Auto Launch Script                 ║
# ║   Docker + ngrok Public Tunnel | by Wendra                     ║
# ╚══════════════════════════════════════════════════════════════════╝

set -euo pipefail

# ─── ANSI Colors ────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# ─── CONFIG ─────────────────────────────────────────────────────────
APP_PORT=3000
CONTAINER_NAME="victory_docs_app"
NGROK_TOKEN="2wGYKA6kbVkUkDjjRdEzxK5BPMW_5Br3voaCHN6ab2QevcXfu"
NGROK_API_URL="http://localhost:4040/api/tunnels"
HEALTH_CHECK_RETRIES=30          # max 30 x 5s = 150s tunggu container
HEALTH_CHECK_INTERVAL=5          # detik antar retry
NGROK_WAIT=5                     # detik tunggu ngrok siap

# ─── Utilities ──────────────────────────────────────────────────────
print_banner() {
  echo -e ""
  echo -e "${CYAN}${BOLD}╔══════════════════════════════════════════════════════════════╗${RESET}"
  echo -e "${CYAN}${BOLD}║          🚀  victory.docs — Auto Launch Script               ║${RESET}"
  echo -e "${CYAN}${BOLD}║       Docker · Velite · Next.js · ngrok Public Tunnel        ║${RESET}"
  echo -e "${CYAN}${BOLD}╚══════════════════════════════════════════════════════════════╝${RESET}"
  echo -e ""
}

step() {
  echo -e "\n${CYAN}${BOLD}▶ $1${RESET}"
}

ok() {
  echo -e "  ${GREEN}✔  $1${RESET}"
}

warn() {
  echo -e "  ${YELLOW}⚠  $1${RESET}"
}

fail() {
  echo -e "  ${RED}✖  $1${RESET}"
}

# ─── Cleanup on exit ────────────────────────────────────────────────
cleanup() {
  echo -e "\n${YELLOW}${BOLD}🛑 Menghentikan semua layanan...${RESET}"
  # Hentikan ngrok jika berjalan
  if [ -f /tmp/ngrok_victory.pid ]; then
    NGROK_PID=$(cat /tmp/ngrok_victory.pid 2>/dev/null || true)
    if [ -n "$NGROK_PID" ] && kill -0 "$NGROK_PID" 2>/dev/null; then
      kill "$NGROK_PID" && ok "ngrok dihentikan."
    fi
    rm -f /tmp/ngrok_victory.pid
  fi
  # Tanya user apakah ingin menghentikan Docker
  echo -e ""
  read -rp "  Hentikan Docker container juga? (y/N): " STOP_DOCKER
  if [[ "$STOP_DOCKER" =~ ^[Yy]$ ]]; then
    docker compose down && ok "Docker container dihentikan."
  else
    warn "Docker container tetap berjalan di background."
    echo -e "  Untuk menghentikan manual: ${BOLD}docker compose down${RESET}"
  fi
  echo -e ""
  echo -e "${BOLD}  victory.docs telah dihentikan. Sampai jumpa! 👋${RESET}"
}
trap cleanup EXIT INT TERM

# ════════════════════════════════════════════════════════════════════
print_banner

# ─── STEP 1: Cek dependensi ─────────────────────────────────────────
step "[1/5] Memeriksa dependensi yang dibutuhkan..."

check_cmd() {
  if ! command -v "$1" &>/dev/null; then
    fail "$1 tidak ditemukan! Install terlebih dahulu: $2"
    exit 1
  fi
  ok "$1 ditemukan ($(command -v "$1"))"
}

check_cmd "docker"  "https://docs.docker.com/get-docker/"
check_cmd "curl"    "apt install curl / brew install curl"
check_cmd "jq"      "apt install jq  / brew install jq  / choco install jq"

# Cek Docker Daemon aktif
if ! docker info &>/dev/null; then
  fail "Docker daemon tidak berjalan! Jalankan Docker Desktop terlebih dahulu."
  exit 1
fi
ok "Docker daemon aktif"

# ─── STEP 2: Install/check ngrok & set authtoken ────────────────────
step "[2/5] Menyiapkan ngrok & autentikasi token..."

if ! command -v ngrok &>/dev/null; then
  warn "ngrok tidak ada di PATH. Mencoba instalasi otomatis..."

  OS=$(uname -s | tr '[:upper:]' '[:lower:]')
  ARCH=$(uname -m)

  if [[ "$ARCH" == "x86_64" ]]; then ARCH="amd64"; fi
  if [[ "$ARCH" == "aarch64" || "$ARCH" == "arm64" ]]; then ARCH="arm64"; fi

  NGROK_URL="https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-${OS}-${ARCH}.tgz"

  echo -e "  Mengunduh ngrok dari: ${NGROK_URL}"
  curl -sSL "$NGROK_URL" -o /tmp/ngrok.tgz
  tar -xzf /tmp/ngrok.tgz -C /tmp
  sudo mv /tmp/ngrok /usr/local/bin/ngrok 2>/dev/null || mv /tmp/ngrok "$HOME/.local/bin/ngrok" 2>/dev/null

  if ! command -v ngrok &>/dev/null; then
    fail "Instalasi ngrok gagal. Download manual: https://ngrok.com/download"
    exit 1
  fi
  ok "ngrok berhasil diinstal"
else
  ok "ngrok ditemukan: $(ngrok version)"
fi

# Set authtoken ngrok
ngrok config add-authtoken "$NGROK_TOKEN" &>/dev/null
ok "ngrok authtoken telah dikonfigurasi"

# ─── STEP 3: Build & jalankan Docker ────────────────────────────────
step "[3/5] Membangun & menjalankan Docker container..."

# Hentikan container lama jika ada
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  warn "Container '${CONTAINER_NAME}' lama ditemukan. Menghentikan..."
  docker compose down --remove-orphans
  ok "Container lama dihentikan"
fi

# Build & start Docker container (mode production)
echo -e "  ${YELLOW}Membangun Docker image... (ini butuh beberapa menit jika belum ada cache)${RESET}"
DOCKER_BUILD=1 docker compose up --build -d

ok "Docker container berhasil dimulai"

# ─── STEP 4: Health check container ─────────────────────────────────
step "[4/5] Menunggu aplikasi siap menerima koneksi..."

echo -e "  Menunggu server di http://localhost:${APP_PORT} ..."
RETRY=0
until curl -sf "http://localhost:${APP_PORT}" -o /dev/null; do
  RETRY=$((RETRY + 1))
  if [ "$RETRY" -ge "$HEALTH_CHECK_RETRIES" ]; then
    fail "Aplikasi tidak merespons setelah $((HEALTH_CHECK_RETRIES * HEALTH_CHECK_INTERVAL))s!"
    echo -e "  Periksa log container: ${BOLD}docker logs ${CONTAINER_NAME}${RESET}"
    exit 1
  fi
  echo -ne "  ⏳ Percobaan ${RETRY}/${HEALTH_CHECK_RETRIES}... (tunggu ${HEALTH_CHECK_INTERVAL}s)\r"
  sleep "$HEALTH_CHECK_INTERVAL"
done

echo -e "                                                              \r"
ok "Aplikasi berjalan di http://localhost:${APP_PORT}"

# ─── STEP 5: Jalankan ngrok & tampilkan URL publik ──────────────────
step "[5/5] Membuat tunnel ngrok & mendapatkan URL publik..."

# Matikan ngrok lama jika ada
pkill -f "ngrok http" 2>/dev/null || true
sleep 1

# Jalankan ngrok di background
ngrok http "$APP_PORT" \
  --log=stdout \
  --log-level=warn \
  > /tmp/ngrok_victory.log 2>&1 &

NGROK_PID=$!
echo "$NGROK_PID" > /tmp/ngrok_victory.pid

echo -e "  Menunggu ngrok membuat tunnel..."
sleep "$NGROK_WAIT"

# Ambil URL publik via ngrok API
PUBLIC_URL=$(curl -sf "$NGROK_API_URL" | jq -r '.tunnels[0].public_url' 2>/dev/null || echo "")

if [ -z "$PUBLIC_URL" ] || [ "$PUBLIC_URL" = "null" ]; then
  # Coba sekali lagi
  sleep 3
  PUBLIC_URL=$(curl -sf "$NGROK_API_URL" | jq -r '.tunnels[0].public_url' 2>/dev/null || echo "")
fi

# ─── Tampilkan hasil akhir ───────────────────────────────────────────
echo -e ""
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${GREEN}${BOLD}║           ✅  victory.docs BERHASIL DIJALANKAN!              ║${RESET}"
echo -e "${GREEN}${BOLD}╠══════════════════════════════════════════════════════════════╣${RESET}"
echo -e "${GREEN}${BOLD}║${RESET}                                                              ${GREEN}${BOLD}║${RESET}"
echo -e "${GREEN}${BOLD}║${RESET}  🏠  Lokal      : ${BOLD}http://localhost:${APP_PORT}${RESET}                      ${GREEN}${BOLD}║${RESET}"

if [ -n "$PUBLIC_URL" ] && [ "$PUBLIC_URL" != "null" ]; then
  echo -e "${GREEN}${BOLD}║${RESET}  🌐  Publik     : ${BOLD}${CYAN}${PUBLIC_URL}${RESET}  ${GREEN}${BOLD}║${RESET}"
  echo -e "${GREEN}${BOLD}║${RESET}  📊  Dashboard  : ${BOLD}http://localhost:4040${RESET}                    ${GREEN}${BOLD}║${RESET}"
  echo -e "${GREEN}${BOLD}║${RESET}                                                              ${GREEN}${BOLD}║${RESET}"
  echo -e "${GREEN}${BOLD}║${RESET}  🔗  Bagikan URL ini kepada siapapun untuk akses          ${GREEN}${BOLD}║${RESET}"
  echo -e "${GREEN}${BOLD}║${RESET}      ke victory.docs dari seluruh dunia! 🌍              ${GREEN}${BOLD}║${RESET}"
else
  warn "Tidak bisa mengambil URL publik otomatis."
  echo -e "  Buka ${BOLD}http://localhost:4040${RESET} untuk melihat URL ngrok secara manual."
fi

echo -e "${GREEN}${BOLD}║${RESET}                                                              ${GREEN}${BOLD}║${RESET}"
echo -e "${GREEN}${BOLD}║${RESET}  ℹ️   Tekan Ctrl+C untuk menghentikan semua layanan           ${GREEN}${BOLD}║${RESET}"
echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════════════════════════╝${RESET}"
echo -e ""

# ─── Tampilkan log ngrok secara live ────────────────────────────────
echo -e "${YELLOW}── ngrok live log (Ctrl+C untuk berhenti) ──────────────────────${RESET}"
tail -f /tmp/ngrok_victory.log
