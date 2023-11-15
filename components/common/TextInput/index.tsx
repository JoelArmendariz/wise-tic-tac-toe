import { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorText?: string;
}

export default function TextInput({
  className,
  errorText,
  ...props
}: TextInputProps) {
  return (
    <div className="flex flex-col">
      <input
        className={twMerge('px-4 py-2 rounded-lg text-black', className)}
        {...props}
        type="text"
      />
      {errorText ? <span className="text-error">{errorText}</span> : null}
    </div>
  );
}
