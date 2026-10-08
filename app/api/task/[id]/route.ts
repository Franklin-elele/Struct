import connectDB from "@/lib/db";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import authSchema from "@/lib/modals/auth.modal";
import taskSchema from "@/lib/modals/task.modal";
import { generateTasksForUser } from "@/lib/generateTasks";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");
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
    if (!dateParam) {
      return new Response(JSON.stringify({ message: "Date is required" }), {
        status: 400,
      });
    }
    const dayStart = new Date(dateParam);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dateParam);
    dayEnd.setHours(23, 59, 59, 999);

    const tasks = await taskSchema.find({
      userId: user._id,
      date: { $gte: dayStart, $lte: dayEnd },
    });

    return new Response(JSON.stringify({ tasks }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error fetching history" }), {
      status: 500,
    });
  }
}
