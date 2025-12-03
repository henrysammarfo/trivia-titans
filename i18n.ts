import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
    // Get locale from cookie or default to 'en'
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

    const messages = locale === 'es'
        ? (await import('./messages/es.json')).default
        : (await import('./messages/en.json')).default;

    return {
        locale,
        messages
    };
});
