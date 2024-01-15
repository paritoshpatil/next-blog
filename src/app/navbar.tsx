"use client"

import { Button } from "@/components/ui/button"
import { ArrowDownRightSquare, User2, LogIn } from "lucide-react"
import { ModeToggle } from "./modeToggle"
import { userStore } from "./userStore"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import './globals.css'




export function Navbar() {
    const links = {
        userLinks: [
            {
                title: "home",
                description: "back to landing",
                href: "/"
            },
            {
                title: "profile",
                description: "your user profile",
                href: "/profile"
            },
            {
                title: "new blog",
                description: "jump to a fresh new blog",
                href: "/new-blog"
            },
        ],

        websiteLinks: [
            {
                title: "about next-blog",
                description: "read more about the creation of next-blog",
                href: "/"
            },
            {
                title: "about pari",
                description: "read more about the creator of next-blog",
                href: "/"
            },
        ]
    }
    const { isLoggedIn, setLoggedIn, setUser } = userStore()
    const router = useRouter()

    function logUser(clearCreds: boolean) {
        if (clearCreds) {
            setUser({ username: "", id: "" })
            setLoggedIn(false)
        }

        router.push("/login")
    }

    return (
        <header className="absolute w-screen h-8 flex flex-row items-center z-10 shadow-md px-10 py-8 place-content-between">
            <div>
                <span className='gradient-text no-underline flex flex-row justify-center items-center'>
                    <span className="text-xl">next-<strong>blog</strong></span>
                    <ArrowDownRightSquare></ArrowDownRightSquare>
                </span>
            </div>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>user</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] items-center navbar-ul">
                                {
                                    links.userLinks.map((link) => {
                                        return (
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href={link.href}>
                                                        <div className="text-sm font-medium leading-none">{link.title}</div>
                                                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                            {link.description}
                                                        </p>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        )
                                    })

                                }

                            </ul>

                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>website</NavigationMenuTrigger>
                        <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] items-center navbar-ul">
                                {
                                    links.websiteLinks.map((link) => {
                                        return (
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href={link.href}>
                                                        <div className="text-sm font-medium leading-none">{link.title}</div>
                                                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                            {link.description}
                                                        </p>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        )
                                    })

                                }

                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <div className="flex flex-row justify-center items-center">
                <Button variant="outline" onClick={() => logUser(isLoggedIn)}>
                    {isLoggedIn ? "logout" : "login"}
                    <LogIn className="ml-2 w-4"></LogIn>
                </Button>
                <ModeToggle />
            </div>
        </header>
    );
}