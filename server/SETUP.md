# Getting form submissions to the office

`CONFIG.formEndpoint` is currently empty, which means an online admission
application only reaches the office through the **printed slip** and
**WhatsApp** — nothing is recorded on the office's side. This ten-minute
setup fixes that.

Afterwards every submission arrives in two places: a row in a **Google
Sheet**, and an **email** in the office inbox.

---

## 1. Create the Google Sheet

1. Open [sheets.new](https://sheets.new).
2. Name it `Sudhum — website submissions`.

## 2. Paste in the script

1. In that sheet: **Extensions → Apps Script**.
2. Delete whatever code is already there.
3. Paste the entire contents of `server/apps-script.gs`.
4. At the top, set `NOTIFY_EMAIL` to the address that should receive the
   notifications.
5. **Save** (💾).

## 3. Deploy it

1. **Deploy → New deployment**.
2. Click the ⚙️ (gear) → **Web app**.
3. Settings:
   - **Execute as:** `Me`
   - **Who has access:** `Anyone` ← this is essential, otherwise the website
     cannot post to it
4. **Deploy**. Google will ask for permission → **Authorize access** → pick
   your account → at "Google hasn't verified this app" choose **Advanced →
   Go to … (unsafe)** → **Allow**. (It is your own script, so this is safe.)
5. Copy the **Web app URL** you are given. It looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

## 4. Put it in the website

Open `index.html` and, in the `CONFIG` block:

```js
formEndpoint : "https://script.google.com/macros/s/AKfycb.../exec",
```

Save, upload. That is all.

## 5. Test it

1. Go to the website → **Apply online** → submit a dummy application.
2. Check the `Admissions` tab in the Google Sheet — there should be a new row.
3. Check the email inbox.

---

## How it works

- Each submission type gets its own tab: `Admissions`, `Entry test`,
  `Enquiries`.
- Add a new field to a form and a new column appears in the sheet by itself —
  the script does not need changing.
- **If the connection drops or the request fails**, the submission is kept in
  the browser's `localStorage` queue and sent automatically the next time the
  page is opened (`flushQueue()` in `index.html`).
- The printed slip is still the record of truth — it is simply no longer the
  only record.

## Updating the script later

After changing the code: **Deploy → Manage deployments → ✏️ edit → Version:
New version → Deploy**. The URL stays the same, so `index.html` does not need
touching.

---

## The Formspree shortcut

If you would rather not use a Google Sheet, create a free form at
[formspree.io](https://formspree.io) and put its endpoint in `formEndpoint`.
Emails will arrive, but you lose the sheet, the separate tabs and the
automatic columns.
