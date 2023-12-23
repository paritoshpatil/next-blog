"use client"
import { Button } from "@/components/ui/button";
import './globals.css'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { use } from "react";

export default function Home() {
  return (
    <main className="gradient-bg h-screen w-screen">
      <header>
        <Menubar className="w-screen flex flex-row items-center justify-center">
          <MenubarMenu>
            <MenubarTrigger><a href="/">home</a></MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>blogs</MenubarTrigger>
            <MenubarContent>
              <MenubarItem><a href="/new-blog">create new</a></MenubarItem>
              <MenubarItem><a href="/discover">discover</a></MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>about</MenubarTrigger>
            <MenubarContent>
              <MenubarItem><a href="/about-nextblog">nextblog</a></MenubarItem>
              <MenubarItem><a href="/about-developer">developer</a></MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </header>
      <div className="flex flex-col items-center justify-center my-96">
        <h1 className="text-8xl mb-4">
          next-<strong>blog</strong>
        </h1>
        <a href="/login">
          <Button variant="outline" className="p-4">
            <span className="text-lg">
              login to create your <strong>next blog</strong>
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 7 10 10" /><path d="M17 7v10H7" /></svg>
          </Button>
        </a>
      </div>
    </main>
  );
}
