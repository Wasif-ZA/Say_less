"use client";

interface ScreenWrapperProps {
  children: React.ReactNode;
  className?: string;
  bgClassName?: string;
}

export function ScreenWrapper({ children, className = "", bgClassName = "bg-page-bg" }: ScreenWrapperProps) {
  return (
    <div className={`flex flex-col h-dvh w-full overflow-y-auto scrollbar-hide ${bgClassName} ${className}`}>
      <div className="flex flex-col flex-1 px-5 py-6 max-w-lg mx-auto w-full">
        {children}
      </div>
    </div>
  );
}
