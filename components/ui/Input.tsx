import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    className?: string;
}

export function Input({ label, className, ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && <label className="text-accent text-sm font-medium tracking-wide">{label}</label>}
            <input
                className={twMerge(
                    "bg-white border border-gold-start/30 rounded-lg px-4 py-3 text-text-dark placeholder:text-text-muted/50 focus:outline-none focus:border-ruby-red focus:ring-1 focus:ring-ruby-red transition-all duration-300 shadow-sm",
                    className
                )}
                {...props}
            />
        </div>
    );
}
