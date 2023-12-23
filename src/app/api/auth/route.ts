import { NextResponse } from "next/server";

export const GET = async (req: Request, res: Response) => {
  console.log("GET REQUEST CALLED");
  return NextResponse.json({
    message: "Hi Mom",
  });
};
