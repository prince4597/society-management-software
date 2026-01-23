export function createSingleton<T>(factory: () => T): () => T {
  let instance: T | undefined;
  return (): T => {
    if (!instance) {
      instance = factory();
    }
    return instance;
  };
}
