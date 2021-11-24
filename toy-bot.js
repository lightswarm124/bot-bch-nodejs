const BCHJS = require("@psf/bch-js");
let bchjs = new BCHJS();

const SEC = 1000;

async function latestBlockInfo() {
  try {
    let getBestBlockHash = await bchjs.Blockchain.getBestBlockHash()
      .then(async (hash) => {
        let data = await bchjs.Blockchain.getBlock(hash);
        delete data.tx;
        delete data.confirmations;
        return data;
      }).catch(err =>{
        return err
      });
    let time = new Date();
    console.log(time.getDate(), '/', time.getMonth(), '/', time.getFullYear(), '-', time.getHours(), ":", time.getMinutes(), ':', time.getSeconds(), '    BCH/USD - $', await bchjs.Price.getBchUsd());
    console.log(getBestBlockHash);
  } catch (err) {
    console.log(err);
  }
}

async function run() {
  console.clear();
  await latestBlockInfo();
  let runApp = setInterval(async () => {
    console.clear();
    await latestBlockInfo();
  }, 60 * SEC);
}

run();