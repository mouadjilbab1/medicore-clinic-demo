import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import en from '@/Locales/en.json';
import fr from '@/Locales/fr.json';
import ar from '@/Locales/ar.json';

const dictionaries: Record<string, Record<string, string>> = {
    en,
    fr,
    ar,
};

export function useTranslation() {
    const { props } = usePage<PageProps>();
    const locale = (props.locale || 'ar') as string;
    const serverTranslations = props.translations || {};

    const t = (key: string, defaultText?: string): string => {
        if (serverTranslations[key]) {
            return serverTranslations[key];
        }
        const dict = dictionaries[locale] || dictionaries.en;
        return dict[key] || defaultText || key;
    };

    const isRtl = locale === 'ar';

    return { t, locale, isRtl };
}

export function formatCurrency(amount: number, currency: string = 'MAD'): string {
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
    }).format(amount);
}
