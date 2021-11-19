const jwt = require("jsonwebtoken");
const BCHJS = require("@psf/bch-js");
let bchjs = new BCHJS();

const validateTokenHolder = async (slpAddr, tokenid) => {
  let tokenBalances = await bchjs.SLP.Utils.balancesForToken(tokenid).then(
    (res) => {
      return res.filter((balanceOutput) => {
        return balanceOutput.slpAddress === slpAddr;
      });
    }
  );
  return tokenBalances[0];
};

const signPayload = (privKeyWIF, payload = null) => {
  if (payload === null) {
    payload = {
      name: "Bitcoin Bay",
    };
  }
  return {
    payload: payload,
    signedMsg: bchjs.BitcoinCash.signMessageWithPrivKey(
      privKeyWIF,
      JSON.stringify(payload)
    ),
  };
};

const verifySignedPayload = (address, signedMsg, payload) => {
  return bchjs.BitcoinCash.verifyMessage(
    address,
    signedMsg,
    JSON.stringify(payload)
  );
};

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
  validateTokenHolder,
  signPayload,
  verifySignedPayload,
  createJWT,
  verifyJWT,
};
