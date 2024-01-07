"use client";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import type { Metadata } from "next";
import { useTheme } from "next-themes";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { isUserLoggedIn } from "./supabase-service";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./modeToggle";



const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: 'next-blog',
//   description: 'next-blog by pari',
// }



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  function ThemeProvider({
    children,
    ...props
  }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
  }

  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(isUserLoggedIn())
    setInterval(() => {
      setLoggedIn(isUserLoggedIn())
    }, 4000)
  }, [])

  function logUser() {
    if(isUserLoggedIn()) {
      sessionStorage.setItem("loggedInUser", "")
    }
  
    router.push("/login")
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <header className="absolute w-screen h-8 flex flex-row justify-center items-center z-10 shadow-md px-10 py-8">
            <div>
              <a href="/" className='no-underline	'>
                <p className="text-xl">next-<strong>blog</strong></p>
              </a>
            </div>
            <div className="flex flex-row items-center justify-end ml-auto">
              <Button variant="outline" onClick={() => logUser()}>
                {loggedIn ? "logout" : "login"}
              </Button>
              <ModeToggle />
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
