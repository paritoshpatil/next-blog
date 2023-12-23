import { createClient } from "@supabase/supabase-js";
import { compare, hash } from "bcrypt";
import { NextResponse } from "next/server";

const SALT_ROUNDS: number = 5;
const SUPABASE_URL: string = process.env.SUPABASE_URL
  ? process.env.SUPABASE_URL
  : "https://afidlxjfjqerrfjfadwg.supabase.co";
const ANON_KEY: string = process.env.ANON_KEY
  ? process.env.ANON_KEY
  : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmaWRseGpmanFlcnJmamZhZHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMzMzIxNDYsImV4cCI6MjAxODkwODE0Nn0.zBRYE2WRUD5jpOWfIBTcTSIeZIF2RVSeScUSP78IgXw";

const supabase = createClient(SUPABASE_URL, ANON_KEY);

export const POST = async (req: Request, res: Response) => {
  const { username, password } = await req.json();
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("username", username);

  if (data) {
    // generate password hash
    var isAuthenticated = await compare(password, data[0].password_hash).catch(
      (err) => console.log(err.message)
    );
    if (isAuthenticated) {
      return NextResponse.json(
        { success: true, message: "logged in successfully", isAuthenticated },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "username or password is invalid" },
        { status: 500 }
      );
    }
  }

  if (error) {
    return NextResponse.json(
      { success: false, message: "error while loggin in", error },
      { status: 500 }
    );
  }
};
