# Multilingual Feature

The NYPL Library Card Application will, as of November 2022, support the following languages: Arabic, Bengali, Chinese (Simplified), French, Haitian Creole, Korean, Polish, Russian, Spanish, and Urdu. The application itself will not accept non-Roman characters for its form fields, but it will support the display of non-Roman characters in the application's UI.

This feature supports building equity and allows patrons of all backgrounds to use the application in their native language.

## next-i18next package

In order to make this feature work, the `next-i18next` package was installed. This is a wrapper around the `i18next` package that provides a simple way to translate text in a Nextjs application through its `useTranslation` hook.

### NextJS i18n configuration

A new file `next-i18next.config.js` was created and language locales were added to let the Nextjs server know what languages to support. Doing so automatially creates a route for each language. In order to not confuse patrons, it was decided to _not_ update the URL path for a selected language. Instead, the selected language is updated through the app's URL query param `"lang"`. The selected language's 2-character code is used as the value for the query param, except for Chinese (Simplified) which is "zh-cn".

This configuration is then added to the Nextjs configuration in `next.config.js`.

Examples:

- Arabic `/library-card/new?lang=ar`
- Korean `/library-card/new?lang=ko`

### Translated JSON files

The `next-i18next` package uses JSON files to read translated text. The JSON files are stored in the `public/locales` directory. Every language has it's own folder based on its 2-character language code and the JSON file MUST be named `"common.json"`. For example, the JSON file for Arabic is `public/locales/ar/common.json`.

### Server-side Support

Since the app will not support language specific routing through Nextjs, the URL `"lang"` query param must be understood by the server. This is done through the `serverSideTranslations` function from the `next-i18next/serverSideTranslations` package. This function is called for _every_ page's `getServerSideProps` function and the query param value is passed. The returned value is then passed to the page's `props` as `pageProps`.

```tsx
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  // ...
  return {
    props: {
      // This allows this page to get the proper translations based
      // on the `lang=...` URL query param. Default to "en".
      ...(await serverSideTranslations(query?.lang?.toString() || "en", [
        "common",
      ])),
    },
  };
};
```

### Client-side Support

The entire app is wrapped in the `appWithTranslation` higher-order function from the `next-i18next` package in `pages/_app.js`. This allows the `useTranslation` hook to be used in any component.

### useTranslation Hook

The `useTranslations` hook from the `next-i18next` package is used to translate text in the application and the name of the JSON files, "common" in our case, must be passed. The hook returns an object with a `t` function that is used to target a specific key in the JSON file and retursn the desired text.

This is done for all static text and form field error messages. For API error messages, the error message is manually read and translated. See `src/data/apiErrorMessageTranslations.ts` for the translated API error messages.

```tsx
// pages/new/index.tsx
const { t } = useTranslation("common");

// ...
<Heading level="two">{t("home.title")}</Heading>;
```

```json
// public/locales/fr/common.json
{
  "home": {
    "title": "Obtenez votre carte de bibliothèque numérique en quelques étapes faciles"
  }
  // ...
}
```

## Accessibility

### lang attribute

The `lang` attribute is added to the `<html>` element in `pages/_app.tsx` based on the selected language. This allows screen readers to read the page in the correct language.

### dir attribute

The `dir` attribute is added to a NextJS `<div>` element in `pages/_app.tsx` based on the selected language. This is not added at the top `<html>` element because we do not have "right-to-left" support for the NYPL Header and Footer. Only the main content of the app should be displayed in "right-to-left" for the Arabic and Urdu languages (the only two languages that are "right-to-left").

### Bidirectionality

Once the `dir` attribute is added and the language selected is a "right-to-left" language, the Reservoir Design System package will take care of rendering all the UI components in the correct direction. More information can be found in the Reservoir's [Bidirectionality](https://nypl.github.io/nypl-design-system/reservoir/v1/?path=/story/style-guide-bidirectionality--page) documentation.
