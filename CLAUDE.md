# 📌 Project Codebase Rules — Heavy Equipment Management System (Next.js)

## Framework & Versi
- Menggunakan **Next.js v14+** (App Router) dengan bahasa utama **TypeScript**.  
- State management memakai **Zustand** untuk global state dan React Context jika cakupan terbatas.  
- Styling menggunakan **Tailwind CSS** dengan komponen custom.  
- Form handling dengan **React Hook Form** dan **Zod** untuk validasi.  

---

## Struktur Folder
```
src/
  app/              # App Router pages, layouts, routes
  components/       # UI components (reusable)
  features/         # Modul fitur spesifik (e.g. equipment, maintenance)
  hooks/            # Custom hooks
  lib/              # Utilities, helpers, API clients
  services/         # API integration (REST/GraphQL)
  store/            # Zustand stores
  styles/           # Global styles
  types/            # TypeScript types & interfaces
  tests/            # Unit & integration tests
public/             # Static assets
```

---

## Konvensi Kode
- Seluruh file wajib menggunakan **TypeScript** (`.tsx` / `.ts`).  
- Komponen menggunakan **function component + hooks**, tidak ada class component.  
- Penamaan file dan folder memakai **kebab-case**, komponen memakai **PascalCase**.  
- API call hanya dilakukan di folder **services/**, tidak langsung di komponen.  
- Setiap fitur domain (equipment, maintenance, dll.) ditempatkan di `src/features/<nama-fitur>`.  

---

## Best Practices
- Default gunakan **server components**, tambahkan `"use client"` hanya bila diperlukan.  
- Gunakan **next/image** untuk optimasi gambar.  
- SSR untuk halaman yang membutuhkan data real-time atau SEO.  
- SSG/ISR untuk halaman statis dengan data jarang berubah.  
- Selalu sertakan error handling dan loading state di setiap data fetch.  
- Gunakan **environment variables** (`process.env`) untuk konfigurasi sensitif.  
- Semua route API wajib menggunakan autentikasi (JWT/session).  

---

## Testing & QA
- Gunakan **Jest + React Testing Library** untuk unit testing.  
- **Playwright** dapat digunakan untuk e2e testing jika diperlukan.  
- Semua pull request harus lulus lint (`eslint`) dan format (`prettier`).  
- QA wajib memeriksa tampilan di **desktop, tablet, dan mobile**.  

---

## Domain Spesifik: Heavy Equipment Management
- **Equipment** → CRUD data alat berat beserta detail teknis.  
- **Maintenance** → Jadwal, histori, dan status perbaikan.  
- **Tracking** → Lokasi dan status operasional.  
- **Inventory** → Sparepart, bahan bakar, dan logistik terkait.  
- **Reporting** → Laporan operasional, biaya, dan downtime.  
- Semua modul wajib mendukung **role-based access control (RBAC)**.  

---

## Deployment & DevOps
- Memiliki environment terpisah untuk development dan production.  
- Deploy menggunakan **Vercel**, prioritaskan edge function bila sesuai.  
- Gunakan **CI/CD** untuk lint, testing, dan build otomatis sebelum merge.  

---

## Workflow Pengembangan
1. **Analisis Kebutuhan**  
   - System Analyst mengumpulkan kebutuhan bisnis & teknis dari stakeholder.  
   - Hasil analisis dituangkan dalam dokumentasi yang bisa diakses tim.  

2. **Perancangan UI/UX**  
   - UI/UX Designer membuat wireframe, mockup, dan prototipe interaktif.  
   - Desain diuji secara internal sebelum masuk tahap implementasi.  

3. **Implementasi Frontend**  
   - Developer membangun fitur sesuai desain dan spesifikasi, mengikuti konvensi kode.  
   - Setiap fitur dikembangkan di branch terpisah menggunakan Git Flow.  

4. **Code Review & Integrasi**  
   - Semua kode diperiksa oleh minimal satu anggota tim sebelum merge ke branch utama.  
   - Integrasi dilakukan bertahap untuk menghindari konflik besar.  

5. **Testing & QA**  
   - Unit test dijalankan di tahap awal, e2e test dilakukan sebelum staging.  
   - QA melakukan verifikasi di staging environment.  

6. **Deployment**  
   - Setelah QA approve, aplikasi dideploy ke production melalui CI/CD.  
   - Post-deployment monitoring dilakukan selama minimal 48 jam.  

---

## Aturan Branch & Commit
### Branch Naming Convention
```
<tipe>/<deskripsi-singkat>
```
Contoh:
```
feature/equipment-crud
bugfix/fix-maintenance-date
hotfix/login-token-expiry
chore/update-dependencies
```
Tipe branch:
- `feature` → penambahan fitur baru  
- `bugfix` → perbaikan bug di development  
- `hotfix` → perbaikan bug kritis di production  
- `chore` → perubahan kecil/non-fitur (update deps, config, dsb)  

---

### Commit Message Convention
```
<tipe>: <deskripsi singkat>
```
Contoh:
```
feat: add equipment CRUD API integration
fix: correct maintenance schedule calculation
chore: update eslint config and dependencies
```
Tipe commit:
- `feat` → penambahan fitur baru  
- `fix` → perbaikan bug  
- `chore` → tugas non-fitur  
- `refactor` → perbaikan struktur kode tanpa mengubah behavior  
- `docs` → perubahan dokumentasi  
- `test` → penambahan/perbaikan test  
- `style` → perubahan format/penulisan kode tanpa mengubah logika  

---

## Enforcing Commit Rules (Husky + Commitlint)
**Install dependencies:**
```bash
npm install --save-dev husky @commitlint/{config-conventional,cli}
```
**Init Husky:**
```bash
npx husky install
```
`package.json`:
```json
"scripts": {
  "prepare": "husky install"
}
```
**Setup Commitlint:**
`commitlint.config.js`:
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'chore',
        'refactor',
        'docs',
        'test',
        'style'
      ]
    ],
    'subject-case': [2, 'always', 'sentence-case']
  }
};
```
**Husky commit hook:**
```bash
npx husky add .husky/commit-msg "npx --no -- commitlint --edit $1"
```

---

## Branch Protection Rules (GitHub)
Diterapkan untuk `main` dan `develop`:
- Pull request wajib sebelum merge.  
- Minimal **1 approval** dari code reviewer.  
- Status check (lint, test, build) wajib lulus.  
- Branch harus up-to-date sebelum merge.  
- Commit message wajib sesuai aturan Conventional Commits.  
- Push langsung ke `main` & `develop` **dilarang**, hanya via PR.  

**Regex commit message untuk GitHub (opsional):**
```regex
^(feat|fix|chore|refactor|docs|test|style)(\([a-z0-9\-]+\))?: .{1,}$
```
