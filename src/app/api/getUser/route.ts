import { currentUser } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    const userId = user?.id;
    if (!userId) {
      throw new Error("User ID is required");
    }

    return new Response(JSON.stringify({ currentUser: userId }), {
      status: 200,
    });
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
