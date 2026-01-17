const { validationResult } = require("express-validator");

const runSocketValidator = async (validators, data) => {
  const req = {
    body: data
  };

  for (const validator of validators) {
    await validator.run(req);
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errors.array();
  }

  return null;
};

module.exports = runSocketValidator;
