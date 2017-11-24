if (typeof web3 !== 'undefined'){
    console.log("Using web3 detected from external source like Metamask");
    web3 = new Web3(web3.currentProvider);
} else {
    console.warn("No injected web3 was found! App will not work :(");
}

MyContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"GetLot","outputs":[{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"MakeBid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"description","type":"bytes32"},{"name":"minPrice","type":"uint256"},{"name":"buyOutPrice","type":"uint256"}],"name":"AddLot","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"GetLotsCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"}],"name":"NewLot","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"}],"name":"NewBid","type":"event"}]);
console.log(MyContract);
smci = MyContract.at("0x4FB5a036034eDD126C1432e201688dcAB280c333");
console.log(smci);


web3.eth.filter('latest').watch(function(e, blockHash) {
    if(!e) {
        web3.eth.getBlock(blockHash, function(e, block){
            Session.set('latestBlock', block.number);
        });
    }
});

// // // // read initial lots from contract
smci.GetLotsCount((err, result) => {
    if (result != null) {
        var n = result;
        for (var i = 0; i < n; i++) {
            smci.GetLot(i, (err, result) => {
                if(result != null) {
                    // console.log(result);
                    LotsCollection.insert({
                        id: result[0].c[0],
                        leader: result[2],
                        description: result[3],
                        price: result[4].c[0], 
                        buyOutPrice: result[5].c[0], 
                        isOpened: result[6] ? "Yes" : "No"
                    });
                    
                }
            });
        }
    } else {
        console.warn("Smth bad happened!");
    }
});


// smci.NewLot({},{fromBlock: 2100000, toBlock: 'latest'}).watch(function(error, result){
//     if (!error){
//         var j = result.args.id;
//         //alert(result.args.id, j);
//         smci.GetLot(j, (err, result) => {
//             if(result != null) {
//                 // console.log(result);
//                 LotsCollection.insert({
//                     id: result[0].c[0],
//                     leader: result[2],
//                     description: result[3],
//                     price: result[4].c[0], 
//                     buyOutPrice: result[5].c[0], 
//                     isOpened: result[6] ? "Yes" : "No"
//                 });
//             }
//         });
//     } else {
//         console.log(error);
//     }
// });

