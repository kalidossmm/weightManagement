var EventEmitter = require('events');
var util = require('util');

function CredentialsLoadedEvent() {
    EventEmitter.call(this);
}
util.inherits(CredentialsLoadedEvent, EventEmitter);

module.exports = new CredentialsLoadedEvent();
