# Photo Booth

A browser-based photo booth: pick a template, take or import 3 photos,
edit, and save a vertical 3-frame photo strip — **entirely on your
device**. No backend, no database, no analytics, no network calls. Your
photos never leave your phone or computer.

[ภาษาไทยอยู่ด้านล่าง ↓](#โฟโต้บูธ)

---

## Features

- **Capture** — live camera preview, front/back switch, mirror toggle, a
  3‑2‑1 countdown (3/5/10s, configurable) with a flash effect, and
  independent retake per photo (no need to redo all 3).
- **Import** — any of the 3 slots can instead be filled from your photo
  library, with EXIF-orientation correction and a crop dialog locked to
  the frame's aspect ratio. Camera and imported photos can be freely mixed.
- **8 templates** — classic white, black film strip with sprocket holes,
  pastel, vintage sepia, minimal border, playful dots, and two floral
  line-art presets — all drawn in code, no external image assets.
- **Filters** — none, B&W, sepia, vintage, high contrast, warm, cool —
  applied to all 3 photos together.
- **Caption** — optional text + an optional date stamp.
- **Output** — 600×1800px (2×6in @300dpi) by default, or 1200×3600px
  "High quality"; download as PNG or JPG, or use your device's native
  share sheet.
- **Installable** — works offline once loaded, as a PWA.
- **Bilingual** — English and Thai, with a language toggle.
- **Private by design** — every step (capture, crop, filter, compositing,
  export) happens in your browser with the Canvas API. Nothing is
  uploaded anywhere.

## Local development

Requires Node.js 20.19+ or 22.12+ (per Vite's engine requirement).

```bash
npm install
npm run dev
```

> **Camera access requires HTTPS or `localhost`.** This is a browser
> security requirement, not a limitation of this app — `npm run dev`
> serves over `localhost` so the camera works out of the box locally.
> If you test over your LAN IP (e.g. from a phone on the same Wi-Fi),
> the camera will be blocked unless that connection is also HTTPS.

Other scripts:

```bash
npm run build        # production build to dist/
npm run preview      # preview the production build
npm run lint         # ESLint
npm run typecheck    # TypeScript project check
npm run test         # Vitest
npm run format       # Prettier — write
```

## How to add a template

Templates are plain data objects — no new UI code required. Each one
lives in `src/templates/` and is registered in `src/templates/index.ts`.

1. Create `src/templates/yourTemplate.ts` exporting a `Template` object
   (see `src/types.ts` for the full shape):

   ```ts
   import type { Template } from '../types';
   import { defaultSlotLayout } from '../lib/layout';

   const { slots, caption } = defaultSlotLayout(); // standard 4:3 slot geometry

   export const yourTemplate: Template = {
     id: 'your-template',
     name: { en: 'Your Template', th: 'เทมเพลตของคุณ' },
     background: { kind: 'solid', color: '#FAF6EF' },
     slots,
     overlayDraw: (ctx, w, h) => {
       // optional: frame lines, decorations — drawn after photos, before caption
     },
     caption,
     font: { family: "'Cormorant Garamond', serif", size: 30, color: '#3B3631' },
   };
   ```

   - Reuse `defaultSlotLayout()` from `src/lib/layout.ts` for the standard
     528×396 4:3 slots, or author custom `slots`/`caption` rects (see
     `src/templates/filmStrip.ts` for an example with narrower slots to
     leave room for sprocket holes).
   - `background` can be `'solid'`, `'gradient'`, or `'pattern'` (an
     arbitrary canvas draw callback — see `vintageSepia.ts`).
   - All coordinates are authored at the base 600×1800 canvas; the
     compositor scales everything automatically for the "High quality"
     1200×3600 output and for thumbnails.

2. Add one line to `src/templates/index.ts`:

   ```ts
   import { yourTemplate } from './yourTemplate';
   export const templates: Template[] = [
     // ...existing templates,
     yourTemplate,
   ];
   ```

That's it — the template picker, live thumbnails, editor preview, and
final export all read from this list automatically.

## Deploying

### Vercel (via GitHub)

1. Push this repository to GitHub.
2. In Vercel, **Add New → Project**, import the repository.
3. Vercel auto-detects Vite; defaults are already correct
   (`npm run build`, output directory `dist`) via `vercel.json`.
4. Deploy. Every push to `main` redeploys automatically.

### Netlify Drop

1. Run `npm run build` locally.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag the generated `dist/` folder onto the page.
4. Your site is live instantly at a Netlify URL.

   For continuous deployment instead, connect the GitHub repo in Netlify
   — it will pick up `netlify.toml` (`npm run build`, publish `dist`)
   automatically.

Both platforms serve over HTTPS by default, so the camera works
immediately once deployed — no extra configuration needed.

## Tech stack

Vite + React + TypeScript (strict), Tailwind CSS v4, the Canvas API for
compositing, react-easy-crop, exifr for EXIF orientation, vite-plugin-pwa,
Vitest, ESLint + Prettier.

---

# โฟโต้บูธ

แอปโฟโต้บูธที่ทำงานบนเบราว์เซอร์: เลือกเทมเพลต ถ่ายหรือนำเข้ารูป 3 ใบ
แก้ไข แล้วบันทึกเป็นแถบรูปภาพแนวตั้ง 3 ช่อง — **ทำงานบนอุปกรณ์ของคุณทั้งหมด**
ไม่มีเซิร์ฟเวอร์ ไม่มีฐานข้อมูล ไม่มีการเก็บสถิติ ไม่มีการเชื่อมต่อเครือข่ายใดๆ
รูปภาพของคุณจะไม่ถูกส่งออกจากอุปกรณ์เลย

## ฟีเจอร์

- **ถ่ายภาพ** — พรีวิวกล้องสด สลับกล้องหน้า/หลัง สลับภาพสะท้อน
  นับถอยหลัง 3-2-1 (ปรับได้ 3/5/10 วินาที) พร้อมเอฟเฟกต์แฟลช
  และถ่ายใหม่ได้ทีละภาพโดยไม่ต้องถ่ายใหม่ทั้ง 3 ภาพ
- **นำเข้ารูป** — แต่ละช่องสามารถนำเข้ารูปจากคลังภาพแทนการถ่ายได้
  พร้อมแก้ไขทิศทางภาพตามข้อมูล EXIF และหน้าต่างครอปที่ล็อกสัดส่วนตามกรอบ
  สามารถผสมรูปจากกล้องและรูปนำเข้าในชุดเดียวกันได้
- **เทมเพลต 8 แบบ** — คลาสสิกสีขาว ฟิล์มภาพยนตร์พร้อมรูฟิล์ม พาสเทล
  วินเทจเซเปีย กรอบมินิมัล จุดสีสันสดใส และลายเส้นดอกไม้อีก 2 แบบ
  — วาดด้วยโค้ดทั้งหมด ไม่ใช้ภาพจากภายนอก
- **ฟิลเตอร์** — ไม่มี, ขาวดำ, เซปีย, วินเทจ, คอนทราสต์สูง, อุ่น, เย็น
  — ใช้กับทั้ง 3 ภาพพร้อมกัน
- **คำบรรยาย** — ข้อความไม่บังคับ พร้อมตัวเลือกแสดงวันที่
- **บันทึกผลลัพธ์** — ขนาด 600×1800 พิกเซล (2×6 นิ้ว @300dpi) ตามค่าเริ่มต้น
  หรือ 1200×3600 พิกเซลสำหรับ "คุณภาพสูง" ดาวน์โหลดเป็น PNG หรือ JPG
  หรือแชร์ผ่านระบบแชร์ของอุปกรณ์
- **ติดตั้งได้** — ใช้งานออฟไลน์ได้หลังโหลดครั้งแรก ในรูปแบบ PWA
- **สองภาษา** — ไทยและอังกฤษ สลับได้ตลอดเวลา
- **เป็นส่วนตัวโดยการออกแบบ** — ทุกขั้นตอน (ถ่ายภาพ ครอป ฟิลเตอร์
  ประกอบภาพ ส่งออก) ทำงานในเบราว์เซอร์ของคุณด้วย Canvas API เท่านั้น
  ไม่มีการอัปโหลดใดๆ ทั้งสิ้น

## การพัฒนาในเครื่อง

ต้องใช้ Node.js 20.19 ขึ้นไป หรือ 22.12 ขึ้นไป (ตามข้อกำหนดของ Vite)

```bash
npm install
npm run dev
```

> **กล้องจะทำงานได้เฉพาะบน HTTPS หรือ localhost เท่านั้น**
> นี่เป็นข้อกำหนดด้านความปลอดภัยของเบราว์เซอร์ ไม่ใช่ข้อจำกัดของแอปนี้
> คำสั่ง `npm run dev` จะรันผ่าน `localhost` ทำให้กล้องใช้งานได้ทันที
> แต่หากทดสอบผ่าน IP ในเครือข่ายท้องถิ่น (เช่น จากมือถือในวงแลนเดียวกัน)
> กล้องจะถูกบล็อกเว้นแต่การเชื่อมต่อนั้นเป็น HTTPS ด้วย

คำสั่งอื่นๆ:

```bash
npm run build        # บิลด์สำหรับใช้งานจริงไปที่ dist/
npm run preview      # พรีวิวผลลัพธ์จากการบิลด์
npm run lint         # ตรวจสอบโค้ดด้วย ESLint
npm run typecheck    # ตรวจสอบชนิดข้อมูลด้วย TypeScript
npm run test         # รันเทสต์ด้วย Vitest
npm run format       # จัดรูปแบบโค้ดด้วย Prettier
```

## วิธีเพิ่มเทมเพลตใหม่

เทมเพลตเป็นเพียงอ็อบเจกต์ข้อมูลธรรมดา — ไม่ต้องเขียนโค้ด UI เพิ่ม
แต่ละเทมเพลตอยู่ใน `src/templates/` และลงทะเบียนไว้ที่
`src/templates/index.ts`

1. สร้างไฟล์ `src/templates/yourTemplate.ts` และ export อ็อบเจกต์ชนิด
   `Template` (ดูโครงสร้างเต็มได้ใน `src/types.ts`) — ดูตัวอย่างโค้ดได้ใน
   ส่วนภาษาอังกฤษด้านบน
   - ใช้ `defaultSlotLayout()` จาก `src/lib/layout.ts` สำหรับขนาดช่อง
     มาตรฐาน 528×396 (สัดส่วน 4:3) หรือกำหนด `slots`/`caption`
     เองก็ได้ (ดูตัวอย่างที่ `src/templates/filmStrip.ts`)
   - `background` เลือกได้ระหว่าง `'solid'`, `'gradient'` หรือ
     `'pattern'` (ฟังก์ชันวาดเองบน canvas — ดูตัวอย่างที่ `vintageSepia.ts`)
   - พิกัดทั้งหมดอ้างอิงบน canvas ขนาดฐาน 600×1800 เสมอ
     ระบบจะปรับสเกลให้อัตโนมัติสำหรับโหมด "คุณภาพสูง" (1200×3600)
     และสำหรับรูปตัวอย่างขนาดเล็ก

2. เพิ่มหนึ่งบรรทัดใน `src/templates/index.ts`:

   ```ts
   import { yourTemplate } from './yourTemplate';
   export const templates: Template[] = [
     // ...เทมเพลตเดิม
     yourTemplate,
   ];
   ```

เท่านี้ก็เสร็จ — ตัวเลือกเทมเพลต รูปตัวอย่างแบบสด หน้าแก้ไข
และการส่งออกไฟล์สุดท้าย จะอ่านจากรายการนี้โดยอัตโนมัติ

## การดีพลอย

### Vercel (ผ่าน GitHub)

1. พุชโค้ดโปรเจกต์นี้ขึ้น GitHub
2. ใน Vercel เลือก **Add New → Project** แล้วนำเข้า repository
3. Vercel จะตรวจจับ Vite ให้อัตโนมัติ ค่าเริ่มต้นถูกต้องอยู่แล้ว
   (`npm run build`, output directory `dist`) ผ่านไฟล์ `vercel.json`
4. กด Deploy — ทุกครั้งที่พุชขึ้น `main` จะดีพลอยใหม่อัตโนมัติ

### Netlify Drop

1. รัน `npm run build` ในเครื่อง
2. ไปที่ [app.netlify.com/drop](https://app.netlify.com/drop)
3. ลากโฟลเดอร์ `dist/` ที่สร้างขึ้นไปวางบนหน้าเว็บ
4. เว็บไซต์จะออนไลน์ทันทีที่ URL ของ Netlify

   หากต้องการดีพลอยอัตโนมัติต่อเนื่อง ให้เชื่อมต่อ repository จาก GitHub
   ใน Netlify แทน ระบบจะใช้ค่าจาก `netlify.toml`
   (`npm run build`, publish `dist`) โดยอัตโนมัติ

ทั้งสองแพลตฟอร์มให้บริการผ่าน HTTPS เป็นค่าเริ่มต้นอยู่แล้ว
ดังนั้นกล้องจะใช้งานได้ทันทีหลังดีพลอย โดยไม่ต้องตั้งค่าเพิ่มเติม

## เทคโนโลยีที่ใช้

Vite + React + TypeScript (strict mode), Tailwind CSS v4, Canvas API
สำหรับการประกอบภาพ, react-easy-crop, exifr สำหรับข้อมูล EXIF,
vite-plugin-pwa, Vitest, ESLint + Prettier
