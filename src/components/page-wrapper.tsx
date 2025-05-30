"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageLoading from "./page-loading";

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Listen for route changes
    const handleRouteChangeStart = () => {
      setIsLoading(true);
    };

    const handleRouteChangeComplete = () => {
      setIsLoading(false);
    };

    // Create a custom event system for route changes
    const originalPush = router.push;
    router.push = (...args) => {
      handleRouteChangeStart();
      const result = originalPush.apply(router, args);

      // Simulate loading time
      setTimeout(() => {
        handleRouteChangeComplete();
      }, 800);

      return result;
    };

    return () => {
      // Cleanup if needed
    };
  }, [router]);

  return (
    <>
      {children}
      <PageLoading isLoading={isLoading} />
    </>
  );
}
