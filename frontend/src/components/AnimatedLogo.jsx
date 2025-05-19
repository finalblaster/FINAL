import React, { useEffect, useRef } from 'react';
import logo from '@/assets/images/logos/logo.svg';
import logoSmall from '@/assets/images/logos/logo-small.svg';

const AnimatedLogo = ({ isCollapsed = false }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svgElement = svgRef.current;
    
    const restartAnimations = () => {
      if (!svgElement.contentDocument) return;
      const animations = [
        "animateRxInner", "animateRyInner", 
        "animateRotate0", "animateRxOuter0", "animateRyOuter0",
        "animateRotate72", "animateRxOuter72", "animateRyOuter72",
        "animateRotate144", "animateRxOuter144", "animateRyOuter144",
        "animateRotate216", "animateRxOuter216", "animateRyOuter216",
        "animateRotate288", "animateRxOuter288", "animateRyOuter288",
      ];

      animations.forEach((id) => {
        const animation = svgElement.contentDocument.getElementById(id);
        if (animation) animation.beginElement();
      });
    };

    const handleSvgLoad = () => {
      if (!svgElement.contentDocument) return;
      const svgAnimationElement = svgElement.contentDocument.getElementById("svgAnimation");
      if (svgAnimationElement) {
        svgAnimationElement.addEventListener("click", restartAnimations);
        restartAnimations();
      }
    };

    svgElement.addEventListener('load', handleSvgLoad);
    return () => {
      if (svgElement) {
        svgElement.removeEventListener('load', handleSvgLoad);
      }
    };
  }, []);

  return (
    <object
  ref={svgRef}
  type="image/svg+xml"
  data={isCollapsed ? logoSmall : logo}
  id="svgAnimation"
  className={isCollapsed ? "h-10 w-15" : "h-28 w-28"} // Ajustez les tailles ici
  aria-label="Animated Logo"
/>
  );
};

export default AnimatedLogo;