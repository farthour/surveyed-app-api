// const catchAsync = fn => (...args) => fn(...args).catch(args[2])

// module.exports = catchAsync;

module.exports = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
};
