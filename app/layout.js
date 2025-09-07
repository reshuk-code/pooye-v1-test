import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "pooye – Confessions & Anonymous Messages",
  description: "Browse, share, and message anonymously. Upload media. Securely store your profile.",
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