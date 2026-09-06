"use client";

// app/login/page.tsx
// Assembles AuthContainer + LoginForm, owns the local form state

import { useState } from "react";
import type { ComponentType, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import AuthContainer from "@/app/components/Auth/AuthContainer";
import LoginForm, { LoginData } from "@/app/components/Auth/LoginForm";
import { login } from "@/lib/services/auth.service";
import toast from "react-hot-toast";
import loader from "@/app/components/Loader";


const LoginFormWithSubmit = LoginForm as unknown as ComponentType<{
  data: LoginData;
  onChange: Dispatch<SetStateAction<LoginData>>;
  onSubmit: () => Promise<void>;
  onBack: () => void;
}>;

export default function LoginPage() {
  const router = useRouter();

  // local state — lifted here since LoginPage owns this flow
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await toast.promise(
        login({ email: formData.email, password: formData.password }),
        {
          loading: "Logging in...",
          success: "Welcome back!",
          error: (err) => err?.response?.data?.message || "Invalid credentials",
        }
      );
      router.push("/dashboard/home");
    } catch (error) {
      console.error("Login error: ", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthContainer>
      <LoginFormWithSubmit
        data={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onBack={() => router.push("/")}
      />
    </AuthContainer>
  );
}