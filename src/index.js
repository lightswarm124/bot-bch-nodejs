const { createJWT, verifyJWT } = require("./validation/JWTValidation");
const {
  signPayload,
  validateTokenHolder,
} = require("./payload/verifySignedMessage");

module.exports = {
  createJWT,
  verifyJWT,
  signPayload,
  validateTokenHolder,
};
