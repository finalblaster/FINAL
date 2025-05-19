import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Link } from 'react-router-dom'; // Import du composant Link
import { useTranslation } from 'react-i18next';

import Button from '@/components/Button';
import Container from '@/components/Container';
import NavLink from '@/components/NavLink';
import MobileNavLink from '@/components/MobileNavLink';
import AnimatedLogo from '@/components/AnimatedLogo';
import LanguageSelector from '@/components/LanguageSelector';

// Icône du menu mobile (hamburger / croix)
function MobileNavIcon({ open }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx('origin-center transition', open && 'scale-90 opacity-0')}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx('origin-center transition', !open && 'scale-90 opacity-0')}
      />
    </svg>
  );
}

// Menu mobile avec animations
function MobileNavigation() {
  const { t } = useTranslation();
  
  return (
    <Popover>
      <Popover.Button
        className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
          >
            <MobileNavLink to="#features">{t('navigation.features')}</MobileNavLink>
            <MobileNavLink to="#testimonials">{t('navigation.testimonials')}</MobileNavLink>
            <MobileNavLink to="#pricing">{t('navigation.pricing')}</MobileNavLink>
            <hr className="m-2 border-slate-300/40" />
            <MobileNavLink to="/login">{t('navigation.login')}</MobileNavLink>
            <div className="mt-4 px-1">
              <LanguageSelector className="w-full" showText={true} dropdownAlign="left" />
            </div>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
}

// Composant principal Header
export function Header() {
  const { t } = useTranslation();
  
  return (
    <header className="py-10">
      <Container>
        <nav className="relative z-50 flex justify-between">
          {/* Logo et liens de navigation (version desktop) */}
          <div className="flex items-center md:gap-x-12">
            <Link to="/" aria-label="Home">
              <AnimatedLogo className="h-12 w-auto" />
            </Link>
            <div className="hidden md:flex md:gap-x-6">
              <NavLink to="#features">{t('navigation.features')}</NavLink>
              <NavLink to="#testimonials">{t('navigation.testimonials')}</NavLink>
              <NavLink to="#pricing">{t('navigation.pricing')}</NavLink>
            </div>
          </div>

          {/* Boutons de connexion et menu mobile */}
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:block">
              <LanguageSelector showText={false} />
            </div>
            <div className="hidden md:block">
              <NavLink to="/login">{t('navigation.login')}</NavLink>
            </div>
            <Button to="/register" color="blue">
              <span>
                {t('getStarted')}
                <span className="hidden lg:inline"> {t('now')}</span>
              </span>
            </Button>
            <div className="-mr-1 md:hidden">
              <MobileNavigation />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}

export default Header;