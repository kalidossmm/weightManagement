var EventEmitter = require('events');
var util = require('util');

function ServerStartUpEvent() {
    EventEmitter.call(this);
}
util.inherits(ServerStartUpEvent, EventEmitter);

module.exports = new ServerStartUpEvent();
