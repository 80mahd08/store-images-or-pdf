import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Fetch files associated with the userId
    const files = await prisma.file.findMany({
      select: {
        url: true,
        name: true,
        size: true,
      },
      where: {
        userId: userId,
      },
    });

    return new Response(JSON.stringify(files), { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
    return new Response(JSON.stringify({ error: "Error fetching images" }), {
      status: 500,
    });
  }
}
