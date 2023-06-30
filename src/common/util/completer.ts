const completer = <T>() => {
  let resolve: (value?: T | PromiseLike<T>) => void;
  let reject: (reason?: any) => void;
  let promise: Promise<T>
  const reset = () => {
    promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
  };
  reset();
  return { promise, resolve, reject, reset };
}
export default completer;
