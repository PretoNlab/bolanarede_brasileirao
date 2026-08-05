
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'cinematic';
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  onBack, 
  backIcon,
  rightAction, 
  className,
  variant = 'default' 
}) => {
  return (
    <header className={clsx(
      "px-4 sm:px-6 pt-safe pt-4 pb-4 z-20 transition-all duration-500",
      variant === 'cinematic' ? "bg-gradient-to-b from-black/80 to-transparent" : "bg-background/90 backdrop-blur-md sticky top-0 border-b border-white/5",
      className
    )}>
      <div className="flex items-center justify-between gap-3 max-w-4xl mx-auto w-full">
        {onBack ? (
          <button 
            onClick={onBack} 
            className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 text-white transition-all active:scale-95 border border-white/5 group shrink-0"
            aria-label="Voltar"
          >
            {backIcon || <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />}
          </button>
        ) : <div className="w-11 shrink-0" />}
        
        <div className="flex flex-col items-center min-w-0 flex-1 px-2 text-center">
           {subtitle && (
             <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase mb-1 truncate max-w-full">
               {subtitle}
             </span>
           )}
           <h1 className={clsx(
             "font-black leading-tight tracking-tight text-white truncate max-w-full",
             variant === 'cinematic' ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
           )}>
             {title}<span className="text-primary italic">.</span>
           </h1>
        </div>

        <div className="min-w-[44px] flex justify-end shrink-0">
          {rightAction || (
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 opacity-20">
              <div className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
