import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import authSchema from "@/lib/modals/auth.modal";
import connectDB from "@/lib/db";

export async function GET(request: Request) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return new Response(
        JSON.stringify({ message: "No access token found" }),
        { status: 401 },
      );
    }

    const decoded = verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
    };
    const user = await authSchema.findById(decoded.id).select("-password");

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error verifying token" }), {
      status: 500,
    });
  }
}
