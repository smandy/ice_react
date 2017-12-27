//var React = require('react');
//var ReactDOM = require('react-dom');


var id = new Ice.InitializationData();
id.properties = Ice.createProperties();
id.properties.setProperty("Ice.Default.Locator", "IceGrid/Locator:ws -h ritz -p 4063");

var communicator = Ice.initialize([], id);
console.log("Communicator is " + communicator);
var proxies = ["foo@SimpleApp", "foo@SimpleJavaApp", "foo@SimpleCppApp"];

var retVal;

proxies.forEach( function (x) {
    var proxy = communicator.stringToProxy(x).ice_timeout(5000);
    var x2 = argo.FooPrx.checkedCast(proxy).then(
    function(prx) {
        //console.log("Called with x " + prx );
        prx.doit().then(
            function (ret) {
                retVal = ret;
                console.log("Ret is " + ret + " from " + x);
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



class Foo extends React.Component {
    constructor() {
        super();
    };

    componentDidMount() {
        this.setState([]);
    };

    render() {
        const str = communicator.toString();

        return (
            <h1>Hello from react</h1>,
            <h2>communicator is {str}</h2>
        );
    };
};

ReactDOM.render( <Foo/>,  document.getElementById("content"));
