import { Navbar } from "@/components/layout/navbar";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeProvider } from "@/components/themeprovider";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
