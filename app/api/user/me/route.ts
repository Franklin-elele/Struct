import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import authSchema from "@/lib/modals/auth.modal";
import connectDB from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";

export const runtime = "nodejs"; // the Cloudinary SDK needs Node, not Edge

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const reply = (body: object, status: number) =>
  new Response(JSON.stringify(body), { status });

// One fixed path per user, so a new photo replaces the old one
const uploadAvatar = (buffer: Buffer, userId: string) =>
  new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          public_id: `struct/avatars/${userId}`,
          overwrite: true,
          invalidate: true,
          resource_type: "image",
          // crop to a 256px square around the face before storing
          transformation: [{ width: 256, height: 256, crop: "fill", gravity: "face" }],
        },
        (error, result) => (error || !result ? reject(error) : resolve(result)),
      )
      .end(buffer);
  });

  export async function PATCH(request: Request) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) return reply({ message: "Unauthorized" }, 401);

    const decoded = verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as { id: string };
    const user = await authSchema.findById(decoded.id).select("-password");
    if (!user) return reply({ message: "User not found" }, 404);

    // Read the form data (this replaces Multer in Next.js)
    const form = await request.formData();
    const updates: { firstname?: string; lastname?: string; avatarUrl?: string } = {};

    // Names: only the fields that were sent, same 3-letter minimum as the schema
    for (const field of ["firstname", "lastname"] as const) {
      const value = form.get(field);
      if (typeof value === "string") {
        const clean = value.trim();
        if (clean.length < 3) {
          return reply({ message: `${field} must be at least 3 characters` }, 400);
        }
        updates[field] = clean;
      }
    }

    // Avatar: check everything BEFORE uploading
    const avatar = form.get("avatar");
    if (avatar instanceof File && avatar.size > 0) {
      if (!ALLOWED_TYPES.includes(avatar.type)) {
        return reply({ message: "Photo must be a JPEG, PNG or WebP image" }, 400);
      }
      if (avatar.size > MAX_BYTES) {
        return reply({ message: "Photo must be 2 MB or smaller" }, 400);
      }
      const buffer = Buffer.from(await avatar.arrayBuffer());
      const result = await uploadAvatar(buffer, user._id.toString());
      updates.avatarUrl = result.secure_url; // the URL includes a version, so the new image isn't cached
    }

    if (Object.keys(updates).length === 0) {
      return reply({ message: "Nothing to update" }, 400);
    }

    const updated = await authSchema
      .findByIdAndUpdate(user._id, updates, { new: true, runValidators: true })
      .select("-password -refreshToken");

    return reply({ message: "Profile updated", user: updated }, 200);
  } catch (error) {
    console.error("Error updating profile: ", error);
    return reply({ message: "Error updating profile" }, 500);
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return new Response(
        JSON.stringify({ message: "No access token found" }),
        { status: 401 },
      );
    }

    const decoded = verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
    };
    const user = await authSchema.findById(decoded.id).select("-password -refreshToken");

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error verifying token" }), {
      status: 500,
    });
  }
}
