const asyncSequenceMap = <P, R>(array: P[], cb: (param: P) => Promise<R>) => {
  const run = (index = 0, accResult: R[] = []): Promise<R[]> => {
    if (index >= array.length) return Promise.resolve(accResult);

    return cb(array[index]).then((result: R) =>
      run(index + 1, [...accResult, result])
    );
  };

  return run();
};

export default asyncSequenceMap;
