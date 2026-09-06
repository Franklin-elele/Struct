import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import connectDB from "@/lib/db";
import authSchema from "@/lib/modals/auth.modal";

export async function POST(request: Request) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return new Response(
        JSON.stringify({ message: "No refresh token found" }),
        { status: 401 },
      );
    }

    const decoded = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { id: string };
const user = await authSchema.findById(decoded.id);

if (!user || user.refreshToken !== refreshToken) {
  return new Response(
    JSON.stringify({ message: "Invalid refresh token" }),
    { status: 401 },
  );
}

const newAccessToken = await user.generateAccessToken();

cookieStore.set("accessToken", newAccessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60,
});

return new Response(JSON.stringify({ message: "Token refreshed" }), {
  status: 200,
});

    
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
