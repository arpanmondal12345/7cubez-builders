# 7CUBEZ BUILDERS — Website (plain HTML)

A plain **HTML + CSS + JavaScript** website. There is no build step, nothing to install, and no
backend. Upload the files to GitHub Pages and the site works.

## Files

```
index.html          The whole page (all sections and text)
css/style.css       Design: colours, fonts, layout
js/config.js        ⭐ Business settings: WhatsApp, phone, Instagram, address
js/main.js          Menu, gallery filter, image viewer, enquiry form → WhatsApp
images/             Logo, favicon, share image
images/placeholders Temporary illustrations — replace with real photos
.nojekyll           Tells GitHub Pages to serve the files exactly as they are
```

## 1. Fill in your details (do this first)

Open **`js/config.js`** and fill in the values between the quotes:

```js
whatsappNumber: '919876543210',   // country code + number, digits only (this example is fake)
phone: '+919876543210',
email: '',
instagramUrl: 'https://www.instagram.com/your_handle/',
instagramHandle: '@your_handle',
officeAddress: '', serviceAreas: '', established: '', workingHours: '',
```

Anything you leave empty is hidden, or shown as "Details coming soon". Nothing is invented.

If the WhatsApp number is empty, WhatsApp still opens, but the visitor has to pick a contact.

## 2. Publish on GitHub Pages

1. Open your repository (e.g. `7cubez-builders`) on GitHub.
2. **Delete the old files** (the earlier React/Vite version). Delete `src`, `public`,
   `scripts`, `.github`, `package.json`, `package-lock.json`, `vite.config.ts`,
   `tsconfig*.json`, `.oxlintrc.json` and the old `index.html`.
3. Click **Add file → Upload files**. Drag in **everything inside this folder**:
   `index.html`, `css`, `js`, `images`, `README.md` and `.nojekyll`.
   `index.html` must be at the top level of the repository, not inside another folder.
4. Click **Commit changes**.
5. Go to **Settings → Pages → Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `main`, folder **/ (root)** → **Save**
6. Wait 1–2 minutes, then open `https://<your-username>.github.io/7cubez-builders/`.
   Press **Ctrl + Shift + R** to skip the browser cache.

All paths are relative, so the site works in a repository sub-folder, on `username.github.io`,
and on a custom domain without any changes.

## 3. Replace images

- **Logo:** replace `images/logo.png` and `images/logo.webp`, keeping the same file names.
  Also replace `images/favicon.png` (64×64), `images/apple-touch-icon.png` (180×180) and
  `images/og-image.jpg` (1200×630, used when the link is shared).
- **Photos:** put them in `images/`. Keep them about 1600 px wide, JPG or WebP, under about 300 KB.
  Then change the matching `src="images/…"` in `index.html`.
  - **Featured homes:** also update `data-img="…"` on the `<article class="home-card">`.
  - **Real 7CUBEZ photos:** delete the `<span class="badge …">Sample design</span>` or
    `Illustration` label, set `data-sample="false"`, and in the gallery remove
    `is-placeholder` from the button.
  - **Placeholder images:** only remove the label when the photo is a real 7CUBEZ project.

## 4. Edit homes, prices and offers

- **Add a house:** in `index.html`, copy a whole `<article class="home-card">…</article>`
  block and change the name, image, description and WhatsApp message.
- **Add a verified price:** replace `<span class="muted">Price on request</span>` with
  `<span class="price">₹ 45 Lakh onwards</span>`.
- **Gallery:** each `<li data-cat="…">` must use one of `modern`, `compact`, `premium`,
  `duplex` or `construction`. A filter button with no images hides itself automatically.
- **Offers:** an example is in a comment above the "PROMOTIONS" section. Only add real, currently active offers.

## 5. Colours and fonts

All colours are at the top of `css/style.css` (`--forest`, `--gold`, `--ivory` …).
Headings use **Manrope** and body text uses **Inter**, both from Google Fonts.

## What a static site cannot do

- **Save or email form submissions.** The form opens WhatsApp with the enquiry written out,
  and the visitor presses **Send**. Nothing is stored on the website.
- **Show live Instagram posts.** That needs Instagram API keys and a server, so the site links
  to the profile instead.
- **Logins, bookings, payments or an admin panel.** To change the content, edit the files and upload them again.
