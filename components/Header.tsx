
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
      "px-6 pt-12 pb-6 z-20 transition-all duration-500",
      variant === 'cinematic' ? "bg-gradient-to-b from-black/80 to-transparent" : "bg-background/80 backdrop-blur-md sticky top-0",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        {onBack ? (
          <button 
            onClick={onBack} 
            className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 text-white transition-all active:scale-95 border border-white/5 group"
            aria-label="Voltar"
          >
            {backIcon || <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />}
          </button>
        ) : <div className="w-11" />}
        
        <div className="flex flex-col items-center">
           {subtitle && (
             <span className="text-[10px] font-black tracking-[0.25em] text-primary uppercase mb-1">
               {subtitle}
             </span>
           )}
           <h1 className={clsx(
             "font-black leading-none tracking-tight text-white",
             variant === 'cinematic' ? "text-3xl" : "text-xl"
           )}>
             {title}<span className="text-primary italic">.</span>
           </h1>
        </div>

        <div className="min-w-[44px] flex justify-end">
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
