const BCHJS = require("@psf/bch-js");
let bchjs = new BCHJS();

const TOKENID = "";
const NETWORK = "mainnet";

const mnemonicWords = "";

const createKeyPair = async (mnemonic) => {
  const rootSeed = await bchjs.Mnemonic.toSeed(mnemonic);
  const masterHDNode = bchjs.HDNode.fromSeed(rootSeed, NETWORK)
  let address_index = 0;
  let coin_type;
  if (NETWORK === 'mainnet') {
    coin_type = 245;
  } else {
    coin_type = 1;
  }
  const account = bchjs.HDNode.derivePath(masterHDNode, `m/44'/${coin_type}'/0'/0/${address_index}`);
  const keypair = bchjs.HDNode.toKeyPair(account);
  const cashAddr = bchjs.HDNode.toCashAddress(account);
  const slpAddr = bchjs.SLP.Address.toSLPAddress(cashAddr);
  return { cashAddr, slpAddr, keypair };
}

const validateTokenHolder = async () => {
  let { cashAddr, slpAddr, keypair } = await createKeyPair(mnemonicWords, 0);
  let tokenBalances = await bchjs.SLP.Utils.balancesForToken(TOKENID)
    .then((res) => {
      return res.filter((balanceOutput) => {
        return balanceOutput.slpAddress === slpAddr;
      });
    });
  await console.log(tokenBalances);
  // console.log(slpAddr);
}

validateTokenHolder();