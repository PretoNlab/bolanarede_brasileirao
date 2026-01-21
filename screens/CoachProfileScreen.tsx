
import React, { useState } from 'react';
import { Coach } from '../types';
import { ArrowLeft, User, DollarSign, ShoppingBag, Star, Car, Home, Watch, Plane } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface Props {
    coach: Coach;
    onBack: () => void;
    onUpdateCoach: (newCoach: Coach) => void;
}

const LUXURY_ITEMS = [
    { id: 'smartwatch', label: 'Smartwatch de Ouro', price: 15000, icon: <Watch size={24} className="text-amber-400" />, desc: 'Estilo no pulso.' },
    { id: 'curso_coach', label: 'Curso: Coach Quântico', price: 5000, icon: <Star size={24} className="text-purple-400" />, desc: 'Aprenda a gestão de crise com o universo.' },
    { id: 'churrasco', label: 'Churrasco p/ Organizada', price: 10000, icon: <User size={24} className="text-rose-400" />, desc: 'Apaziguar ânimos com picanha.' },
    { id: 'terno', label: 'Terno do Pofexô', price: 20000, icon: <ShoppingBag size={24} className="text-blue-400" />, desc: 'Risca de giz e elegância clássica.' },
    { id: 'implante', label: 'Implante Capilar', price: 45000, icon: <User size={24} className="text-yellow-400" />, desc: 'Estilo Conte. Rejuvenesça 10 anos.' },
    { id: 'sedan', label: 'Sedan de Luxo', price: 120000, icon: <Car size={24} className="text-blue-400" />, desc: 'Chegue com presença no CT.' },
    { id: 'apt_praia', label: 'Apartamento na Orla', price: 800000, icon: <Home size={24} className="text-emerald-400" />, desc: 'Vista para o mar.' },
    { id: 'jatinho', label: 'Jatinho Particular', price: 5000000, icon: <Plane size={24} className="text-rose-400" />, desc: 'O céu é o limite.' },
];

export default function CoachProfileScreen({ coach, onBack, onUpdateCoach }: Props) {
    const formatMoney = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
    };

    const handleBuy = (item: typeof LUXURY_ITEMS[0]) => {
        if (coach.items.includes(item.id)) return;
        if (coach.personalFunds < item.price) {
            toast.error("Saldo insuficiente na sua conta pessoal!");
            return;
        }

        const newCoach = {
            ...coach,
            personalFunds: coach.personalFunds - item.price,
            items: [...coach.items, item.id]
        };

        onUpdateCoach(newCoach);
        toast.success(`Parabéns! Você comprou: ${item.label}`, { icon: '🥂' });
    };

    return (
        <div className="flex flex-col h-screen bg-background text-white">
            <header className="p-4 flex items-center gap-4 border-b border-white/5 bg-surface/50 backdrop-blur-md sticky top-0 z-10">
                <button onClick={onBack} className="p-2 bg-white/5 rounded-full"><ArrowLeft size={20} /></button>
                <h1 className="font-bold text-lg">Meu Perfil</h1>
            </header>

            <main className="p-4 space-y-6 overflow-y-auto pb-safe">

                {/* Profile Card */}
                <div className="bg-gradient-to-br from-primary to-primary-hover p-6 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-white/20">
                            <User size={40} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase opacity-70 mb-1">Treinador</p>
                            <h2 className="text-2xl font-black">{coach.name}</h2>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="bg-black/20 px-3 py-1 rounded-lg text-xs font-bold uppercase">{coach.style}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/20">
                        <p className="text-xs font-black uppercase opacity-70 mb-1">Patrimônio Pessoal</p>
                        <div className="flex items-center gap-2">
                            <h3 className="text-3xl font-black tracking-tight">{formatMoney(coach.personalFunds)}</h3>
                        </div>
                        <p className="text-[10px] opacity-60 mt-2 italic">Recebe salário semanal do clube.</p>
                    </div>
                </div>

                {/* Lifestyle Shop */}
                <div>
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <ShoppingBag size={18} className="text-secondary" />
                        <h3 className="font-black uppercase tracking-widest text-secondary text-xs">Vida Pessoal & Luxo</h3>
                    </div>

                    <div className="space-y-3">
                        {LUXURY_ITEMS.map(item => {
                            const owned = coach.items.includes(item.id);
                            return (
                                <div key={item.id} className={clsx("bg-surface p-4 rounded-2xl border border-white/5 flex items-center justify-between", owned && "opacity-60")}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-black/20 rounded-xl flex items-center justify-center">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">{item.label}</h4>
                                            <p className="text-[10px] text-secondary">{item.desc}</p>
                                            {owned && <span className="text-[10px] font-bold text-emerald-400 uppercase mt-1 block">Adquirido</span>}
                                        </div>
                                    </div>
                                    {!owned ? (
                                        <button
                                            onClick={() => handleBuy(item)}
                                            disabled={coach.personalFunds < item.price}
                                            className="bg-white text-black px-4 py-2 rounded-xl text-xs font-black hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
                                        >
                                            {formatMoney(item.price)}
                                        </button>
                                    ) : (
                                        <div className="bg-emerald-500/20 p-2 rounded-full text-emerald-500">
                                            <Check size={16} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}

function Check({ size }: { size: number }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
}
