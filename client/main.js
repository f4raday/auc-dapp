
// disconnect any meteor server
if (location.host !== 'localhost:3000' 
    && location.host !== '127.0.0.1:3000' 
    && typeof MochaWeb === 'undefined')
    Meteor.disconnect();

if(Meteor.isClient) {
            
    Session.setDefault('latestBlock', 0);
    Router.go('/current');

    Meteor.startup(function() {
        
        LotsCollection.remove( { } );
        EthAccounts.init();
        coinbase = EthAccounts.findOne({name: 'Main account (Etherbase)'}).address;
        console.log(coinbase);
        
    });

    Template.body.events({
        "click #foreload": function () {
            document.location.reload(true);
        }
    });
}