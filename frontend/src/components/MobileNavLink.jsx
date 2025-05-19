import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Popover } from '@headlessui/react';

// On s'assure que le même élément fantôme pour le décalage est utilisé pour mobile
// Le composant NavLink crée déjà l'élément, donc on ne le recrée pas ici

export function MobileNavLink({ to, children }) {
  // Function to smoothly scroll to an element with custom easing
  const smoothScrollTo = (targetY, duration) => {
    const startY = window.pageYOffset;
    const difference = targetY - startY;
    const startTime = performance.now();
    
    // Easing function: easeInOutQuad
    const easeInOutQuad = (t) => {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }
    
    const animateScroll = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const eased = easeInOutQuad(progress);
      
      window.scrollTo(0, startY + difference * eased);
      
      if (elapsedTime < duration) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  };

  const handleClick = (e) => {
    // Ne traiter que les liens internes (ancres)
    if (to.startsWith('#')) {
      e.preventDefault();
      
      const targetId = to.substring(1);
      const targetElement = document.getElementById(targetId);
      
      // Fermer le menu mobile en cliquant sur le bouton de fermeture
      const closeButton = document.querySelector('[aria-label="Toggle Navigation"]');
      if (closeButton) {
        closeButton.click();
      }
      
      // Délai pour laisser le menu se fermer avant de défiler
      setTimeout(() => {
        if (targetElement) {
          // Position de l'élément avec 90px supplémentaires (+20px de plus)
          const yOffset = -60; // Décalage initial
          const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset + 90;
          
          // Animation plus longue et plus fluide (900ms au lieu de la valeur par défaut)
          smoothScrollTo(y, 900);
        }
      }, 150);
    }
  };

  // Add scroll-margin-top to section elements when component mounts
  useEffect(() => {
    document.querySelectorAll('section[id]').forEach(section => {
      section.style.scrollMarginTop = '120px'; // Slightly more for mobile
    });

    return () => {
      // Clean up when component unmounts
      document.querySelectorAll('section[id]').forEach(section => {
        section.style.scrollMarginTop = '';
      });
    };
  }, []);

  return (
    <Popover.Button as={Link} to={to} className="block w-full p-2" onClick={handleClick}>
      {children}
    </Popover.Button>
  );
}

export default MobileNavLink; 