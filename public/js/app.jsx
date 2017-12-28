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

ReactDOM.render( <Foo/>,  document.getElementById("content"));
