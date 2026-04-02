import { Navbar } from "@/components/layout/navbar";
import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "School Admission Portal",
  description: "Online school admission management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
