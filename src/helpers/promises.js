const handleProm = (promise) => {
  return promise.then((res) => [res, null]).catch((err) => [null, err]);
};

export { handleProm };
