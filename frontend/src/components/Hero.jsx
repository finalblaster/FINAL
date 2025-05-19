import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '@/components/Container';
import Button from '@/components/Button';
import AnimatedText from '@/components/AnimatedText';
import logoLaravel from '@/assets/images/logos/laravel.svg';
import logoMirage from '@/assets/images/logos/mirage.svg';
import logoStatamic from '@/assets/images/logos/statamic.svg';
import logoStaticKit from '@/assets/images/logos/statickit.svg';
import logoTransistor from '@/assets/images/logos/transistor.svg';
import logoTuple from '@/assets/images/logos/tuple.svg';

const Hero = () => {
  const { t } = useTranslation();
  
  return (
    <Container className="pb-16 pt-20 text-center lg:pt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
          <AnimatePresence mode="wait">
            <motion.span
              key={t('heroTitlePart1')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-gradient"
            >
              {t('heroTitlePart1')}
            </motion.span>
          </AnimatePresence>{' '}
          <span className="relative whitespace-nowrap text-blue-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 418 42"
              className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70"
              preserveAspectRatio="none"
            >
              <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
            </svg>
            <AnimatePresence mode="wait">
              <motion.span
                key={t('heroTitlePart2')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="relative"
              >
                {t('heroTitlePart2')}
              </motion.span>
            </AnimatePresence>
          </span>{' '}
          <AnimatePresence mode="wait">
            <motion.span
              key={t('heroTitlePart3')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {t('heroTitlePart3')}
            </motion.span>
          </AnimatePresence>
        </h1>
        <AnimatePresence mode="wait">
          <motion.p
            key={t('heroSubtitleFull')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700"
          >
            {t('heroSubtitleFull')}
          </motion.p>
        </AnimatePresence>
        <div className="mt-10 flex justify-center gap-x-6">
          <Button to="/register">{t('getOneMonthFree')}</Button>
          <Button
            href="https://www.youtube.com/watch?v=Olgn9sXNdl0"
            variant="outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              aria-hidden="true"
              className="h-3 w-3 flex-none fill-blue-600 group-active:fill-current"
            >
              <path d="m9.997 6.91-7.583 3.447A1 1 0 0 1 1 9.447V2.553a1 1 0 0 1 1.414-.91L9.997 5.09c.782.355.782 1.465 0 1.82Z" />
            </svg>
            <span className="ml-3">{t('watchVideo')}</span>
          </Button>
        </div>
        <div className="mt-36 lg:mt-44">
          <AnimatePresence mode="wait">
            <motion.p
              key={t('trustedBy')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="font-display text-base text-slate-900"
            >
              {t('trustedBy')}
            </motion.p>
          </AnimatePresence>
          <ul
            role="list"
            className="mt-8 flex items-center justify-center gap-x-8 sm:flex-col sm:gap-x-0 sm:gap-y-10 xl:flex-row xl:gap-x-12 xl:gap-y-0"
          >
            {[
              [
                { name: 'Transistor', logo: logoTransistor },
                { name: 'Tuple', logo: logoTuple },
                { name: 'StaticKit', logo: logoStaticKit },
              ],
              [
                { name: 'Mirage', logo: logoMirage },
                { name: 'Laravel', logo: logoLaravel },
                { name: 'Statamic', logo: logoStatamic },
              ],
            ].map((group, groupIndex) => (
              <li key={groupIndex}>
                <ul
                  role="list"
                  className="flex flex-col items-center gap-y-8 sm:flex-row sm:gap-x-12 sm:gap-y-0"
                >
                  {group.map((company) => (
                    <li key={company.name} className="flex border-black border-solid">
                      <img src={company.logo} alt={company.name} unoptimized="true" />
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </Container>
  );
};

export default Hero;