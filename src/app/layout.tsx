"use client";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { useTheme } from "next-themes";
import { Inter } from "next/font/google";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./modeToggle";
import { userStore } from "./userStore";
import Link from "next/link";
import useAuth from "./authGuard";

function ProtectedRoute({ children } : any) {
  useAuth();
  return children;
}


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
  const {isLoggedIn, setLoggedIn, setUser} = userStore()

  function logUser() {
    if(isLoggedIn) {
      setUser({username: "", id: ""})
      setLoggedIn(false)
    }
  
    router.push("/login")
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <header className="absolute w-screen h-8 flex flex-row justify-center items-center z-10 shadow-md px-10 py-8">
            <div>
              <Link href="/" className='no-underline	'>
                <p className="text-xl">next-<strong>blog</strong></p>
              </Link>
            </div>
            <div className="flex flex-row items-center justify-end ml-auto">
              <Button variant="outline" onClick={() => logUser()}>
                {isLoggedIn ? "logout" : "login"}
              </Button>
              <ModeToggle />
            </div>
          </header>
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        </ThemeProvider>
      </body>
    </html>
  );
}
