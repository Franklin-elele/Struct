import habitSchema from "@/lib/modals/habit.modal";
import structureSchema from "@/lib/modals/structure.modal";
import connectDB from "@/lib/db";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import authSchema from "@/lib/modals/auth.modal";

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

    const habit = await habitSchema.findById(id);

    if (!habit) {
      return new Response(JSON.stringify({ message: "Habit not found" }), {
        status: 404,
      });
    }

    const structure = await structureSchema.findOne({
      _id: habit.structureId,
      userId: user._id,
    });

    if (!structure) {
      return new Response(JSON.stringify({ message: "Not authorized to edit this habit" }), {
        status: 403,
      });
    }

    const { title, frequency, customDays, duration } = await request.json();

    const updatedHabit = await habitSchema.findByIdAndUpdate(
      id,
      { title, frequency, customDays, duration },
      { new: true },
    );

    return new Response(
      JSON.stringify({
        message: "Habit updated successfully",
        habit: updatedHabit,
      }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error updating habit" }),
      { status: 500 },
    );
  }
}

export async function DELETE(
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

    const habit = await habitSchema.findById(id);

    if (!habit) {
      return new Response(JSON.stringify({ message: "Habit not found" }), {
        status: 404,
      });
    }

    const structure = await structureSchema.findOne({
      _id: habit.structureId,
      userId: user._id,
    });

    if (!structure) {
      return new Response(JSON.stringify({ message: "Not authorized to delete this habit" }), {
        status: 403,
      });
    }

    await habitSchema.findByIdAndDelete(id);

    return new Response(
      JSON.stringify({
        message: "Habit deleted successfully",
      }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error deleting habit" }),
      { status: 500 },
    );
  }
}
