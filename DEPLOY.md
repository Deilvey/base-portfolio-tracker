# 🚀 Deploy ke Vercel

## Cara Deploy:

### Option 1: Via Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login ke Vercel:
```bash
vercel login
```

3. Deploy:
```bash
cd /root/base-portfolio-tracker
vercel --prod
```

### Option 2: Via GitHub + Vercel Dashboard

1. Push ke GitHub:
```bash
# Create repo di GitHub dulu
git remote add origin https://github.com/YOUR_USERNAME/base-portfolio-tracker.git
git push -u origin master
```

2. Import di Vercel:
- Buka https://vercel.com/new
- Import repository GitHub kamu
- Klik "Deploy"

### Option 3: Via Vercel Dashboard (Drag & Drop)

1. Zip project:
```bash
cd /root
tar -czf base-portfolio-tracker.tar.gz base-portfolio-tracker/
```

2. Upload di https://vercel.com/new

## Setelah Deploy:

1. Copy URL deployment (misal: `https://base-portfolio-tracker.vercel.app`)

2. Update `manifest.json`:
```json
{
  "homeUrl": "https://YOUR-DEPLOYMENT-URL.vercel.app"
}
```

3. Test di Farcaster:
- Share link di Farcaster
- Klik link → akan buka sebagai Mini App

## Environment Variables (Optional):

Kalau mau pakai RPC custom:
- `NEXT_PUBLIC_BASE_RPC_URL` = your RPC URL

---

## 📱 Cara Pakai di Farcaster:

1. Buka Warpcast app
2. Share link deployment kamu
3. User klik link → Mini App terbuka
4. Connect wallet → lihat portfolio! 💼

## Troubleshooting:

- **Loading terus?** → Pastikan `sdk.actions.ready()` dipanggil
- **Wallet tidak connect?** → Cek SDK version terbaru
- **Balance 0?** → Pastikan address benar & ada balance di Base

---

**Built with ❤️ for Base & Farcaster community**
