import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Composant pour animer le texte lors du changement de langue
 * @param {Object} props - Propriétés du composant
 * @param {string} props.text - Le texte à afficher et animer
 * @param {string} props.className - Classes CSS additionnelles
 * @param {string} props.element - L'élément HTML à utiliser (p, h1, h2, etc.)
 * @param {Object} props.variants - Variantes d'animation personnalisées
 * @returns {JSX.Element} Composant qui anime le texte
 */
const AnimatedText = ({ 
  text, 
  className = '', 
  element = 'div',
  variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  },
  ...props 
}) => {
  const [key, setKey] = useState(0);
  const [displayText, setDisplayText] = useState(text);

  // Mettre à jour la clé et le texte lorsque le texte change
  useEffect(() => {
    if (text !== displayText) {
      setKey(prevKey => prevKey + 1);
      setDisplayText(text);
    }
  }, [text, displayText]);

  // Créer l'élément en fonction du type spécifié
  const Element = element;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Element className={className} {...props}>
          {displayText}
        </Element>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedText; 