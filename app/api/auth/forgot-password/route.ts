import crypto from "crypto";
import connectDB from "@/lib/db";
import authSchema from "@/lib/modals/auth.modal";
import { sendEmail } from "@/lib/email";

export async function POST (request: Request) {
  try {
  // const cookieStore = await cookies();
  await connectDB();

  const { email } = await request.json();
  if (!email) {
    return new Response(
      JSON.stringify({ message: "Email is required" }),
      {
        status: 400,
      },
    );
  }

  const user = await authSchema.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }

  // Generate a reset password token
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordHash = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpires = new Date(Date.now() + 1800000);

  await user.save();

  // Send the reset password email
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
  const emailContent = {
    to: user.email,
    subject: "Password Reset Request",
    html: `<p>You requested a password reset. Click <a href="${resetUrl}">Here</a> to reset your password. This link will expire in 30 minutes.</p>`,
    text: `You requested a password reset. Visit the following link to reset your password: ${resetUrl}. This link will expire in 30 minutes.`,
  };

  await sendEmail(emailContent);

  const { token, Password } = await request.json();



  return new Response(
    JSON.stringify({ message: "Password reset email sent" }),
    {
      status: 200,
    },
  );

 } catch (error) {
  console.error("Forgot password error:", error);
  return new Response(
    JSON.stringify({ message: "Internal server error", error: String(error) }),
    { status: 500 }
  );
}
}