import Button from '@/components/Button'
import Container from '@/components/Container'
import { useTranslation } from 'react-i18next';
import backgroundImage from '@/images/background-call-to-action.jpg'

const CallToAction = () => {
  const { t } = useTranslation();
  
  return (
    <section
      id="get-started-today"
      className="relative overflow-hidden bg-blue-600 py-32"
    >
      <img
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
        unoptimized="true"
      />
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            {t('ctaTitle')}
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
            {t('ctaText')}
          </p>
          <Button href="/register" color="white" className="mt-10">
            {t('getOneMonthFree')}
          </Button>
        </div>
      </Container>
    </section>
  )
}

export default CallToAction

