import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

const ActionButtons = forwardRef(function ActionButtons(
  { className = "", children, type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export { ActionButtons };
