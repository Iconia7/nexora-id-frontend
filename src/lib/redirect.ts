/**
 * Validates that a redirect URL is safe (same-origin) to prevent open-redirect attacks.
 *
 * Accepts:
 *  - Relative paths that start with '/'  (e.g. "/dashboard/apps")
 *  - Absolute URLs whose origin matches NEXT_PUBLIC_APP_URL
 *
 * Rejects everything else (external URLs, javascript:, data:, etc.)
 */
export function isSafeRedirect(url: string | null | undefined): boolean {
  if (!url) return false;

  // Allow simple relative paths (must start with / but not //)
  // Double-slash paths like //evil.com are treated as protocol-relative by browsers
  if (url.startsWith('/') && !url.startsWith('//')) return true;

  // Allow absolute URLs that match the configured app origin
  try {
    const appOrigin =
      process.env.NEXT_PUBLIC_APP_URL
        ? new URL(process.env.NEXT_PUBLIC_APP_URL).origin
        : null;

    if (appOrigin) {
      const target = new URL(url);
      return target.origin === appOrigin;
    }
  } catch {
    // URL constructor threw — not a valid absolute URL
  }

  return false;
}

/**
 * Returns the URL if it is safe, otherwise returns the fallback (defaults to '/dashboard/apps').
 */
export function safeRedirectUrl(
  url: string | null | undefined,
  fallback = '/dashboard/apps'
): string {
  return isSafeRedirect(url) ? url! : fallback;
}
