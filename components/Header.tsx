'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { LanguagePicker } from '@/components/LanguagePicker';

import { useTranslations } from 'next-intl';

export function Header() {
    const t = useTranslations();

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full border-b border-gold/20 bg-marble-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm"
        >
            <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
                {/* Language Picker - Top Left on Mobile */}
                <div className="md:absolute md:left-4 md:top-1/2 md:-translate-y-1/2">
                    <LanguagePicker />
                </div>

                {/* Logo Area - Centered on Mobile, Left on Desktop */}
                <Link href="/" className="flex items-center gap-3 group mx-auto md:mx-0 md:ml-24">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-gold shadow-sm group-hover:shadow-gold/50 transition-all bg-white"
                    >
                        <Image
                            src="/assets/malaga logo.jpg"
                            alt="Málaga Trivia Quiz Night"
                            fill
                            className="object-contain p-0.5"
                        />
                    </motion.div>
                    <div className="flex flex-col">
                        <span className="font-heading font-bold text-xl text-aegean-dark tracking-wider group-hover:text-aegean transition-colors leading-none">
                            Málaga Trivia
                        </span>
                        <span className="text-xs text-gold font-bold tracking-widest uppercase">Quiz Night</span>
                    </div>
                </Link>

                {/* Navigation - Hidden on Mobile */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/#leaderboard" className="text-obsidian hover:text-aegean font-body font-medium transition-colors relative group">
                        {t('leaderboard.title')}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full" />
                    </Link>
                    <Link href="/#about" className="text-obsidian hover:text-aegean font-body font-medium transition-colors relative group">
                        {t('hero.howItWorks')}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full" />
                    </Link>
                </nav>

                {/* Action Button - Hidden as per spec */}
                <div className="hidden"></div>
            </div>
        </motion.header>
    );
}
