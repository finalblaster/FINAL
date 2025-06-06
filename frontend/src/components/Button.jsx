import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

// Styles de base et variantes
const baseStyles = {
  solid: 'group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2',
  outline: 'group inline-flex ring-1 items-center justify-center rounded-full py-2 px-4 text-sm focus:outline-none',
};

const variantStyles = {
  solid: {
    slate: 'bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900',
    blue: 'bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600',
    white: 'bg-white text-slate-900 hover:bg-blue-50 active:bg-blue-200 active:text-slate-600 focus-visible:outline-white',
  },
  outline: {
    slate: 'ring-slate-200 text-slate-700 hover:text-slate-900 hover:ring-slate-300 active:bg-slate-100 active:text-slate-600 focus-visible:outline-blue-600 focus-visible:ring-slate-300',
    white: 'ring-slate-700 text-white hover:ring-slate-500 active:ring-slate-700 active:text-slate-400 focus-visible:outline-white',
  },
};

/**
 * Button component that can be styled with variants
 */
const Button = ({
  variant = 'solid', // Variante par défaut : 'solid'
  color = 'slate', // Couleur par défaut : 'slate'
  className,
  to, // Pour les liens internes via React Router
  href, // Pour les liens externes
  children,
  ...props
}) => {
  // Combinaison des classes avec clsx
  const buttonClassName = clsx(
    baseStyles[variant], // Applique les styles de base en fonction de la variante
    variantStyles[variant][color], // Applique les styles de la variante et de la couleur
    className // Classes personnalisées supplémentaires
  );

  // Si un to est fourni, utilise un composant <Link>
  if (to) {
    return (
      <Link to={to} className={buttonClassName} {...props}>
        {children}
      </Link>
    );
  }
  
  // Si un href est fourni, utilise un tag <a>
  if (href) {
    return (
      <a href={href} className={buttonClassName} {...props}>
        {children}
      </a>
    );
  }
  
  // Sinon, utilise un <button>
  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;