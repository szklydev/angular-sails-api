function io (){
    var mockSocketObject = createMockSocketObject();
    return mockSocketObject.connect();
}

function createMockSocketObject () {

    var socket = {
        on: function (ev, fn) {
            (this._listeners[ev] = this._listeners[ev] || []).push(fn);
        },
        once: function (ev, fn) {
            (this._raw._listeners[ev] = this._raw._listeners[ev] || []).push(fn);
            fn._once = true;
        },
        emit: function (ev, data) {
            if (this._listeners[ev]) {
                var args = arguments;
                this._listeners[ev].forEach(function (listener) {
                    if (listener._once) {
                        this.removeListener(ev, listener);
                    }
                    listener.apply(null, Array.prototype.slice.call(args, 1));
                },this);
            }
        },
        _listeners: {},
        removeListener: function (ev, fn) {
            if (fn) {
                var index = this._listeners[ev].indexOf(fn);
                if (index > -1) {
                    this._listeners[ev].splice(index, 1);
                }
            } else {
                delete this._listeners[ev];
            }
        },
        removeAllListeners: function (ev) {
            if (ev) {
                delete this._listeners[ev];
            } else {
                this._listeners = {};
            }
        },
        disconnect: function () {
            this.connected = false;
            this.emit('disconnect');
        },
        connect: function () {
            this.connected = true;
            this.emit('connect');
            return this;
        }
    };

    return socket;
}
