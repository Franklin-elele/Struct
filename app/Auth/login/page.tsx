"use client";

// app/login/page.tsx
// Assembles AuthContainer + LoginForm, owns the local form state

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthContainer from "@/app/components/Auth/AuthContainer";
import LoginForm, { LoginData } from "@/app/components/Auth/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  // local state — lifted here since LoginPage owns this flow
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const handleSubmit = () => {
    // TODO: wire to auth API — backend logic goes here
    console.log("Login submitted:", formData);
  };

  return (
    <AuthContainer>
      <LoginForm
        data={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onBack={() => router.push("/")}
      />
    </AuthContainer>
  );
}