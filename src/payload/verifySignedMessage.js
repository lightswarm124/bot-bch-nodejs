const { bchjs } = require("../utils/bch");

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

module.exports = {
  validateTokenHolder,
  signPayload,
  verifySignedPayload,
};
