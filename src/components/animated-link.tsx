"use client";

import Link from "next/link";
import { useNavigation } from "@/hooks/use-navigation";
import { ReactNode } from "react";

interface AnimatedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
}

export default function AnimatedLink({
  href,
  children,
  className,
  onClick,
  delay = 600,
}: AnimatedLinkProps) {
  const { navigateWithLoading } = useNavigation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (onClick) {
      onClick();
    }
    
    navigateWithLoading(href, delay);
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
} 