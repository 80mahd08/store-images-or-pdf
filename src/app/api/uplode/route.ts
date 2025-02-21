import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { url, size, userId, name } = await req.json();

    // Store the file information in Prisma
    const file = await prisma.file.create({
      data: {
        name,
        userId,
        url,
        size,
      },
    });

    return NextResponse.json(
      { message: "File information stored successfully", file },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error storing file information:", error);
    return NextResponse.json(
      { error: "Failed to store file information" },
      { status: 500 }
    );
  }
}
