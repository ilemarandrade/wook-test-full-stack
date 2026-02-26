import en from '../constants/traductions/en';
import es, { TypesTraductions } from '../constants/traductions/es';

const handleTraductions = (lang: string = 'en') => {
  const traductions: { [key: string]: TypesTraductions } = { en, es };
  const selectedTraductions = traductions[lang];

  const t = (value: string): string => {
    const valueSplit = value.split('.');
    let findValue: string | TypesTraductions | undefined;

    valueSplit.reduce((acumulator: TypesTraductions, key) => {
      findValue = acumulator[key];
      return acumulator;
    }, selectedTraductions);

    return (findValue as string) || '';
  };

  return { t };
};

export default handleTraductions;
