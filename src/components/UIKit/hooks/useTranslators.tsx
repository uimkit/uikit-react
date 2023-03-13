import { useState, useEffect } from 'react';
import { TranslationContextValue, defaultDateTimeParser, isLanguageSupported } from '../../../context';
import { Uimi18n, defaultTranslatorFunction } from '../../../i18n';

export type UseTranslatorsProps = {
  defaultLanguage?: string;
  i18nInstance,
}


export function useTranslators({
  defaultLanguage,
  i18nInstance,
}) {
  const [translators, setTranslators] = useState<TranslationContextValue>({
    t: defaultTranslatorFunction, // (key: string) => key,
    tDateTimeParser: defaultDateTimeParser,
    userLanguage: 'zh',
  });

  useEffect(() => {
    const browserLanguage = window.navigator.language.slice(0, 2); // just get language code, not country-specific version
    const userLanguage = isLanguageSupported(browserLanguage) ? browserLanguage : defaultLanguage;

    const uimi18n = i18nInstance || new Uimi18n({ language: userLanguage });

    uimi18n.registerSetLanguageCallback((t) =>
      setTranslators((prevTranslator) => ({ ...prevTranslator, t })),
    );

    uimi18n.getTranslators().then((translator) => {
      setTranslators({
        ...translator,
        userLanguage: userLanguage || defaultLanguage,
      });
    });
  }, [i18nInstance]);

  return {
    translators,
  };
}