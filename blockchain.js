const Block = require('./Block');
const  cryptohash  = require('./crypto_hash');

class Blockchain{
    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock({data}){
        // console.log("blockchain",this.chain[this.chain.length-1]);
        const newblock = Block.mineblock({
            prevBlock:this.chain[this.chain.length-1],
            data:data
        })
        this.chain.push(newblock);
        // console.log("newblock",newblock);
    }

    // helps in checking  the longest chain
    replaceChain(chain){ 
        if(chain.length <= this.chain.length){
            console.error("The chain is not the longest chain");
            return;
        }
        if(!Blockchain.isValid(chain)){
            console.error("The incoming chain is not valid");
            return;
        }
        this.chain = chain;
    }

    static isValid(chain){
        if(JSON.stringify(chain[0])!==JSON.stringify(Block.genesis())){//since we can not compare two object i.e. chain[0] and Block.genesis();
            // console.log("failed at genesis block");
            return false;
        }
        for(let i=1;i<chain.length;i++){
            const {timestamp,prev_hash,hash,data,nonce,difficulty} = chain[i];
            const reallastHash = chain[i-1].hash;
            const lastdifficulty = chain[i-1].difficulty;
            // console.log("reallastHash",reallastHash);
            // console.log("prevhash",prev_hash);
            if(prev_hash !== reallastHash){
                // console.log("failed at prev Hash");
                return false;
            }
            const validatedHash = cryptohash(timestamp,prev_hash,data,nonce,difficulty);
            if(hash !== validatedHash){
                // console.log("failed at validating");
                return false;
            }
            if(Math.abs(lastdifficulty - difficulty) > 1){
                return false;
            }
        }
        return true;
    }
}

const blockchain =  new Blockchain();
blockchain.addBlock({data:"Hello"});
blockchain.addBlock({data:"World"});
console.log(blockchain);
const result = Blockchain.isValid(blockchain.chain);
// console.log(result);
console.log(blockchain.chain);
module.exports = Blockchain;
