const localAppUrl = "http://localhost:3000";

const withHttps = (host: string) => (host.startsWith("http://") || host.startsWith("https://") ? host : `https://${host}`);

const normalizeUrl = (url: string) => url.replace(/\/$/, "");

export const getAppUrl = () => {
  if (process.env.AUTH_URL) {
    return normalizeUrl(withHttps(process.env.AUTH_URL));
  }

  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return normalizeUrl(withHttps(process.env.VERCEL_PROJECT_PRODUCTION_URL));
  }

  if (process.env.VERCEL_URL) {
    return normalizeUrl(withHttps(process.env.VERCEL_URL));
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return normalizeUrl(withHttps(process.env.VERCEL_PROJECT_PRODUCTION_URL));
  }

  return localAppUrl;
};
