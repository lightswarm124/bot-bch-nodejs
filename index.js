const BCHJS = require("@psf/bch-js");
let bchjs = new BCHJS();

const SEC = 1000;

async function latestBlockInfo() {
  console.clear();
  let runApp = setInterval(async () => {
    try {
      let getBestBlockHash = await bchjs.Blockchain.getBestBlockHash()
        .then(async (hash) => {
          let data = await bchjs.Blockchain.getBlock(hash);
          delete data.tx;
          return data;
        }).catch(err =>{
          return err
        });
      console.log(getBestBlockHash);
    } catch (err) {
      console.log(err);
    }
  }, 60 * SEC);
}

latestBlockInfo();