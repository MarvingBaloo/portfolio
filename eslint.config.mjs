import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

// `eslint-config-next` 16 exporte directement un tableau de configs plates :
// ni `FlatCompat` ni `@eslint/eslintrc` ne sont nécessaires.
const config = [
  { ignores: [".next/**", "out/**"] },
  ...nextCoreWebVitals,
];

export default config;
