import Container from '@/components/Container';
import { useTranslation } from 'react-i18next';
import backgroundImage from '@/images/background-faqs.jpg';
import AnimatedText from '@/components/AnimatedText';

const Faqs = () => {
    const { t } = useTranslation();
    
    const faqs = [
        [
          {
            question: t('faqs.faq1.question'),
            answer: t('faqs.faq1.answer'),
          },
          {
            question: t('faqs.faq2.question'),
            answer: t('faqs.faq2.answer'),
          },
          {
            question: t('faqs.faq3.question'),
            answer: t('faqs.faq3.answer'),
          },
        ],
        [
          {
            question: t('faqs.faq4.question'),
            answer: t('faqs.faq4.answer'),
          },
          {
            question: t('faqs.faq5.question'),
            answer: t('faqs.faq5.answer'),
          },
          {
            question: t('faqs.faq6.question'),
            answer: t('faqs.faq6.answer'),
          },
        ],
        [
          {
            question: t('faqs.faq7.question'),
            answer: t('faqs.faq7.answer'),
          },
          {
            question: t('faqs.faq8.question'),
            answer: t('faqs.faq8.answer'),
          },
          {
            question: t('faqs.faq9.question'),
            answer: t('faqs.faq9.answer'),
          },
        ],
    ];
    
    return (
        <section
          id="faq"
          aria-labelledby="faq-title"
          className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
        >
          <img
            className="absolute left-1/2 top-0 max-w-none -translate-y-1/4 translate-x-[-30%]"
            src={backgroundImage}
            alt=""
            width={1558}
            height={946}
            unoptimized="true"
          />
          <Container className="relative">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2
                id="faq-title"
                className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
              >
                <AnimatedText 
                  text={t('faqs.title')}
                  element="span"
                  variants={{
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: 20 }
                  }}
                />
              </h2>
              <AnimatedText
                text={t('faqs.subtitle')}
                element="p"
                className="mt-4 text-lg tracking-tight text-slate-700"
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -20 }
                }}
              />
            </div>
            <ul
              role="list"
              className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
            >
              {faqs.map((column, columnIndex) => (
                <li key={columnIndex}>
                  <ul role="list" className="flex flex-col gap-y-8">
                    {column.map((faq, faqIndex) => (
                      <li key={faqIndex}>
                        <AnimatedText
                          text={faq.question}
                          element="h3"
                          className="font-display text-lg leading-7 text-slate-900"
                          variants={{
                            initial: { opacity: 0, y: 10 },
                            animate: { opacity: 1, y: 0 },
                            exit: { opacity: 0, y: -10 }
                          }}
                        />
                        <AnimatedText
                          text={faq.answer}
                          element="p"
                          className="mt-4 text-sm text-slate-700"
                          variants={{
                            initial: { opacity: 0 },
                            animate: { opacity: 1 },
                            exit: { opacity: 0 }
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )
}

export default Faqs
