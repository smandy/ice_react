// Need to define this in a separate file that doesn't get passed through babel.
// Defining this class inside app.jsx doesn't work :-(

class MyListener extends argo.TickListener {
    constructor() {
        super();
        this.listeners = [];
    };

    addListener(listener) {
        this.listeners = this.listeners.concat(listener);
    };
    
    onImage( img, current) {
        this.listeners.forEach( x => x.onImage(img, current));
    };
    
    onTick(ticks, current) {
        this.listeners.forEach( x => x.onTick(ticks,current));
    };
}
