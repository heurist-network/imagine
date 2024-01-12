import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import LanguageSwitchLink from './LanguageSwitchLink'
import pkg from 'next-i18next/package.json'
import pkgLD from 'next-language-detector/package.json'
import { useState, useEffect } from 'react'

import i18nextConfig from '@/next-i18next.config'

export const Footer = () => {
  const router = useRouter()
  const { t } = useTranslation('footer')
  const [languages, setLanguages] = useState([]);
  const [selected, setSelected] = useState({})

  // 异步加载语言配置
  const fetchLanguages = async () => {
    const response = await fetch('/languages.json');
    const data = await response.json();
    setLanguages(data.languages);
    const { locale } = router.query
    // console.log('router-locale--', locale, data.languages);
    if (locale) {
      setSelected(data.languages.find(item => item.code === locale))
    } else {
      setSelected(data.languages[0])
    }
  };
  useEffect(() => {
    fetchLanguages();
  }, []);
  const currentLocale =
    router.query.locale || i18nextConfig.i18n.defaultLocale

  return (
    <footer>
      <p>{t('description')}</p>
      <p>
        <span style={{ fontSize: 'small', lineHeight: '4.65em' }}>
          {t('change-locale')}
        </span>
        {i18nextConfig.i18n.locales.map(locale => {
          if (locale === currentLocale) return null
          return <LanguageSwitchLink locale={locale} key={locale} />
        })}
      </p>
      <p>next-i18next v{pkg.version}</p>
      <p>next-language-detector v{pkgLD.version}</p>
    </footer>
  )
}
