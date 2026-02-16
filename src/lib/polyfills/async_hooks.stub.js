// Stub for node:async_hooks to prevent Vite/LangChain errors in the browser
export class AsyncLocalStorage {
  disable() {}
  getStore() {
    return undefined;
  }
  run(store, callback, ...args) {
    return callback(...args);
  }
  exit(callback, ...args) {
    return callback(...args);
  }
  enterWith(store) {}
}

export const executionAsyncId = () => 0;
export const triggerAsyncId = () => 0;
export const createHook = () => ({
  enable: () => {},
  disable: () => {},
});

export default {
  AsyncLocalStorage,
  executionAsyncId,
  triggerAsyncId,
  createHook,
};
