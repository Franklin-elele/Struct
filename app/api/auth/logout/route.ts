import connectDB from "@/lib/db";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
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

    const decodeToken = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as { id: string };
    const user = await authSchema.findById(decodeToken.id);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    user.refreshToken = null;
    await user.save();

    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return new Response(JSON.stringify({ message: "Logout successful" }), {
      status: 200,
    });
  } catch (error) {
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });

  }
}
