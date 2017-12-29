var id = new Ice.InitializationData();
id.properties = Ice.createProperties();
id.properties.setProperty("Ice.Default.Locator", "IceGrid/Locator:ws -h ritz -p 4063");

var communicator = Ice.initialize([], id);
//console.log("Communicator is " + communicator);
var proxies = ["foo@SimpleApp", "foo@SimpleJavaApp", "foo@SimpleCppApp"];

var tl = new MyListener();

class Foo extends React.Component {
    constructor() {
        super();
    };

    state = {
        responses : []
    };

    componentDidMount() {
        const outer = this;
        proxies.forEach( p => {
            var proxy = communicator.stringToProxy(p).ice_timeout(5000);
            argo.FooPrx.checkedCast(proxy)
                .then( prx => prx.doit() )
                .then( ret => outer.setState( { responses :
                                                outer.state.responses.concat( {
                                                    response: ret,
                                                    uid: uuid.v4()
                                                }) }) )
                .catch( err => alert(err) );
        } );
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

// TODO - tidy up the relationship. Have ticklistener cache image
// maybe have it emit state events that can be added to the react component's state
// Has to be a better way of doing it than this!
class DataGrid extends React.Component {
    state = {
        data: []
    };

    componentDidMount() {
        //console.log("Datagrid mount");
        this.props.source.addListener(this);
    };
    
    onTick(ticks, current) {
        //console.log("onTick");
        let newData = this.state.data.slice();
        ticks.forEach( (tick, i) => {
            ticks[i].key = "" + i;
            newData[i] = ticks[i];
            //console.log(ticks[i]);
            //grid.invalidateRow(i);
        } );
        this.setState( { data: newData });
    };

    onImage(img, current) {
        //console.log("onImage");
        let newData = [];
        if (img.length>0) {
            img[0].forEach( (tick, idx) => {
                tick.key= "" + idx;
                newData[idx] = tick;
            });
            this.setState( { data: newData});
        }
    };

    render() {
        const rows = this.state.data.map( x => {
            return (<tr key={x.key}><td>{x.symbol}</td><td>{x.bidPx}</td><td>{x.askPx}</td></tr>);
        });
        
        return (
            <table border="1"><tbody>{rows}</tbody></table>
        );
    };
};

var proxy = communicator.stringToProxy("plant:ws -h ritz -p 10666 -t 2000").ice_twoway();

argo.TickerPlantPrx.checkedCast(proxy).then(
    function(prx) {
        setInterval( function() {
            prx.sayHello().then( function (s) {
                // console.log("hello returned " + s );
                // TODO - this isn't very reacty. Remove this junit stuff
                $("#greeting").html( "<H1>" + "Got " + s + "</H1>" );
            } );
        } , 2000);
        return communicator.createObjectAdapter("").then(
            function(adapter) {
                var r = adapter.addWithUUID(tl);
                proxy.ice_getCachedConnection().setAdapter(adapter);
                var x3 = prx.subscribeWithIdent(r.ice_getIdentity());
            }
        );
    },
    function(ex) {
        console.log("Called with exception " + ex);
    } );

ReactDOM.render( <Foo/>,  document.getElementById("content"));
ReactDOM.render( <DataGrid source={tl} />,  document.getElementById("mygrid"));

//ReactDOM.render( <DataGrid />,  document.getElementById("mygrid"));


