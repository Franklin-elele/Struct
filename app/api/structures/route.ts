import connectDB from "@/lib/db";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import authSchema from "@/lib/modals/auth.modal";
import structureSchema from "@/lib/modals/structure.modal";

// ------------------------------ Create a Structure for an authenticated user ------------------------------
export async function POST(request: Request) {
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

    const exisingActiveStructure = await structureSchema.findOne({
      userId: user._id,
      status: "active",
    });

    if (exisingActiveStructure) {
      return new Response(
        JSON.stringify({
          message: "An active structure already exists for this user",
        }),
        { status: 400 },
      );
    }

    const { title } = await request.json();

    const startDate = new Date();
    const endDate = new Date(startDate);

    endDate.setDate(endDate.getDate() + 90);

    const newStructure = new structureSchema({
      userId: user._id,
      title,
      startDate,
      endDate,
      status: "active",
      isCurrent: true,
    });

    await newStructure.save();

    return new Response(
      JSON.stringify({
        message: "Structure created successfully",
        structure: newStructure,
      }),
      {
        status: 201,
      },
    );
  }  catch (error: unknown) {
    
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ message: "Error creating structure", error: errorMessage }),
      {
        status: 500,
      },
    );
  }
}

// ------------------------------ Get all Structures for the authenticated user ------------------------------
export async function GET(request: Request) {
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

    const structures = await structureSchema.find({ userId: user._id });

        if (!structures) {
      return new Response(JSON.stringify({ message: "Structure not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Structures fetched successfully",
        structures,
      }),
      {
        status: 200,
      },
    );
  } catch (error: unknown) {
    
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ message: "Error fetching structure", error: errorMessage }),
      {
        status: 500,
      },
    );
  }
}