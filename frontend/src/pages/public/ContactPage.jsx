'use client'

import { useState } from 'react'
import { Field, Label, Switch } from '@headlessui/react'
import Logo from '@/components/Logo'
import Button from '@/components/Button'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function ContactPage() {
  const [agreed, setAgreed] = useState(false)
  const { t } = useTranslation()

  const handleSwitchChange = (checked) => {
    setAgreed(checked)
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Blobs SVG bleu localisés, effet moderne et irradiant */}
      <svg
        className="absolute left-0 top-0 w-[900px] h-[900px] -z-10 pointer-events-none"
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        width="900"
        height="900"
        style={{ filter: 'blur(18px)' }}
      >
        <defs>
          <radialGradient id="blobA" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blobB" cx="70%" cy="20%" r="50%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Blob principal, plus large et clair */}
        <ellipse cx="400" cy="260" rx="380" ry="260" fill="url(#blobA)" />
        {/* Blob plus foncé, plus petit */}
        <ellipse cx="220" cy="140" rx="170" ry="130" fill="url(#blobB)" />
      </svg>
      {/* Logo en haut à gauche, cliquable, taille h-10 */}
      <div className="absolute left-0 top-0 p-6 z-10">
        <Link to="/" aria-label="Home">
          <Logo className="h-10 w-auto hover:scale-105 transition-transform duration-200" />
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 w-full">
        <div className="mx-auto max-w-2xl text-center mb-8 mt-16 sm:mt-24">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">{t('contact.title')}</h2>
          <p className="mt-2 text-lg/8 text-gray-600">{t('contact.subtitle')}</p>
        </div>
        <form action="#" method="POST" className="mx-auto mt-4 max-w-2xl w-full">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <label htmlFor="first-name" className="block text-sm font-semibold text-gray-900">
                {t('register.firstNameLabel')}
              </label>
              <div className="mt-2.5">
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-2 border-blue-100 bg-transparent px-3.5 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label htmlFor="last-name" className="block text-sm font-semibold text-gray-900">
                {t('register.lastNameLabel')}
              </label>
              <div className="mt-2.5">
                <input
                  id="last-name"
                  name="last-name"
                  type="text"
                  autoComplete="family-name"
                  className="block w-full rounded-md border-2 border-blue-100 bg-transparent px-3.5 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="company" className="block text-sm font-semibold text-gray-900">
                {t('contact.companyLabel')}
              </label>
              <div className="mt-2.5">
                <input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  className="block w-full rounded-md border-2 border-blue-100 bg-transparent px-3.5 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                {t('contact.emailLabel')}
              </label>
              <div className="mt-2.5">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-2 border-blue-100 bg-transparent px-3.5 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="phone-number" className="block text-sm font-semibold text-gray-900">
                {t('contact.phoneLabel')}
              </label>
              <div className="mt-2.5">
                <input
                  id="phone-number"
                  name="phone-number"
                  type="text"
                  placeholder="06 12 34 56 78"
                  className="block w-full rounded-md border-2 border-blue-100 bg-transparent px-3.5 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className="block text-sm font-semibold text-gray-900">
                {t('contact.messageLabel')}
              </label>
              <div className="mt-2.5">
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="block w-full rounded-md border-2 border-blue-100 bg-transparent px-3.5 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                  defaultValue={''}
                />
              </div>
            </div>
            <Field className="flex gap-x-4 sm:col-span-2 mt-2">
              <div
                className={`flex items-center w-full rounded-md px-4 py-3 transition-all`}
              >
                <Switch
                  checked={agreed}
                  onChange={handleSwitchChange}
                  className={`group flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-gray-900/5 transition-all duration-300 ease-in-out ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-200 ${agreed ? 'bg-blue-500' : 'bg-gray-200'}`}
                  id="privacy-switch"
                  aria-checked={agreed}
                >
                  <span className="sr-only">{t('contact.agreeText')}</span>
                  <span
                    aria-hidden="true"
                    className={`size-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition-all duration-300 ease-in-out ${agreed ? 'translate-x-3.5 shadow-md' : ''}`}
                  />
                </Switch>
                <label
                  htmlFor="privacy-switch"
                  className="ml-4 text-sm select-none text-gray-600 w-full cursor-pointer"
                  style={{ background: 'transparent', padding: 0, border: 'none' }}
                  onClick={() => handleSwitchChange(!agreed)}
                >
                  {(() => {
                    const agreeText = t('contact.agreeText');
                    const policy = t('contact.privacyPolicy', 'politique de confidentialité');
                    if (agreeText.includes(policy)) {
                      const [before, after] = agreeText.split(policy);
                      return <>{before}<a href="/privacy" className="font-semibold text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{policy}</a>{after}</>;
                    }
                    return agreeText;
                  })()}
                </label>
              </div>
            </Field>
          </div>
          <div className="mt-10">
            <Button
              type="submit"
              variant="solid"
              color="blue"
              className="w-full text-base font-semibold shadow-xs"
              disabled={!agreed}
            >
              {t('contact.sendMessage')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
