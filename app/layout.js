import { Poppins } from "next/font/google";
import "./globals.css";
import { icons } from "lucide-react";
import favicon from './vercel.svg'
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "pooye – Confessions & Anonymous Messages",
  description: "Browse, share, and message anonymously. Upload media. Securely store your profile.",
  icons: {
    icon: [
      { url: "/vercel.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased bg-white  text-black `}>
        {children}
      </body>
    </html>
  );
}