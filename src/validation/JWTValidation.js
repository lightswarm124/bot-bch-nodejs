const jwt = require("jsonwebtoken");
const { verifySignedPayload } = require("../payload/verifySignedMessage");

const createJWT = async (payload, signedMsg) => {
  return jwt.sign(payload, signedMsg, {
    algorithm: "HS256",
    noTimestamp: true,
  });
};

const verifyJWT = async (address, signedMsg, token) => {
  let payload = jwt.decode(token);
  let verifyMessage = verifySignedPayload(address, signedMsg, payload);
  if (verifyMessage === true) {
    try {
      let cert = jwt.verify(token, signedMsg, { ignoreExpiration: true });
      return "Validated JWT Signed & Created by Address";
    } catch (err) {
      return "Did not validate JWT payload data";
    }
  } else {
    return "Did not validate private-key signed message";
  }
};

module.exports = {
  createJWT,
  verifyJWT,
};
