
// disconnect any meteor server
// if (location.host !== 'localhost:3000' 
//     && location.host !== '127.0.0.1:3000' 
//     && typeof MochaWeb === 'undefined')
//     Meteor.disconnect();



function getNumberOfLots(callback) {
    smci.GetLotsCount((err, result) => {
        if (result != null) {
            callback(result);
        } else {
            console.warn("Smth bad happened!");
        }
    });
}

function fillTable(n) {
    for (var j = 0; j<n; j++) {
        smci.GetLot(j, (err, result) => {
            if(result != null) {
                LotsCollection.insert({
                    id: result[0].c[0],
                    holder: result[1],
                    leader: result[2],
                    description: web3.toUtf8(result[3]),
                    price: result[4].c[0], 
                    buyOutPrice: result[5].c[0], 
                    isOpened: result[6] ? "Yes" : "No",
                    canWithdraw: !result[6],
                    timeLeft: result[6] ? moment().startOf('day')
    .seconds(result[7].c[0])
    .format('H:mm:ss') : (!result[8] ? "finished, waiting for withdraw" : "withdrawn"),
                    withdrawn: result[8]
                });
            } 
        });
    }
}
    


if(Meteor.isClient) {
            
    Session.setDefault('latestBlock', 0);

    Template.body.events({
        "click #updatetable": function () {
            LotsCollection.remove({});
            getNumberOfLots(fillTable);
    }

    });
}