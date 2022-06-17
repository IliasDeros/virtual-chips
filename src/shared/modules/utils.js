export const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((y, f) => f(y), x);

/**
 * Get a parameter from the browser url.
 * Example:
 * URL = https://site.com?param1=value
 * getUrlParam("param1") // "value"
 *
 * @param {string} paramName name of the query param
 */
export function getUrlParam(paramName) {
  const params = new URLSearchParams(
    window.location.href.slice(window.location.href.indexOf("?"))
  );
  return params.get(paramName);
}
