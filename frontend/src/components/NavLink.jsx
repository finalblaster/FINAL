import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function NavLink({ to, children, active = false }) {
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
      
      if (targetElement) {
        // Position de l'élément avec 90px supplémentaires (+20px de plus)
        const yOffset = -80; // Décalage initial
        const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset + 90;
        
        // Animation plus longue et plus fluide (900ms au lieu de la valeur par défaut)
        smoothScrollTo(y, 900);
      }
    }
  };

  // Add scroll-margin-top to section elements when component mounts
  useEffect(() => {
    document.querySelectorAll('section[id]').forEach(section => {
      section.style.scrollMarginTop = '100px';
    });

    return () => {
      // Clean up when component unmounts
      document.querySelectorAll('section[id]').forEach(section => {
        section.style.scrollMarginTop = '';
      });
    };
  }, []);

  return (
    <Link
      to={to}
      className={`
        inline-block rounded-lg px-2 py-1 text-sm text-black hover:bg-gray-100
        ${active ? 'bg-gray-100' : ''}
      `}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}

export default NavLink;