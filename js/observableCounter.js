function ObservableCounter(initVal) {
    this.value = initVal || 0;
    this.observers = [];

    this.onChange = function (callback) {
        this.observers.push(callback);
        return this.observers.indexOf(callback);
    };

    this.unsubscribe = function (id) {
        return !!this.observers.slice(id, 1);
    };

    this.increment = function () {
        this.value++;
        for (var i in this.observers) {
            this.observers[i].call(this,this.value);
        }
    }
}