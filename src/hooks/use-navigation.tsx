"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

export function useNavigation() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const navigateWithLoading = useCallback(
    (href: string, delay: number = 800) => {
      setIsLoading(true);

      // Show loading animation for specified delay
      setTimeout(() => {
        router.push(href);

        // Hide loading after navigation
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }, delay);
    },
    [router]
  );

  const quickNavigate = useCallback(
    (href: string) => {
      setIsLoading(true);
      router.push(href);
      setTimeout(() => setIsLoading(false), 200);
    },
    [router]
  );

  return {
    isLoading,
    navigateWithLoading,
    quickNavigate,
    setIsLoading,
  };
}
