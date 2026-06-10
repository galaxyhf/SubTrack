const localAppUrl = "http://localhost:3000";

const withHttps = (host: string) => (host.startsWith("http://") || host.startsWith("https://") ? host : `https://${host}`);

const normalizeUrl = (url: string) => url.replace(/\/$/, "");

const hasUsableValue = (value: string | undefined): value is string => {
  if (!value) return false;

  const normalized = value.trim().toLowerCase();

  return !["null", "undefined"].includes(normalized) && !normalized.startsWith("encrypted:");
};

export const getAppUrl = () => {
  const authUrl = process.env.AUTH_URL;
  const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const deploymentUrl = process.env.VERCEL_URL;

  if (hasUsableValue(authUrl)) {
    return normalizeUrl(withHttps(authUrl));
  }

  if (process.env.VERCEL_ENV === "production" && hasUsableValue(productionUrl)) {
    return normalizeUrl(withHttps(productionUrl));
  }

  if (hasUsableValue(deploymentUrl)) {
    return normalizeUrl(withHttps(deploymentUrl));
  }

  if (hasUsableValue(productionUrl)) {
    return normalizeUrl(withHttps(productionUrl));
  }

  return localAppUrl;
};
