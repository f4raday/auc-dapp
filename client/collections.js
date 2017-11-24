// use {connection: null} to prevent them from syncing with our not existing Meteor server

LotsCollection = new Mongo.Collection('dblots', {connection: null});
new PersistentMinimongo(LotsCollection);
