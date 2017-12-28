class MyListener extends argo.TickListener {
    constructor() {
        super();
        this.state = {
            listeners : []
        };
    };

    addListener(listener) {
        //console.log("mylistener addlistener");
        this.state.listeners = this.state.listeners.concat(listener);
    };
    
    onImage( img, current) {
        //console.log("Listener got image " + this.state.listeners.length);
        this.state.listeners.forEach( x => x.onImage(img, current));
        // if (img.lenth>0) {
        //     img[0].forEach( function( tick, idx, _) {
        //         data[idx] = tick;
        //         grid.invalidateRow(idx);
        //   ne});
        // };
    };
    
    onTick(ticks, current) {
        //console.log("Listner got tick " + this.state.listeners.length);
        this.state.listeners.forEach( x => x.onTick(ticks,current));
        //$("#symbol").html("<pre>" + ticks[0]['symbol'] + "</pre>");
        //$("#bid").html("<pre>" + ticks[0]['bidPx'] + "</pre>");
        //$("#ask").html("<pre>" + ticks[0]['askPx'] + "</pre>");
        // for (i = 0;i<ticks.length;i++) {
        //     data[i] = ticks[i];
        //     grid.invalidateRow(i);
        // }
        // grid.render();
    };
}
