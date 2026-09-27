# Email Manager (MERN stack)

A management system for maintaining an email address list and sending bulk emails.

## Features
1. Sign up requires an "ensure code" (default: `goldluck`, set via `SIGNUP_CODE` env var).
2. Add/remove email addresses individually or in bulk via CSV upload.
3. Duplicate addresses are rejected on add and skipped on CSV import (unique index + explicit check).
4. Send emails automatically to a selectable range of addresses (e.g. address #1 to #50), via Gmail SMTP (Nodemailer).
5. Daily statistics: number of emails successfully sent per day.
6. Editable email content (subject/body) and "from" display name via the Settings page.

## Setup

### 1. MongoDB
Have a MongoDB instance running locally or use MongoDB Atlas. Put its connection string in `backend/.env`.

### 2. Gmail App Password
Because sending uses Gmail SMTP, you need a Google Account **App Password** (regular passwords won't work with SMTP):
1. Enable 2-Step Verification on the Gmail account: https://myaccount.google.com/security
2. Create an App Password: https://myaccount.google.com/apppasswords
3. Put the Gmail address and the 16-character app password into `backend/.env`.

> Note: Gmail SMTP sends **as the authenticated account**. The "From name" you set in the app changes the display name recipients see, but a fully different "from" email address only works if it's configured as a verified "Send As" alias in Gmail settings.

### 3. Backend
```bash
cd backend
cp .env.example .env   # then edit .env with your real values
npm install
npm run dev             # or: npm start
```
Runs on http://localhost:5000

### 4. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm start
```
Runs on http://localhost:3000

## Deploying on Render

The root `render.yaml` defines a Render web service for the API and a static site for the React app.

1. Create a MongoDB Atlas cluster and database user. Allow access from Render in Atlas Network Access, then copy the cluster connection string for the API's `MONGO_URI`.
2. Push this project to a Git repository and connect that repository to Render using **New +** > **Blueprint**.
3. During Blueprint setup, provide `MONGO_URI`, `GMAIL_USER`, and a newly created `GMAIL_APP_PASSWORD`. Render generates `JWT_SECRET` and `SIGNUP_CODE`.
4. Deploy both services. The frontend's API URL is wired to the backend service by the Blueprint.

Never commit `.env` files. If a credential has been exposed, revoke it and use a replacement in Render's environment settings.

## Using it
1. Go to `/signup`, create an account with the ensure code (`goldluck` by default).
2. Go to **Addresses** — add addresses one by one, or upload a CSV (any CSV with email-looking values in any column works; a plain one-column list is fine too).
3. Go to **Settings** to set a default from-name, subject and body.
4. Go to **Send** — pick a number range (based on each address's position/`#`, shown in the Addresses table) and send.
5. Go to **Stats** to see emails sent per day.

## CSV format
Any CSV works as long as email addresses appear somewhere in the file — with a header row, without one, or spread across columns. The importer scans every cell and picks out anything that looks like a valid email address, de-duplicating against what's already stored.

## Notes / things you may want to extend
- Sending is done synchronously in a loop; for large lists (thousands+) you'd want a queue (e.g. Bull/Redis) to avoid request timeouts and Gmail's sending rate limits (Gmail personal accounts cap around 500 emails/day).
- No password-reset flow yet.
- No rich text editor for the body (plain HTML textarea) — could add TinyMCE/Quill.
- Range selection is based on each address's sequential `#`, not a live-selection checklist across pages — easy to extend to "select all filtered" style if needed.
