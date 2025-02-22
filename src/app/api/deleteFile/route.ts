import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const { url }: { url: string } = await req.json();

    // Select id from file where url = url
    const fileFirst = await prisma.file.findFirst({
      where: {
        url: url,
      },
    });

    if (!fileFirst) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Delete the file information in Prisma
    const fileSecond = await prisma.file.delete({
      where: {
        id: fileFirst.id,
      },
    });

    return NextResponse.json(
      { message: "File deleted successfully", file: fileSecond },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting file information:", error);
    return NextResponse.json(
      { error: "Failed to delete file information" },
      { status: 500 }
    );
  }
}
