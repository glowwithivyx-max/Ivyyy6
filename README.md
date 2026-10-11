# Ivy6
Premium AI-powered job discovery and career assistance platform.

## Local development

1. Install dependencies:
   npm install
2. Create a .env file with the following keys if you want live email delivery:
   RESEND_API_KEY=your_key_here
3. Start the app:
   npm run dev
4. Open http://localhost:5173

## Live email delivery

The contact form is wired to a local Express API at http://localhost:3001/api/contact. When `RESEND_API_KEY` is configured, the form will send a real email to `Glowwithivyx@gmail.com`.

If the key is not configured, the form accepts the request in demo mode and explains the required setup.

## Notes

This repository includes a premium front-end prototype with working routes, authentication flows, saved jobs, AI assistant interactions, job filtering, and admin gating in browser storage. For live production services, configure Supabase, AI provider credentials, and email delivery credentials.
