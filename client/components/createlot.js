Template.createLot.events({
    "click #zapilit": function() {

        var d = $('#lotds').val();
        var m = parseInt($('#minprice').val());
        var b = parseInt($('#buyout').val());
        var l = parseInt($('#lastBlock').val());

        if (m > b) {
            alert("Buy out < starting price. U r mad?");
            $('#lotds').val("");
            $('#minprice').val("");
            $('#buyout').val("");
            $('#lastBlock').val("");
            return;
        }
        console.log(d,m,b,l);
        smci.AddLot(d, m, b, l, {
            gas: 300000,
            from: coinbase,
            value: web3.toWei(m, 'finney')
        }, (err, result) => {
            if (result) {
                console.log("Tx hash: ", result);
                
            } else {
                console.log("Oopss.. Didn't work :(");
            }
        });

        $('#lotds').val("");
        $('#minprice').val("");
        $('#buyout').val("");
        $('#lastBlock').val("");
        

    }
});
