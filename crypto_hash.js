const crypto = require('crypto');

const cryptohash=(...inputs)=>{
    const hash=crypto.createHash('sha256');
    hash.update(inputs.sort().join(''));
    return hash.digest('hex');//convert hexadecimal to binary as using binary gives more ways to increase the difficulty
}

const result = cryptohash("hello","world");
// console.log(result);

module.exports=cryptohash;