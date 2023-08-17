const {Genesis_Data, MINT_RATE} = require('./config')
const cryptohash = require('./crypto_hash')
const hextobinary = require('hex-to-binary')
class block{
    constructor({timestamp,prev_hash,hash,data,nonce,difficulty}){
        this.timestamp = timestamp;
        this.prev_hash = prev_hash;
        this.hash = hash;
        this.data = data;
        this.nonce=nonce;
        this.difficulty=difficulty;
    }

    //we do not want to create genesis function for every block so we static
    static genesis(){
        return new this(Genesis_Data);
    }

    static mineblock({prevBlock,data}){
        let hash,timestamp;
        const prev_hash = prevBlock.hash;
        // console.log("mineblock",prev_hash);
        let nonce=0;
        let {difficulty} = prevBlock;
        
        do{
            nonce++;
            timestamp=Date.now();
            difficulty = block.adjustDifficulty({originalBlock:prevBlock,timestamp});
            hash = cryptohash(timestamp,data,prev_hash,nonce,difficulty);
        }while(hextobinary(hash) .substring(0,difficulty) !== '0'.repeat(difficulty));//'0'.repeat(difficulty) means that in our hash from 0 to difficulty should be 0
        
        return new this({
           timestamp,
           prev_hash,
           hash,
           data,
           nonce,
           difficulty,
        })
    }

    static adjustDifficulty({originalBlock,timestamp}){
        const {difficulty} = originalBlock;
        if(difficulty < 1){
            return 1;
        }
        const difference = timestamp - originalBlock.timestamp;
        if(difference < MINT_RATE){
            return difficulty+1;
        }
        else if(difference>MINT_RATE){
            return difficulty-1;
        }
    }
}

const block1 = new block({
    timestamp:'2/09/2022',
    prev_hash:'0xac',
    hash:'0x12',
    data:"hello"
});
// console.log(block1);
// const genesis_block = block.genesis();
// console.log(genesis_block);

// const result = block.mineblock({prevBlock:block1,data:"block1"});
// console.log(result);

module.exports = block;