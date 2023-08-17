const express = require('express');
const request = require('request');
const Blockchain = require('./blockchain');
const bodyparser = require('body-parser');
const PubSub = require('./publishsubscribe');
const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({blockchain});

setTimeout(()=>pubsub.broadCast(),1000);

app.use(bodyparser.json());
app.get('/api/blocks',(req,res)=>{
    res.json(blockchain.chain);
})

const DEFAULT_PORT= 3000;

//ROOT_NODE address
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

//we get data in json format but express can not directly receive json format data so we use middleware i.e. body-parser
app.post('/api/mine',(req,res)=>{
    const {data} = req.body;
    blockchain.addBlock({data});
    pubsub.broadCast();
    res.redirect('/api/blocks');
})

//whenever any new node join the blockchain then in data the node gets only the details of genesis block
// and not any other block details so we are creating a sync function so that the new node gets details of all 
// blocks in blockchain
const syncchain = () =>{
    request({url:`${ROOT_NODE_ADDRESS}/api/blocks`},(error,response,body)=>{
        if(!error && response.statusCode===200){
            const rootChain = JSON.parse(body);
            console.log("Replace chain with sync",rootChain);
            blockchain.replaceChain(rootChain);
        }
    })
}

//since in blockchain there are large number of nodes so we have to generate random port for every node

let PEER_PORT;

if(process.env.GENERATE_PEER_PORT==='true'){
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random()*1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT,()=>{
    console.log(`Server started at PORT ${PORT}`);
    syncchain(); 
});