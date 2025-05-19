# Organisation des traductions

Ce dossier contient toutes les traductions utilisées dans l'application, organisées de manière modulaire pour faciliter la maintenance et éviter les duplications.

## Structure des fichiers

- `index.js` : Point d'entrée qui initialise i18next et importe tous les modules de traduction
- `common.js` : Fichier legacy contenant des traductions générales (à migrer progressivement vers les modules)
- `modules/` : Dossier contenant les traductions organisées par module fonctionnel
  - `auth.js` : Traductions pour les pages d'authentification (login, register, etc.)
  - `common.js` : Traductions communes réutilisables dans toute l'application
  - `ui.js` : Éléments d'interface utilisateur (menus, boutons, etc.)
  - `landing.js` : Traductions pour la page d'accueil
  - Autres modules spécifiques aux fonctionnalités (dashboard, documents, etc.)

## Organisation des clés

Les traductions sont organisées hiérarchiquement par:

1. **Module fonctionnel** : séparation logique des traductions par domaine (auth, dashboard, etc.)
2. **Langue** : fr, en, es, de
3. **Section** : regroupement logique des traductions au sein d'un module (ex: login, register dans auth)

## Exemple d'utilisation

```jsx
import { useTranslation } from 'react-i18next';

function LoginForm() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('login.title')}</h1>
      <input placeholder={t('login.emailPlaceholder')} />
      <button>{t('login.submitButton')}</button>
    </div>
  );
}
```

## Bonnes pratiques

1. **Éviter les duplications** : Ne pas répéter les mêmes traductions dans différents fichiers
2. **Organiser par fonctionnalité** : Garder les traductions regroupées par module fonctionnel
3. **Maintenir la cohérence** : Utiliser des conventions de nommage cohérentes pour les clés
4. **Documentation** : Ajouter des commentaires pour les sections complexes
5. **Complétion** : S'assurer que toutes les langues supportées ont les traductions nécessaires

## Processus d'ajout de nouvelles traductions

1. Identifier le module approprié pour la nouvelle traduction
2. Ajouter la clé et la valeur pour chaque langue supportée
3. Si nécessaire, créer un nouveau fichier dans le dossier `modules/`
4. Importer et ajouter le nouveau module dans `index.js` 