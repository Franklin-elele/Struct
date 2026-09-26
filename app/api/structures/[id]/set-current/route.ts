import structureSchema from "@/lib/modals/structure.modal";
import connectDB from "@/lib/db";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import authSchema from "@/lib/modals/auth.modal";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  try {
    await connectDB();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
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

    await structureSchema.updateMany(
      { userId: user._id },
      { isCurrent: false },
    );

    const setCurrentStructure = await structureSchema.findOneAndUpdate(
      { _id: id, userId: user._id },
      { isCurrent: true },
      { new: true },
    );

    if (!setCurrentStructure) {
      return new Response(JSON.stringify({ message: "Structure not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Structure set as current successfully",
        structure: setCurrentStructure,
      }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error setting current structure" }),
      { status: 500 },
    );
  }
}