import { useTranslation } from 'react-i18next';
import Container from '@/components/Container';
import Logo from '@/components/Logo';
import NavLink from '@/components/NavLink';
import { Link } from 'react-router-dom'; // Import du composant Link

import React from 'react';

const Footer = () => {
  const { t } = useTranslation();
  
  const navigation = [
    {
      title: t('navigation.features'),
      links: [
        { title: t('features.feature1'), href: '/#features' },
        { title: t('features.feature2'), href: '/#features' },
        { title: t('features.feature3'), href: '/#features' },
      ],
    },
    {
      title: t('navigation.company'),
      links: [
        { title: t('navigation.about'), href: '/about' },
        { title: t('navigation.contact'), href: '/contact' },
      ],
    },
    {
      title: t('navigation.legal'),
      links: [
        { title: t('footer.terms'), href: '/terms' },
        { title: t('footer.privacy'), href: '/privacy' },
      ],
    },
  ]

  return (
    <footer className="bg-slate-50">
      <Container>
        <div className="py-16">
          <Logo className="mx-auto h-10 w-auto" />
          <nav className="mt-10 text-sm" aria-label="quick links">
            <div className="-my-1 flex justify-center gap-x-6">
              <NavLink href="#features">{t('navigation.features')}</NavLink>
              <NavLink href="#testimonials">{t('navigation.testimonials')}</NavLink>
              <NavLink href="#pricing">{t('navigation.pricing')}</NavLink>
            </div>
          </nav>
        </div>
        <div className="flex flex-col items-center border-t border-slate-400/10 py-10 sm:flex-row-reverse sm:justify-between">
          <div className="flex gap-x-6">
            <Link
              to="https://x.com"
              className="group"
              aria-label="Sputnik sur X"
              target="_blank" // Pour ouvrir dans un nouvel onglet
              rel="noopener noreferrer" // Bonne pratique pour les liens externes
            >
              <svg
                aria-hidden="true"
                className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            <Link
              to="https://www.instagram.com/"
              className="group"
              aria-label="Sputnik sur Instagram"
              target="_blank" // Pour ouvrir dans un nouvel onglet
              rel="noopener noreferrer" // Bonne pratique pour les liens externes
            >
              <svg
                aria-hidden="true"
                className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-500 sm:mt-0">
            {t('footer.copyright')}
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;