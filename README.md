This is a Next.js + MongoDB app for confessions and anonymous messaging.

## Getting Started

First, set environment variables by creating a `.env.local` file:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>
MONGODB_DB=pooye
JWT_SECRET=change_this_secret
ENCRYPTION_KEY=<32-byte base64 key>

# Cloudinary
CLOUDINARY_URL=cloudinary://927754439461881:g76kvbghcrz5Hyz4vyDuwoKP0Uw@dnqfntwus
CLOUDINARY_CLOUD_NAME=dnqfntwus
CLOUDINARY_API_KEY=927754439461881
CLOUDINARY_API_SECRET=g76kvbghcrz5Hyz4vyDuwoKP0Uw
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
