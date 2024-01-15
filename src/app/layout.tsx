"use client";
import { Inter } from "next/font/google";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { useRouter } from "next/navigation";
import { userStore } from "./userStore";
import useAuth from "./authGuard";
import { useEffect } from "react";
import { Navbar} from "./navbar";

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

  useEffect(() => {  
    return () => {
      var user = sessionStorage.getItem("loggedInUser")
      if(user) {
        setUser(JSON.parse(user))
        setLoggedIn(true)
      }
    }
  }, [])
  

  function ThemeProvider({
    children,
    ...props
  }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
  }

  const router = useRouter()
  const {isLoggedIn, setLoggedIn, setUser} = userStore()


  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar></Navbar>
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        </ThemeProvider>
      </body>
    </html>
  );
}
