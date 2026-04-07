// hooks/useNavigate.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function useNavigate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const navigate = (path: string) => {
    setLoading(true);
    router.push(path);
  };

  return { navigate, loading };
}