import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
    const { t } = useTranslation();

    return (
        <>
            <Helmet>
                <title>{t('notFound.pageTitle')}</title>
            </Helmet>
          
            <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
                <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.p 
                        className="text-base font-semibold text-blue-500"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                    >
                        404
                    </motion.p>
                    <motion.h1 
                        className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        {t('notFound.title')}
                    </motion.h1>
                    <motion.p 
                        className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        {t('notFound.message')}
                    </motion.p>
                    <motion.div 
                        className="mt-10 flex items-center justify-center gap-x-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <Button to="/" color="blue" className="hover-scale tap-effect">
                            {t('notFound.backButton')}
                        </Button>
                    </motion.div>
                </motion.div>
            </main>
        </>
    );
};

export default NotFoundPage;
