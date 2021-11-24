require("dotenv").config();
const jwt = require("jsonwebtoken");
const {
  createJWT,
  verifyJWT,
  validateTokenHolder,
  signPayload,
} = require("../index");
const { bchjs } = require("../utils/bch");

const mnemonicWords = process.env.MNEMONIC;
const network = process.env.NETWORK;
const tokenID = process.env.TOKENID;
const tokenID2 = process.env.TOKENID2;

const createKeyPair = async (mnemonic) => {
  const rootSeed = await bchjs.Mnemonic.toSeed(mnemonic);
  const masterHDNode = bchjs.HDNode.fromSeed(rootSeed, network);
  let address_index = 0;
  let coin_type;
  if (network === "mainnet") {
    coin_type = 245;
  } else {
    coin_type = 1;
  }
  const account = bchjs.HDNode.derivePath(
    masterHDNode,
    `m/44'/${coin_type}'/0'/0/${address_index}`
  );
  const privKeyWIF = bchjs.HDNode.toWIF(account);
  const cashAddr = bchjs.HDNode.toCashAddress(account);
  const slpAddr = bchjs.SLP.Address.toSLPAddress(cashAddr);
  return { cashAddr, slpAddr, privKeyWIF };
};

const run = async () => {
  let { cashAddr, slpAddr, privKeyWIF } = await createKeyPair(mnemonicWords);
  let getPayloadData = await validateTokenHolder(slpAddr, tokenID);
  let getPayloadData2 = await validateTokenHolder(slpAddr, tokenID2);
  // console.log(getPayloadData);
  let createSignedPayload = signPayload(privKeyWIF, getPayloadData);
  let createSignedPayload2 = signPayload(privKeyWIF, getPayloadData2);
  // console.log(createSignedPayload);

  let createSignedJWT = await createJWT(
    getPayloadData,
    createSignedPayload.signedMsg
  );
  // console.log(createSignedJWT);

  let createSignedJWT2 = await createJWT(
    getPayloadData2,
    createSignedPayload.signedMsg
  );

  let createFailSignedJWT2 = await createJWT(
    getPayloadData2,
    createSignedPayload.signedMsg
  );

  let verifySignedJWT = await verifyJWT(
    cashAddr,
    createSignedPayload.signedMsg,
    createSignedJWT
  );
  console.log(verifySignedJWT);

  let failKeySigning = await verifyJWT(
    cashAddr,
    createSignedPayload.signedMsg,
    createSignedJWT2
  );
  console.log(failKeySigning);

  let failSignedJWT = await verifyJWT(
    cashAddr,
    createSignedPayload2.signedMsg,
    createFailSignedJWT2
  );
  console.log(failSignedJWT);
};

run();
