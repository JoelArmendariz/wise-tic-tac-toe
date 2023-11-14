import { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

// interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function TextInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={twMerge("px-4 py-2 rounded-lg text-black", className)}
      {...props}
      type="text"
    />
  );
}
