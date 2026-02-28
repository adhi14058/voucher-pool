import { ENVIRONMENTS } from './config.constants';

let processEnv: NodeJS.ProcessEnv | null = null;

export const env = (name: string, required = true) => {
  processEnv ??= process.env;
  const value = processEnv[name];

  if (
    required &&
    (!value || value === 'undefined' || typeof value !== 'string')
  ) {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return value;
};

export const getEnvironment = () => {
  return (
    (env('CONFIG_ENVIRONMENT', false) as ENVIRONMENTS) ||
    ENVIRONMENTS.DEVELOPMENT
  );
};

export const isRunInCIPipeline = () => {
  return !!env('CI', false);
};

export const isDevEnv = () => {
  return getEnvironment() === ENVIRONMENTS.DEVELOPMENT;
};

export const isProductionEnv = () => {
  return getEnvironment() === ENVIRONMENTS.PRODUCTION;
};

//! TESTING ONLY
export const resetCacheProcessEnv = () => {
  processEnv = null;
};
