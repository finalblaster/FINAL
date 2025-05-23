import { useTranslation } from 'react-i18next';
import Logo from '@/components/Logo';
import { Link } from 'react-router-dom';
import React from 'react';

const navigation = (t) => ({
  solutions: [
    { name: t('features.feature1', 'Marketing'), href: '/#features' },
    { name: t('features.feature2', 'Analytics'), href: '/#features' },
    { name: t('features.feature3', 'Automation'), href: '/#features' },
    { name: t('features.feature4', 'Commerce'), href: '/#features' },
    { name: t('features.feature5', 'Insights'), href: '/#features' },
  ],
  support: [
    { name: t('footer.submit_ticket', 'Submit ticket'), href: '#' },
    { name: t('footer.documentation', 'Documentation'), href: '#' },
    { name: t('footer.guides', 'Guides'), href: '#' },
  ],
  company: [
    { name: t('navigation.about', 'About'), href: '/about' },
    { name: t('footer.blog', 'Blog'), href: '#' },
    { name: t('footer.jobs', 'Jobs'), href: '#' },
    { name: t('footer.press', 'Press'), href: '#' },
  ],
  legal: [
    { name: t('footer.terms', 'Terms of service'), href: '/terms' },
    { name: t('footer.privacy', 'Privacy policy'), href: '/privacy' },
    { name: t('footer.license', 'License'), href: '#' },
  ],
});

const social = [
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    ),
  },
  {
    name: 'X',
    href: 'https://x.com',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    ),
  },
  {
    name: 'GitHub',
    href: 'https://github.com',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z"/></svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.12C19.19 3.5 12 3.5 12 3.5s-7.19 0-9.386.566A2.994 2.994 0 0 0 .502 6.186C0 8.384 0 12 0 12s0 3.616.502 5.814a2.994 2.994 0 0 0 2.112 2.12C4.81 20.5 12 20.5 12 20.5s7.19 0 9.386-.566a2.994 2.994 0 0 0 2.112-2.12C24 15.616 24 12 24 12s0-3.616-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
    ),
  },
];

const Footer = ({ className = "bg-transparent" }) => {
  const { t } = useTranslation();
  const nav = navigation(t);

  return (
    <footer className={className + " relative z-10"} aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto max-w-7xl px-6 py-8 sm:py-10 lg:px-8 lg:py-12">
        <div className="md:flex md:justify-between md:items-start">
          {/* Colonne gauche : logo, texte, réseaux sociaux */}
          <div className="md:w-1/3 flex flex-col items-start mb-6 md:mb-0">
            <Link to="/" aria-label="Home" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Logo className="h-8 w-auto mb-4 hover:scale-105 transition-transform duration-200" />
            </Link>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              {t('footer.description', 'Making the world a better place through constructing elegant hierarchies.')}
            </p>
            <div className="flex space-x-5">
              {social.map((item) => (
                <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label={item.name}>
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
          {/* Colonnes de liens */}
          <div className="md:w-2/3 grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold leading-6 text-gray-900 mb-4">{t('footer.solutions', 'Solutions')}</h3>
              <ul role="list" className="space-y-2">
                {nav.solutions.map((item) => (
                  <li key={item.name}>
                    <Link to={item.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 text-gray-900 mb-4">{t('footer.support', 'Support')}</h3>
              <ul role="list" className="space-y-2">
                {nav.support.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 text-gray-900 mb-4">{t('footer.company', 'Company')}</h3>
              <ul role="list" className="space-y-2">
                {nav.company.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 text-gray-900 mb-4">{t('footer.legal', 'Legal')}</h3>
              <ul role="list" className="space-y-2">
                {nav.legal.map((item) => (
                  <li key={item.name}>
                    <Link to={item.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-4 border-gray-200" />
        <p className="text-xs text-gray-500 text-center">© 2025 Your Company, Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;