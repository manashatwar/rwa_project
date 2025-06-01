import React from "react";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "default" | "text" | "circular" | "rectangular";
  lines?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = "",
  variant = "default",
  lines = 1,
}) => {
  const baseClasses = "animate-pulse bg-gray-200 rounded";
  
  const variants = {
    default: "h-4 w-full",
    text: "h-4",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variants.text} ${
              index === lines - 1 ? "w-3/4" : "w-full"
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${className}`}
    />
  );
};

export default LoadingSkeleton; 