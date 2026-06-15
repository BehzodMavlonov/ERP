# Deploy: Vercel + Neon

## 1. Ma'lumotlar bazasi (Neon)

1. [neon.tech](https://neon.tech) da yangi loyiha yarating.
2. **Connection Details** bo'limidan ikkita ulanish satrini oling:
   - **Pooled connection** → `DATABASE_URL`
   - **Direct connection** → `DIRECT_URL`
3. Migratsiyalarni production bazasiga qo'llash:
   ```bash
   DATABASE_URL="<direct-url>" DIRECT_URL="<direct-url>" npx prisma migrate deploy
   ```
4. Boshlang'ich admin yaratish:
   ```bash
   DATABASE_URL="<direct-url>" npm run seed
   ```

## 2. Vercel

1. Repozitoriyani Vercel'ga ulang.
2. Quyidagi muhit o'zgaruvchilarini qo'shing (`.env.example` ga qarang):
   - `DATABASE_URL`, `DIRECT_URL` — Neon'dan
   - `NEXTAUTH_SECRET` — `openssl rand -base64 32`
   - `NEXTAUTH_URL` — `https://<your-domain>.vercel.app`
   - `TELEGRAM_BOT_TOKEN` — @BotFather'dan
   - `CRON_SECRET` — `openssl rand -base64 32`
3. Deploy qiling.

## 3. Telegram bot

1. Deploy tugagandan so'ng, admin sifatida tizimga kiring va **Sozlamalar** sahifasiga o'ting.
2. **"Webhookni o'rnatish"** tugmasini bosing — bu `NEXTAUTH_URL` asosida Telegram webhook'ni sozlaydi.
3. Botga `/start` yuborib, ushbu chatni bildirishnomalar uchun ulang.

## 4. Kunlik hisobot (Vercel Cron)

`vercel.json` faylida `/api/telegram/cron` uchun kunlik cron (har kuni 18:00 UTC, ya'ni Toshkent vaqti bilan 23:00) sozlangan. Vercel `CRON_SECRET` muhit o'zgaruvchisi mavjud bo'lsa, so'rovga avtomatik `Authorization: Bearer $CRON_SECRET` headerini qo'shadi — qo'shimcha sozlash kerak emas.

## 5. Lokal development

```bash
cp .env.example .env
# .env faylida DATABASE_URL/DIRECT_URL ni lokal Postgres'ga moslang
npx prisma migrate dev
npm run seed
npm run dev
```
