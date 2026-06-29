# Energize Vendor Registration Form

A complete vendor registration system for **Energize Pharmaceuticals (P) Limited**. Vendors fill out a multi-step online form, which saves data to MongoDB, generates a filled PDF matching the original Energize registration form template, and emails the PDF to the accounts team via Resend.

## Features

- Multi-step form with progress tracking and field validation
- PDF generation replicating the official Energize Vendor Registration Form layout
- Automated email with summary + PDF attachment via Resend
- MongoDB storage for all submissions
- Mobile-responsive design
- Production-ready for Render.com free tier

## Tech Stack

| Component      | Technology              |
|---------------|-------------------------|
| Runtime       | Node.js (≥ 18)          |
| Framework     | Express.js              |
| PDF           | Puppeteer               |
| Email         | Resend                  |
| Database      | MongoDB + Mongoose      |
| Frontend      | Vanilla HTML / CSS / JS |

## Project Structure

```
energize-vendor-form/
├── server.js          # Express server & /submit route
├── generatePDF.js     # Puppeteer PDF generator
├── emailSender.js     # Resend email sender
├── db.js              # MongoDB connection
├── Vendor.js          # Mongoose schema/model
├── public/
│   └── index.html     # Multi-step registration form
├── .env.example       # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

## Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-org/energize-vendor-form.git
cd energize-vendor-form

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env

# 4. Fill in environment variables (see below)

# 5. Start the server
node server.js
```

The form will be available at `http://localhost:3000`.

## Environment Variables

| Variable                     | Description                                              | Example                                       |
|-----------------------------|----------------------------------------------------------|-----------------------------------------------|
| `PORT`                      | Server port                                               | `3000`                                        |
| `MONGODB_URI`               | MongoDB Atlas connection string                           | `mongodb+srv://user:pass@cluster/energize`   |
| `RESEND_API_KEY`            | API key from resend.com dashboard                         | `re_xxxxxxxxxxxxxxxxxxxxxxxx`                |
| `HR_EMAIL`                  | Recipient email for vendor registrations                  | `accounts@energizepharma.com`                |
| `IS_PRODUCTION`             | Set to `true` on Render to use `puppeteer-core`           | `false` locally, `true` on Render            |
| `PUPPETEER_EXECUTABLE_PATH` | Chrome path on production server                          | `/usr/bin/google-chrome-stable`              |

## Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Go to **Dashboard → API Keys → Create API Key**
3. Copy the key and paste it in `.env` as `RESEND_API_KEY`

> **Free tier note:** On the free plan, you can only send emails to the email address registered with your Resend account. To send to any email (e.g. `accounts@energizepharma.com`), either:
> - Upgrade your Resend plan, **or**
> - Verify your own domain (see Custom Domain section below)

## MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and create a free cluster
2. Create a database user with a password
3. Whitelist your IP (or `0.0.0.0/0` for development)
4. Click **Connect → Connect your application** and copy the connection string
5. Paste it in `.env` as `MONGODB_URI` (replace `<password>` with your actual password)

## Render.com Deployment

1. Push your code to a GitHub repository
2. Go to [render.com](https://render.com) and create a new **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add all environment variables in the Render dashboard:
   - `PORT` → leave empty (Render sets this automatically)
   - `MONGODB_URI` → your Atlas connection string
   - `RESEND_API_KEY` → your Resend API key
   - `HR_EMAIL` → recipient email
   - `IS_PRODUCTION` → `true`
   - `PUPPETEER_EXECUTABLE_PATH` → `/usr/bin/google-chrome-stable`
6. Deploy

> **Note:** Render's free tier includes Chromium. If you encounter issues, add a `render.yaml` or Dockerfile that installs Google Chrome Stable.

## Changing the Recipient Email

Update the `HR_EMAIL` environment variable — in `.env` locally or in your Render dashboard for production.

## Custom Domain with Resend

To send emails from `@energizepharma.com` instead of `onboarding@resend.dev`:

1. Go to **Resend Dashboard → Domains → Add Domain**
2. Enter `energizepharma.com`
3. Add the DNS records (MX, TXT/SPF, DKIM) shown by Resend to your domain's DNS
4. Wait for verification (usually 5–30 minutes)
5. Update the `from` field in `emailSender.js`:
   ```js
   from: 'Energize Vendor Portal <vendors@energizepharma.com>'
   ```

## License

Private — Energize Pharmaceuticals (P) Limited
