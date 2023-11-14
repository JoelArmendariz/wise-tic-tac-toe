import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export type Variant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-primary hover:scale-[103%] hover:bg-primary-hover active:bg-primary-active",
  secondary:
    "bg-secondary text-black hover:scale-[103%] hover:bg-secondary-hover active:bg-secondary-active",
};

export default function Button({
  variant = "primary",
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        "px-4 py-2 rounded-xl shadow transition-all",
        VARIANT_CLASSES[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
