# ACSR Website Update Guide (Beginner-Friendly)

This guide is for volunteers who are **not technical**.

It explains exactly how to update:
1. Events
2. Lessons / classes
3. Gallery images

You do **not** need to write code, but you do need access to:
1. The Google Sheet used by the website
2. This GitHub repository

---

## How The Website Gets Its Data

The homepage pulls content from different places:

1. **Events** come from a Google Sheet tab (`gid=0`)
2. **Lessons** come from a Google Sheet tab (`gid=1314345131`)
3. **Gallery images** come from files in the `images` folder + `images/manifest.json`

Important:
1. Editing `index.html` will **not** update events or lessons.
2. Events and lessons update automatically after the Google Sheet changes.
3. Images require a GitHub commit.

---

## Before You Start (Checklist)

1. Sign in to the Google account that can edit the website data sheet.
2. Sign in to GitHub account with write access to this repository.
3. Keep this guide open in another browser tab.

---

## Part 1: Update Events (Google Sheet)

### Where to edit
Events are read from this published CSV endpoint:

`https://docs.google.com/spreadsheets/d/e/2PACX-1vQeLZjUqbn64AyDm_fqQvMM1Vio6NbXPERnL3xBci5pY3vgUV0uq8uOEb342lkBLeOKVQDJIADWqCXA/pub?gid=0&single=true&output=csv`

You need the **editable** source Google Sheet (ask an admin/board member if needed).

### Required event columns (must match exactly)
1. `Date`
2. `Title`
3. `Description`
4. `Start Time`
5. `End Time`
6. `Venue`

Do not rename these headers.

### Step-by-step
1. Open the editable Google Sheet.
2. Open the tab that has the event columns:
   - `Date`, `Title`, `Description`, `Start Time`, `End Time`, `Venue`
3. Add a new row under the header row.
4. Fill in every column:
   - `Date`: use `MM/DD/YYYY` (example: `04/20/2026`)
   - `Title`: short event name
   - `Description`: one sentence
   - `Start Time`: example `6:00 PM`
   - `End Time`: example `9:00 PM`
   - `Venue`: location name
5. Double-check spelling and date.
6. Wait 1-5 minutes, then refresh the website.

### Important event rules
1. If `Date` or `Title` is blank, that event will not show.
2. Past dates are automatically hidden by the website.
3. Avoid commas in event text fields (`Title`, `Description`, `Venue`) because CSV parsing is simple and commas can break layout.
   - Use a dash instead of a comma when possible.

---

## Part 2: Update Lessons / Classes (Google Sheet)

### Where to edit
Lessons are read from this published CSV endpoint:

`https://docs.google.com/spreadsheets/d/e/2PACX-1vQeLZjUqbn64AyDm_fqQvMM1Vio6NbXPERnL3xBci5pY3vgUV0uq8uOEb342lkBLeOKVQDJIADWqCXA/pub?gid=1314345131&single=true&output=csv`

You need the **editable** source Google Sheet (same file as events, different tab).

### Required lesson columns (must match exactly)
1. `Title`
2. `Description`
3. `Day`
4. `Time`
5. `Instructor`
6. `Level`

Do not rename these headers.

### Step-by-step
1. Open the editable Google Sheet.
2. Open the tab that has lesson columns:
   - `Title`, `Description`, `Day`, `Time`, `Instructor`, `Level`
3. Add or update rows.
4. Fill in each column clearly.
5. Wait 1-5 minutes, then refresh the website.

### Important lesson rules
1. If `Title` is blank, that row will not show.
2. Avoid commas in fields when possible (especially `Description`), for the same CSV reason as events.

---

## Part 3: Update Gallery Images (GitHub)

You have two safe options.

### Option A (Easiest for non-technical users): Replace an existing image
Use this when you want to swap a photo without changing the number of photos.

1. In GitHub, open this repository.
2. Open the `images` folder.
3. Click an existing file (example: `7.jpg`).
4. Click the 3-dot menu, then choose **Delete file**.
5. Commit the delete.
6. Click **Add file** -> **Upload files**.
7. Upload the new image using the **exact same filename** (`7.jpg`).
8. Commit the upload.
9. Wait for GitHub Pages to deploy (usually 1-5 minutes), then refresh the site.

Why this is easiest:
1. You do not need to edit `images/manifest.json` if filename stays the same.

### Option B: Add brand-new images
Use this when adding more photos than currently listed.

1. In GitHub, open the `images` folder.
2. Click **Add file** -> **Upload files**.
3. Upload the new photo(s).
4. Use simple filenames like:
   - `11.jpg`
   - `12.jpg`
   - No spaces, no special characters
   - Use `.jpg`, `.jpeg`, `.png`, `.gif`, or `.webp`
5. Commit the upload.
6. Open `images/manifest.json`.
7. Click the pencil icon (**Edit this file**).
8. Add each new filename inside the list, in quotes, separated by commas.

Example:
```json
[
  "1.jpg",
  "2.jpg",
  "11.jpg"
]
```

9. Commit `manifest.json`.
10. Wait 1-5 minutes, then refresh the site.

Important:
1. If a file is not in `manifest.json`, it will not appear on the website.
2. If JSON formatting is broken (missing quote/comma), gallery may fail to load.

---

## Optional: Local Auto-Update For Gallery Manifest

If you are updating files on your own computer and have Python installed:

1. Put photos in the `images` folder.
2. Run:
   - Windows: `python update-gallery.py`
3. This script rebuilds `images/manifest.json` automatically.
4. Commit and push changed image files + manifest.

---

## How To Confirm Your Changes Are Live

1. Open the website in a browser.
2. Press:
   - Windows: `Ctrl + F5`
   - Mac: `Cmd + Shift + R`
3. Check Events, Classes, and Gallery sections.

If you still do not see updates after 5-10 minutes, check troubleshooting below.

---

## Troubleshooting (Most Common Problems)

1. **Event not showing**
   - Date is in the past
   - `Title` is blank
   - Header names were changed
   - Commas in text caused CSV parsing issues

2. **Lesson not showing**
   - `Title` is blank
   - Wrong tab edited
   - Header names were changed

3. **Image not showing**
   - Filename not added to `images/manifest.json`
   - Typo in filename (`11.JPG` vs `11.jpg`)
   - Commit was not completed

4. **Site still looks old**
   - Browser cache (hard refresh)
   - GitHub Pages deployment still in progress

---

## Safety Tips

1. Do not rename spreadsheet column headers.
2. Do not delete `images/manifest.json`.
3. Make one small change at a time and verify it.
4. If something breaks, revert the most recent GitHub commit.
