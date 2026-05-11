import {useTranslation} from 'react-i18next';

export function useAppTranslation() {
  const translation = useTranslation();

  return {
    ...translation,

    currentLanguage: translation.i18n.language,
  };
}
