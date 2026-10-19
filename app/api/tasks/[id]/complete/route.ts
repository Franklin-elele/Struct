import habitSchema from "@/lib/modals/habit.modal";
import connectDB from "@/lib/db";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import authSchema from "@/lib/modals/auth.modal";
import taskSchema from "@/lib/modals/task.modal";

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

        const task = await taskSchema.findById(id);

        if (!task) {
            return new Response(JSON.stringify({ message: "Task not found" }), {
                status: 404,
            });
        }

        if (task.userId.toString() !== user._id.toString()) {
            return new Response(JSON.stringify({ message: "Not authorized to complete this task" }), {
                status: 403,
            });
        }

        const taskUpdate = await taskSchema.findByIdAndUpdate(
            id,
            { completed: !task.completed },
            { new: true },
        );

        return new Response(JSON.stringify({ task: taskUpdate }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ message: "Error updating task" }), {
            status: 500,
        });
    }
}
