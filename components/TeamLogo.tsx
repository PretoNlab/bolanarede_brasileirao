
import React, { useState } from 'react';
import { Team } from '../types';
import { clsx, type ClassValue } from 'clsx';

interface TeamLogoProps {
  team: Partial<Team> | { id: string; name: string; shortName: string; logoColor1?: string; logoColor2?: string; logoUrl?: string };
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Componente unificado para exibir o escudo de um time.
 * Possui fallback automático para um escudo estilizado caso a logoUrl falhe ou não exista.
 */
export const TeamLogo: React.FC<TeamLogoProps> = ({ team, className = "", size = "md" }) => {
  const [error, setError] = useState(false);

  const sizeClasses = {
    sm: "w-6 h-6 text-[8px]",
    md: "w-10 h-10 text-[10px]",
    lg: "w-16 h-16 text-[14px]",
    xl: "w-24 h-24 text-[20px]"
  };

  // Helper para detectar se a cor é uma classe Tailwind ou um Hex
  const getStyle = (color?: string, isBg = true) => {
    if (!color) return {};
    if (color.startsWith('#')) {
      return isBg ? { backgroundColor: color } : { color };
    }
    return {};
  };

  const getTailwindClass = (color?: string) => {
    if (!color || color.startsWith('#')) return "";
    return color;
  };

  // Se houver logoUrl e nenhum erro de carregamento, tenta renderizar a imagem
  if (team.logoUrl && !error) {
    return (
      <div className={clsx("relative flex-shrink-0 flex items-center justify-center overflow-hidden rounded-full bg-white/10", sizeClasses[size], className)}>
        <img 
          src={team.logoUrl} 
          alt={team.name} 
          className="w-full h-full object-contain p-1"
          onError={() => setError(true)}
        />
      </div>
    );
  }

  // Fallback: Escudo estilizado com cores e iniciais
  const color1 = team.logoColor1 || "#444";
  const color2 = team.logoColor2 || "#222";

  return (
    <div 
      className={clsx(
        "relative flex-shrink-0 flex items-center justify-center rounded-lg border-2 border-white/20 font-bold uppercase tracking-tighter shadow-lg overflow-hidden",
        sizeClasses[size],
        getTailwindClass(color1),
        className
      )}
      style={{
        ...getStyle(color1),
        background: !color1.startsWith('#') ? undefined : `linear-gradient(135deg, ${color1}, ${color2})`
      }}
    >
      {/* Se for classe Tailwind, tentamos aplicar um gradiente via classes se possível, senão fica sólido */}
      {!color1.startsWith('#') && (
        <div className={clsx("absolute inset-0 bg-gradient-to-br opacity-50", getTailwindClass(color1), team.logoColor2 ? getTailwindClass(team.logoColor2).replace('from-', 'to-') : "to-black/50")} />
      )}
      
      <span className="relative z-10 text-white drop-shadow-md">
        {team.shortName || team.name?.substring(0, 3) || "???"}
      </span>
    </div>
  );
};

export default TeamLogo;
