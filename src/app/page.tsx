"use client"
import { Button } from "@/components/ui/button";
import './globals.css'
import Link from "next/link";
import { userStore } from "./userStore";
import { ArrowDownRightSquare } from "lucide-react";

export default function Home() {
  const {isLoggedIn} = userStore()
  return (
    <main className="gradient-bg h-screen w-screen flex flex-row items-center justify-center px-48">
      <div className="flex flex-col items-end justify-center h-full w-2/5">
        <h1 className="text-7xl mb-4 text-right">
          markdown enabled notes right in your browser
        </h1>
        <p className="text-right mb-12">
          the simplest way to jot down your thoughts.
          <br/>
          write as little or as much as you want
        </p>
        <Link href={isLoggedIn ? "/new-blog" : "/login"}>
          <Button variant="default" className="p-4">
            <span className="text-lg">
              create your <strong>next blog</strong>
            </span>
            <ArrowDownRightSquare className="ml-2"></ArrowDownRightSquare>
          </Button>
        </Link>
      </div>
      <div className="h-4/5 w-3/5 spline-hero">
        <iframe src='https://my.spline.design/glasseffectcopy-295e04f650dd2cb252e35dcfa44c3fbf/' width='100%' height='100%'></iframe>
      </div>
    </main>
  );
}
