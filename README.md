# node-grpc-client
Simple gRPC client on NodeJS

# Example

## example.proto file

``` bash
syntax = "proto3";

package packageservice;

message ExampleRequest {
    string id = 1;
    string text = 2;
}

message ExampleResponse {
    int32 send = 1;
    string message = 2;
}

service Theservice {
    rpc RunTask (ExampleRequest) returns (ExampleResponse);
}
```

Where

* The name of the package is **packageservice**.
* The name of the service is **Theservice**.
* The name of the function is **RunTask**.

## How to use it

### Load client
``` bash

const RGPCClient = require('node-grpc-client');

const myClient = new RGPCClient(<protoPath>, <packageName>, <serviceName>, <url>);

```

### Full example
``` bash

const path = require('path');
const PROTO_PATH = path.resolve(__dirname, '../example.proto');

const RGPCClient = require('node-grpc-client');

const myClient = new RGPCClient(PROTO_PATH, 'packageservice', 'Theservice', 'localhost:3000');

const dataToSend = {
    id: 'abc123',
    text: 'Hello world'
};

myClient.runService('RunTask', dataToSend, (err, res) => {

    console.log('Service response ', res);

});

```