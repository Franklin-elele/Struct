import connectDB from "@/lib/db";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import authSchema from "@/lib/modals/auth.modal";
import taskSchema from "@/lib/modals/task.modal";
import { generateTasksForUser } from "@/lib/generateTasks";
import { getToday } from "@/lib/timezone";

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
    await generateTasksForUser(user._id.toString(), user.timezone);

    const { start, end } = getToday(user.timezone);

    const tasks = await taskSchema.find({
      userId: user._id,
      date: { $gte: start, $lt: end }, // $lt, because end is tomorrow's first moment
    });

    return new Response(JSON.stringify({ tasks }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error fetching today's tasks" }),
      { status: 500 },
    );
  }
}
