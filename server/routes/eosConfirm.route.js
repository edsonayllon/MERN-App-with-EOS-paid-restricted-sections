const express = require('express');
const router = express.Router();
const { JsonRpc, RpcError } = require('eosjs');
const fetch = require('node-fetch');
const rpc = new JsonRpc('http://localhost:8888', { fetch });
const userService = require('../services/user.service');

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

const checkUnlock = async (req) => {
  console.log(req)
  const account_name = req.body.account.name;
  try {
    const resp = await rpc.history_get_transaction(
      req.body.trx.id,
      req.body.trx.block_num
    );
    const data = resp.trx.trx.actions[0].data;
    const trx_status = resp.trx.receipt.status;
    if (data.from === account_name
      && data.to === 'james'
      && data.quantity === '1.0000 EOS'
      && trx_status === 'executed')
    {
      userService.unlockRestricted(req._id);
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log('\nCaught exception: ' + e);
    if (e instanceof RpcError) console.log(JSON.stringify(e.json, null, 2));
    return false;
  }
}

router.post('/', async (req, res, next) => {
  var unlocked = await checkUnlock(req);
  if (unlocked) return res.status(200).json({ message: 'successful' });
  await wait(1000*60);
  unlocked = await checkUnlock(req);
  if (unlocked) return res.status(200).json({ message: 'successful' });
  else res.status(401).json({ message: 'unsuccessful' });
});

module.exports = router;
