# Hướng dẫn cài đặt và chạy dự án SIAMS

Tài liệu ngắn này hướng dẫn cách thiết lập và chạy backend (`siams-be`) và frontend (`siams-fe`) trên máy phát triển (Windows PowerShell). Bao gồm ví dụ `.env` cho Docker và Node.js, các lệnh phổ biến để chạy ở chế độ development/production, và một số lưu ý môi trường (CORS, symlink `.env`, dịch vụ Docker sẵn có).

## Yêu cầu

- Node.js (LTS)
- npm hoặc yarn
- Docker & Docker Compose (nếu muốn chạy bằng Docker)
- PowerShell (Windows)

## Cấu trúc thư mục (tóm tắt)

- `siams-be/` — backend (Node.js / TypeScript)
- `siams-fe/` — frontend (Vite / React / TypeScript)
- `docker-compose.yml` — cấu hình docker-compose cho toàn bộ hệ thống

## Thiết lập biến môi trường

1. `.env` cho Docker (ở thư mục gốc)

   Tạo file `.env` ở thư mục gốc theo content `.env.example`. Ví dụ:

   ```powershell
   # Các biến sau là bắt buộc
   JWT_SECRET=
   MQTT_URL=mqtt://127.0.0.1:1883
   DB_USER=
   DB_PASSWORD=
   DB_NAME=
   ```

1. `.env` cho Node.js / `siams-be` (backend đã sử dụng env từ `siams-be/../.env`)

> Lưu ý copy hoặc tạo symlink đến env ở root cho db-migrate

1. `.env` cho `siams-fe` (chạy local)

   Tạo file `.env` ở thư mục gốc theo content `.env.example`. Ví dụ:

   ```powershell
   # siams-fe/.env
   PORT=33445 #đặt theo cors policy ở backend
   VITE_API_URL=http://localhost:44556/api/v1 #đặt theo url backend (mặc định)
   ```

## Lưu ý quan trọng

- CORS: Backend hiện chỉ cho phép CORS từ các origin sau: `http://localhost:33445` và `http://127.0.0.1:33445`. Nếu bạn chạy frontend trên cổng khác hoặc truy cập từ host khác, cập nhật cấu hình CORS trên backend hoặc thay đổi `VITE_API_URL` tương ứng.

- .env symlink: repository dùng symlink cho file `.env` ở backend để trợ giúp `db-migrate` tìm env do nó không phụ thuộc vào file env :

   ```powershell
   # Ví dụ: tạo symlink siams-be\.env -> ..\shared-envs\siams-be.e
   ln -s .env siams-be/.env
   ```

- Docker Compose: hiện tại `docker-compose.yml` đã thiết lập hai service chính là:

  - `emqx` — MQTT broker (EMQX)
  - `postgresdb` — PostgreSQL

  Các image/service khác trong `docker-compose.yml` có thể đang trong quá trình phát triển (chỉ là placeholder hoặc chưa sẵn sàng). Kiểm tra `docker-compose.yml` trước khi phụ thuộc vào chúng.

## Chạy backend (`siams-be`)

1. Đảm bảo Docker đang chạy.
2. Ở thư mục gốc của repo, chỉnh `.env` nếu cần.

   ```powershell
   cd C:\Users\dn200\repos\siams
   docker compose up -d emqx db
   ```

3. Vào thư mục backend, cài phụ thuộc:

   ```powershell
   cd C:\Users\dn200\repos\siams\siams-be
   npm install
   ```

4. chạy migration cho database:

   ```powershell
   npm run migrate:up
   ```

5. Biên dịch và chạy:

   ```powershell
   npm run start
   ```

   - Hoặc chạy chế độ development (watch):

   ```powershell
   npm run dev
   ```

> Kiểm tra `package.json` trong `siams-be/` để biết các script cụ thể (`build`, `start`, `dev`).

## Chạy frontend (`siams-fe`)

1. Cài phụ thuộc

   ```powershell
   cd C:\Users\dn200\repos\siams\siams-fe
   npm install
   ```

1. Chạy development (hot-reload)

   ```powershell
   npm run dev
   ```

1. Build production và serve tĩnh (optional)

   ```powershell
   npm run build
   # Dùng một static server để phục vụ thư mục dist
   npm install -g serve
   serve -s dist -l 3001
   ```

## Kiểm tra kết nối FE ↔ BE

- Đảm bảo `VITE_API_URL` (hoặc biến frontend tương đương) trỏ tới backend.
- Nếu backend chạy trong Docker, hãy map port ra host (ví dụ 3000) để frontend truy cập.

## Gỡ lỗi nhanh

- Thiếu biến môi trường: kiểm tra `.env` hoặc biến hệ thống.
- Cổng bị chiếm: kiểm tra port đang dùng.
- MQTT không kết nối: kiểm tra `MQTT_URL` và broker (EMQX) có đang chạy.

Khởi động broker EMQX bằng Docker:

```powershell
docker compose up -d emqx
```
