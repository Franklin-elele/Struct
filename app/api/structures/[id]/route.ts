import structureSchema from "@/lib/modals/structure.modal";
import connectDB from "@/lib/db";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import authSchema from "@/lib/modals/auth.modal";
import habitSchema from "@/lib/modals/habit.modal";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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

    const structure = await structureSchema.findOne({
      _id: id,
      userId: user._id,
    });

    if (!structure) {
      return new Response(JSON.stringify({ message: "Structure not found" }), {
        status: 404,
      });
    }

    const habits = await habitSchema.find({ structureId: structure._id });

    return new Response(
      JSON.stringify({
        message: "Structure fetched successfully",
        structure,
        habits,
      }),
      { status: 200 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        message: "Error fetching structure",
        error: errorMessage,
      }),
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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

    const { title } = await request.json();

    const updateStructure = await structureSchema.findOneAndUpdate(
      { _id: id, userId: user._id, status: "active" },
      { title },
      { new: true },
    );

    if (!updateStructure) {
      return new Response(JSON.stringify({ message: "Structure not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Structure updated successfully",
        structure: updateStructure,
      }),
      { status: 200 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        message: "Error updating structure",
        error: errorMessage,
      }),
      { status: 500 },
    );
  }
}
