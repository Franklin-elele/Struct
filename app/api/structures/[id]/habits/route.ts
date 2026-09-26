import structureSchema from "@/lib/modals/structure.modal";
import connectDB from "@/lib/db";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import authSchema from "@/lib/modals/auth.modal";
import habitSchema from "@/lib/modals/habit.modal";

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

    const structure = await structureSchema.findOne({ _id: id, userId: user._id });

    if (!structure) {
      return new Response(JSON.stringify({ message: "Structure not found" }), {
        status: 404,
      });
    }

    const { title, frequency, customDays, duration } = await request.json();

    const newHabit = new habitSchema({
      structureId: id,
      title,
      frequency,
      customDays,
      duration,
    });

    await newHabit.save();

    return new Response(
      JSON.stringify({
        message: "Habit created successfully",
        habit: newHabit,
      }),
      { status: 201 },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error creating habit" }),
      { status: 500 },
    );
  }
}