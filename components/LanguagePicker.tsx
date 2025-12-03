'use client';

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LanguagePicker() {
    const [locale, setLocale] = useState('en');

    useEffect(() => {
        // Get current locale from cookie
        const currentLocale = document.cookie
            .split('; ')
            .find(row => row.startsWith('NEXT_LOCALE='))
            ?.split('=')[1] || 'en';
        setLocale(currentLocale);
    }, []);

    const toggleLocale = () => {
        const newLocale = locale === 'en' ? 'es' : 'en';
        // Set cookie
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`; // 1 year
        setLocale(newLocale);
        // Reload page to apply new locale
        window.location.reload();
    };

    return (
        <button
            onClick={toggleLocale}
            className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                "bg-white/80 hover:bg-white border border-gold/30 hover:border-gold/50",
                "text-obsidian hover:text-aegean font-medium text-sm",
                "shadow-sm hover:shadow-md",
                // Mobile optimization - larger touch target
                "min-h-[44px] min-w-[44px]"
            )}
            aria-label="Toggle language"
        >
            <Globe className="h-4 w-4" />
            <span className="font-heading">{locale === 'en' ? '🇬🇧 EN' : '🇪🇸 ES'}</span>
        </button>
    );
}
