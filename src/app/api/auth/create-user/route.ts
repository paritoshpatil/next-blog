import { createClient } from "@supabase/supabase-js";
import { hash } from "bcrypt";
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
  // generate password hash
  var password_hash = await hash(password, SALT_ROUNDS);

  // add user to db
  const { data, error } = await supabase
    .from("user")
    .insert([{ username: username, password_hash: password_hash }])
    .select();

  if (data) {
    return NextResponse.json(
      {
        success: true,
        message: "new user has been created",
        data,
      },
      {
        status: 200,
      }
    );
  }

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: "error creating new user",
        error,
      },
      {
        status: 500,
      }
    );
  }
};
