"use client"
import { Button } from "@/components/ui/button";
import './globals.css'
import { isUserLoggedIn } from "./supabase-service";

export default function Home() {
  return (
    <main className="gradient-bg h-screen w-screen flex flex-row items-center justify-center px-60">
      <div className="flex flex-col items-end justify-center h-full">
        <h1 className="text-8xl mb-4">
          next-<strong>blog</strong>
        </h1>
        <p className="text-right mb-12">
          the simplest way to jot down your thoughts.
          <br/>
          write as little or as much as you want
        </p>
        <a href={isUserLoggedIn() ? "/new-blog" : "/login"}>
          <Button variant="default" className="p-4">
            <span className="text-lg">
              create your <strong>next blog</strong>
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 7 10 10" /><path d="M17 7v10H7" /></svg>
          </Button>
        </a>
      </div>
      <div className="h-4/5 w-3/5 spline-hero">
        <iframe src='https://my.spline.design/glasseffectcopy-295e04f650dd2cb252e35dcfa44c3fbf/' width='100%' height='100%'></iframe>
      </div>
    </main>
  );
}
