import connectDB from "@/lib/db";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import authSchema from "@/lib/modals/auth.modal";
import taskSchema from "@/lib/modals/task.modal";
import structureSchema from "@/lib/modals/structure.modal";
import { getToday, getDayStartDaysAgo, safeZone } from "@/lib/timezone";

// Tasks are stored at midnight of the server's clock, but MongoDB groups
// by UTC unless told otherwise. This keeps each task on the right day.

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

    // ?days=30 (default 30, minimum 1, maximum 90)
    const { searchParams } = new URL(request.url);
    const requested = parseInt(searchParams.get("days") ?? "30", 10);
    const days = Math.min(
      Math.max(Number.isNaN(requested) ? 30 : requested, 1),
      90,
    );

    // Past days only: from N days ago up to, but not including, today
    const zone = safeZone(user.timezone);
    const todayStart = getToday(zone).start;
    const since = getDayStartDaysAgo(zone, days);

    // Stage 1: keep this user's tasks in the range
    // Stage 2: one group per (day, structure), counting total and completed
    const rows = await taskSchema.aggregate([
      { $match: { userId: user._id, date: { $gte: since, $lt: todayStart } } },
      {
        $group: {
          _id: {
            day: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$date",
                timezone: zone,
              },
            },
            structureId: "$structureId",
          },
          completed: { $sum: { $cond: ["$completed", 1, 0] } },
          total: { $sum: 1 },
        },
      },
    ]);

    // Look up the structure titles in one query
    const structures = await structureSchema
      .find({ _id: { $in: rows.map((r) => r._id.structureId) } })
      .select("title")
      .lean();
    const titleById = new Map(
      structures.map((s) => [s._id.toString(), s.title]),
    );

    // Gather the rows into one record per day
    const byDay = new Map<
      string,
      { title: string; completed: number; total: number }[]
    >();
    let totalCompleted = 0;
    let totalTasks = 0;

    for (const r of rows) {
      const list = byDay.get(r._id.day) ?? [];
      list.push({
        title:
          titleById.get(r._id.structureId.toString()) ?? "Deleted structure",
        completed: r.completed,
        total: r.total,
      });
      byDay.set(r._id.day, list);
      totalCompleted += r.completed;
      totalTasks += r.total;
    }

    // Newest day first (YYYY-MM-DD strings sort correctly as text)
    const records = [...byDay.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, structures]) => ({ date, structures }));

    const summary = {
      bestStreak: 0, // stubbed until the Stats backend defines the streak rule
      totalCompleted,
      avgCompletion: totalTasks
        ? Math.round((totalCompleted / totalTasks) * 100)
        : 0,
    };

    return new Response(JSON.stringify({ records, summary }), { status: 200 });
  } catch (error) {
    console.error("Error fetching history: ", error);
    return new Response(JSON.stringify({ message: "Error fetching history" }), {
      status: 500,
    });
  }
}
