import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <input
        className={`rounded-md border px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
