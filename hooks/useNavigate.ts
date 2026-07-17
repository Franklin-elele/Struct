// hooks/useNavigate.ts
"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";


export function useNavigate() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  // pathname changes when the new page has loaded — turn off loader then
  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  const navigate = (path: string) => {
    setLoading(true);
    router.push(path);
  };

  return { navigate, loading };
}