'use client'

import Logo from '@/components/Logo'
import Footer from '@/components/Footer'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function TermsPage() {
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
            {t('terms.title', 'Conditions d\'Utilisation')}
          </h1>

          <div className="prose prose-blue max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('terms.introduction.title', 'Introduction')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('terms.introduction.content', 'Bienvenue sur Zoopok. Ces conditions d\'utilisation régissent votre utilisation de notre service de conciergerie numérique. En utilisant notre service, vous acceptez ces conditions.')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('terms.definitions.title', 'Définitions')}
              </h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>{t('terms.definitions.items.service', 'Service : le service de conciergerie numérique Zoopok')}</li>
                <li>{t('terms.definitions.items.user', 'Utilisateur : toute personne utilisant le Service')}</li>
                <li>{t('terms.definitions.items.content', 'Contenu : toutes les informations, données, textes, logiciels, musiques, sons, photographies, graphiques, vidéos, messages ou autres matériaux')}</li>
                <li>{t('terms.definitions.items.account', 'Compte : l\'espace personnel de l\'utilisateur sur le Service')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('terms.usage.title', 'Utilisation du Service')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('terms.usage.content', 'En utilisant notre Service, vous vous engagez à :')}
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>{t('terms.usage.items.accurate', 'Fournir des informations exactes et complètes')}</li>
                <li>{t('terms.usage.items.security', 'Maintenir la sécurité de votre compte')}</li>
                <li>{t('terms.usage.items.compliance', 'Respecter toutes les lois et réglementations applicables')}</li>
                <li>{t('terms.usage.items.responsible', 'Utiliser le Service de manière responsable')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('terms.restrictions.title', 'Restrictions')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('terms.restrictions.content', 'Vous acceptez de ne pas :')}
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>{t('terms.restrictions.items.illegal', 'Utiliser le Service à des fins illégales')}</li>
                <li>{t('terms.restrictions.items.harmful', 'Publier du contenu nuisible ou offensant')}</li>
                <li>{t('terms.restrictions.items.unauthorized', 'Accéder sans autorisation à d\'autres comptes')}</li>
                <li>{t('terms.restrictions.items.disrupt', 'Perturber le fonctionnement du Service')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('terms.payment.title', 'Paiements et Abonnements')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('terms.payment.content', 'Les conditions de paiement incluent :')}
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>{t('terms.payment.items.fees', 'Les frais sont facturés à l\'avance')}</li>
                <li>{t('terms.payment.items.cancellation', 'Les annulations prennent effet à la fin de la période de facturation')}</li>
                <li>{t('terms.payment.items.refunds', 'Les remboursements sont soumis à notre politique de remboursement')}</li>
                <li>{t('terms.payment.items.changes', 'Nous pouvons modifier nos tarifs avec un préavis de 30 jours')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('terms.termination.title', 'Résiliation')}
              </h2>
              <p className="text-gray-600">
                {t('terms.termination.content', 'Nous nous réservons le droit de suspendre ou de résilier votre compte en cas de violation de ces conditions. Vous pouvez résilier votre compte à tout moment en nous contactant.')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('terms.contact.title', 'Nous Contacter')}
              </h2>
              <p className="text-gray-600">
                {t('terms.contact.content', 'Pour toute question concernant ces conditions d\'utilisation, veuillez nous contacter à :')}
              </p>
              <p className="text-blue-600 font-medium mt-2">
                {t('terms.contact.email', 'legal@zoopok.com')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('terms.updates.title', 'Mises à Jour')}
              </h2>
              <p className="text-gray-600">
                {t('terms.updates.content', 'Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront effet dès leur publication sur notre site. Nous vous informerons de tout changement important par email.')}
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer className="bg-transparent" />
    </div>
  )
} 