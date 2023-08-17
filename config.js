const MINT_RATE = 1000;//1000 sec or 1msec

const INITIAL_DIFFICULTY = 2;

const Genesis_Data = {
    timestamp:1,
    prev_hash:'0x00',
    hash:"0x32",
    data:[],
    nonce:0,
    difficulty:INITIAL_DIFFICULTY,
}

module.exports = {Genesis_Data,MINT_RATE}