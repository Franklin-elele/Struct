import structureSchema from "@/lib/modals/structure.modal";
import connectDB from "@/lib/db";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import authSchema from "@/lib/modals/auth.modal";

export async function GET(
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

    const structure = await structureSchema.findOne({
      _id: id,
      userId: user._id,
    });

    if (!structure) {
      return new Response(JSON.stringify({ message: "Structure not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Structure fetched successfully",
        structure,
      }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error fetching structure" }),
      { status: 500 },
    );
  }
}

export async function PATCH(
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
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error updating structure" }),
      { status: 500 },
    );
  }
}
