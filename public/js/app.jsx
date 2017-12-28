var id = new Ice.InitializationData();
id.properties = Ice.createProperties();
id.properties.setProperty("Ice.Default.Locator", "IceGrid/Locator:ws -h ritz -p 4063");

var communicator = Ice.initialize([], id);
console.log("Communicator is " + communicator);
var proxies = ["foo@SimpleApp", "foo@SimpleJavaApp", "foo@SimpleCppApp"];

class Foo extends React.Component {
    constructor() {
        super();
    };

    state = {
        responses : []
    };

    componentDidMount() {
        const outer = this;
        proxies.forEach( function (x) {
            var proxy = communicator.stringToProxy(x).ice_timeout(5000);
            var x2 = argo.FooPrx.checkedCast(proxy).then(
                function(prx) {
                    prx.doit().then(
                        function (ret) {
                            outer.setState( { responses :
                                              outer.state.responses.concat( {
                                                  response: ret,
                                                  uid: uuid.v4()
                                              }) });
                        },
                        function (ex) {
                            console.log(ex);
                        }
                    );
                },
                function(ex) {
                    console.log("Called with exception " + ex);
                } );
        });
    };

    render() {
        const str = communicator.toString();
        const responses = this.state.responses.map( x => {
            return (  <p key={x.uid}>response is {x.response}</p> );
        } );
        return (
            <h1>Hello from react</h1>,
            <div>
              {responses}
            </div>
        );
    };
};

class MyListener extends argo.TickListener {
    state = {
        listeners: []
    };

    addListener(listener) {
        this.state.listeners.concat(listener);
    };
    
    onImage( img, current) {
        this.state.listeners.forEach( x => x.onImage(img, current));
        // if (img.lenth>0) {
        //     img[0].forEach( function( tick, idx, _) {
        //         data[idx] = tick;
        //         grid.invalidateRow(idx);
        //     });
        // };
    };
    
    onTick(ticks, current) {
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

class DataGrid extends React.Component {
    state = {
        data: []
    };

    componentDidMount() {
        this.props.source.addListener(this);
    };
    
    onTick(ticks, current) {
        let newData = this.state.data.slice();
        for (i = 0;i<ticks.length;i++) {
            newData[i] = ticks[i];
            //grid.invalidateRow(i);
        }
        this.setState( { data: newData });
    };

    onImage(img, current) {
        let newData = [];
        if (img.length>0) {
            img[0].forEach( function(tick, idx, _) {
                newData[idx] = tick;
            });
            this.setState( { data: newData});
        }
    };

    render() {
        const rows = this.state.data.map( x => {
            return (<tr><td>{x.symbol}</td><td>{x.bidPx}</td><td>{x.askPx}</td></tr>);
        });
        
        return (
            <table>{rows}</table>
        );
    };
}

var proxy = communicator.stringToProxy("plant:ws -h ritz -p 10666 -t 2000").ice_twoway();

var tl = new MyListener();

argo.TickerPlantPrx.checkedCast(proxy).then(
    function(prx) {
        setInterval( function() {
            prx.sayHello().then( function (s) {
                //console.log("hello returned " + s );
                $("#greeting").html( "<H1>" + "Got " + s + "</H1>" );
            } );
        } , 2000);
        
        return communicator.createObjectAdapter("").then(
            function(adapter) {
                var r = adapter.addWithUUID();
                proxy.ice_getCachedConnection().setAdapter(adapter);
                var x3 = prx.subscribeWithIdent(r.ice_getIdentity());
            }
        );
    },
    function(ex) {
        console.log("Called with exception " + ex);
    } );

ReactDOM.render( <Foo/>,  document.getElementById("content"));
    
ReactDOM.render( <DataGrid source={tl}/>,  document.getElementById("grid"));


