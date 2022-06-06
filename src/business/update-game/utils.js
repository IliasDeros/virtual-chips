export const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((y, f) => f(y), x);

export function _update(instance, updates) {
  if (!updates) {
    return instance;
  }

  return {
    ...instance,
    gameUpdates: {
      ...instance.gameUpdates,
      ...updates,
    },
  };
}
