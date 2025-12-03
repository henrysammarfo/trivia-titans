import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function Footer() {
    const t = useTranslations();

    return (
        <footer className="bg-aegean-dark text-marble-white py-12 border-t-4 border-gold">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <h3 className="font-heading text-xl font-bold text-gold mb-4">{t('app.title')}</h3>
                        <p className="text-marble-light/80 text-sm leading-relaxed">
                            {t('footer.description')}
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-heading text-lg font-semibold text-white mb-4">{t('footer.quickLinks')}</h4>
                        <ul className="space-y-2 text-sm text-marble-light/80">
                            <li>
                                <Link href="/" className="hover:text-gold transition-colors">{t('leaderboard.title')}</Link>
                            </li>
                            <li>
                                <Link href="/admin/login" className="hover:text-gold transition-colors">{t('admin.title')}</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-heading text-lg font-semibold text-white mb-4">{t('footer.contact')}</h4>
                        <p className="text-marble-light/80 text-sm">
                            Follow us on Instagram for updates and hints.
                        </p>
                        <a
                            href="https://www.instagram.com/malagatrivia/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-4 text-gold hover:text-gold-light font-medium transition-colors"
                        >
                            @malagatrivia
                        </a>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-xs text-marble-light/40">
                    <p>&copy; {new Date().getFullYear()} {t('app.title')}. {t('footer.rights')}</p>
                </div>
            </div>
        </footer>
    );
}
