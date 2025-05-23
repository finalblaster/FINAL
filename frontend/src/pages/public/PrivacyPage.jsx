'use client'

import Logo from '@/components/Logo'
import Footer from '@/components/Footer'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function PrivacyPage() {
  const { t } = useTranslation()

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
        <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
          <h1 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl mb-8">
            {t('privacy.title', 'Politique de Confidentialité')}
          </h1>

          <div className="prose prose-blue max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('privacy.introduction.title', 'Introduction')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('privacy.introduction.content', 'Chez Sputnik, nous nous engageons à protéger votre vie privée et vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations dans le cadre de notre service de conciergerie numérique.')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('privacy.collection.title', 'Collecte des Informations')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('privacy.collection.content', 'Dans le cadre de notre service de conciergerie numérique, nous collectons les informations suivantes :')}
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>{t('privacy.collection.items.owner', 'Pour les propriétaires : nom, prénom, adresse email, numéro de téléphone, informations de paiement, détails des biens immobiliers')}</li>
                <li>{t('privacy.collection.items.tenant', 'Pour les locataires : nom, prénom, adresse email, numéro de téléphone, questions et demandes relatives au logement')}</li>
                <li>{t('privacy.collection.items.property', 'Informations sur les propriétés : adresse, équipements, règles spécifiques, documents techniques')}</li>
                <li>{t('privacy.collection.items.interaction', 'Historique des interactions avec notre assistant vocal 3D')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('privacy.usage.title', 'Utilisation des Informations')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('privacy.usage.content', 'Nous utilisons vos données pour :')}
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>{t('privacy.usage.items.service', 'Fournir et améliorer notre service de conciergerie numérique 24/7')}</li>
                <li>{t('privacy.usage.items.assistant', 'Former et optimiser notre assistant vocal 3D pour répondre aux questions des locataires')}</li>
                <li>{t('privacy.usage.items.communication', 'Communiquer avec vous concernant votre compte et les demandes des locataires')}</li>
                <li>{t('privacy.usage.items.analytics', 'Analyser les tendances d\'utilisation pour améliorer nos services')}</li>
                <li>{t('privacy.usage.items.billing', 'Gérer la facturation et les paiements')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('privacy.protection.title', 'Protection des Données')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('privacy.protection.content', 'Nous mettons en œuvre des mesures de sécurité avancées pour protéger vos données :')}
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>{t('privacy.protection.items.encryption', 'Chiffrement des données sensibles')}</li>
                <li>{t('privacy.protection.items.access', 'Contrôle d\'accès strict aux données')}</li>
                <li>{t('privacy.protection.items.audit', 'Surveillance et audit réguliers de la sécurité')}</li>
                <li>{t('privacy.protection.items.backup', 'Sauvegardes régulières des données')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('privacy.rights.title', 'Vos Droits')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('privacy.rights.content', 'Conformément au RGPD, vous disposez des droits suivants :')}
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>{t('privacy.rights.items.access', 'Droit d\'accès à vos données personnelles')}</li>
                <li>{t('privacy.rights.items.rectification', 'Droit de rectification des données inexactes')}</li>
                <li>{t('privacy.rights.items.deletion', 'Droit à l\'effacement de vos données')}</li>
                <li>{t('privacy.rights.items.opposition', 'Droit d\'opposition au traitement')}</li>
                <li>{t('privacy.rights.items.portability', 'Droit à la portabilité de vos données')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('privacy.retention.title', 'Conservation des Données')}
              </h2>
              <p className="text-gray-600">
                {t('privacy.retention.content', 'Nous conservons vos données aussi longtemps que nécessaire pour fournir nos services et respecter nos obligations légales. Les données sont automatiquement supprimées après une période d\'inactivité de 2 ans.')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('privacy.contact.title', 'Nous Contacter')}
              </h2>
              <p className="text-gray-600">
                {t('privacy.contact.content', 'Pour toute question concernant notre politique de confidentialité ou pour exercer vos droits, veuillez nous contacter à :')}
              </p>
              <p className="text-blue-600 font-medium mt-2">
                {t('privacy.contact.email', 'privacy@sputnik.fr')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('privacy.updates.title', 'Mises à Jour')}
              </h2>
              <p className="text-gray-600">
                {t('privacy.updates.content', 'Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications prendront effet dès leur publication sur notre site. Nous vous informerons de tout changement important par email.')}
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer className="bg-transparent" />
    </div>
  )
} 