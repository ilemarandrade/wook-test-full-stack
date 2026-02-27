import en from '../constants/traductions/en';
import es, { TypesTraductions } from '../constants/traductions/es';

const handleTraductions = (lang: string = 'es') => {
  const traductions: { [key: string]: TypesTraductions } = { en, es };
  const selectedTraductions = traductions[lang] ?? traductions.es;

  const t = (value: string): string => {
    const keys = value.split('.');
    let current: TypesTraductions | string | undefined = selectedTraductions;

    for (const key of keys) {
      if (!current || typeof current === 'string') break;
      current = current[key];
    }

    return typeof current === 'string' ? current : '';
  };

  return { t };
};

export default handleTraductions;
