import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ children, className, variant = 'primary', ...props }) {
  const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-secondary border border-accent/20 hover:bg-accent hover:text-primary shadow-[0_0_15px_rgba(244,196,48,0.3)]",
    secondary: "bg-secondary text-primary hover:bg-white border border-primary",
    outline: "bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-primary",
    ghost: "bg-transparent text-secondary hover:text-accent",
  };

  return (
    <button 
      className={twMerge(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
