import connectDB from "@/lib/db";
import authSchema from "@/lib/modals/auth.modal";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    await connectDB();

    const { firstname, lastname, email, password } = await request.json();
    if (!firstname || !lastname || !email || !password) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        {
          status: 400,
        },
      );
    }
    const existingUser = await authSchema.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
      });
    }
    const newUser = new authSchema({
      firstname,
      lastname,
      email,
      password,
    });

    await newUser.save();

    const accessToken = await newUser.generateAccessToken();
    const refreshToken = await newUser.generateRefreshToken();

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
    });

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
    });

    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        user: {
          id: newUser._id,
          firstname: newUser.firstname,
          email: newUser.email,
        },
      }),
      { status: 201 },
    );
 } catch (error) {
  console.error("Signup error:", error);
  return new Response(
    JSON.stringify({ message: "Internal server error", error: String(error) }),
    { status: 500 }
  );
}
}
