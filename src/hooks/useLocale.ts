import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const useLocale = () => {
  const router = useRouter();
  const { i18n } = useTranslation("common");

  const changeLocale = (locale: string | undefined) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale });
    i18n.changeLanguage(locale);
  };

  return { changeLocale };
};

export default useLocale;
