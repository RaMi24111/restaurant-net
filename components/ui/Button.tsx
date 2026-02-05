import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export function Button({ children, className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
    const baseStyles = "rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary text-secondary border border-accent/20 hover:bg-accent hover:text-primary shadow-[0_0_15px_rgba(244,196,48,0.3)]",
        secondary: "bg-secondary text-primary hover:bg-white border border-primary",
        outline: "bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-primary",
        ghost: "bg-transparent text-secondary hover:text-accent",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-6 py-3",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    );
}
