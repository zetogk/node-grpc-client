# node-grpc-client
Simple gRPC client on NodeJS v1.2.0

## Methods

* `runService('TaskName', dataToSend, callback);`
* `listMethods();`

### Dynamic methods

The dynamic methods are the methods of the GRPC, then, its depends of your definition on your proto file.

* Example dynamic async (using callbacks) method: `task1Async(data, callback);`.
* Example dynamic sync (using promises) method: `await task2Sync(data);`.

---

## How to use it

### example.proto file

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
    rpc Task1 (ExampleRequest) returns (ExampleResponse);
    rpc Task2 (ExampleRequest) returns (ExampleResponse);
}
```

Where

* The name of the package is **packageservice**.
* The name of the service is **Theservice**.
* The name of the methods are **Task1** and **Task2**.

### Load client
``` bash

const GRPCClient = require('node-grpc-client');

const myClient = new GRPCClient(<protoPath>, <packageName>, <serviceName>, <url>);

```

### Full example using runService method
``` bash

const path = require('path');
const PROTO_PATH = path.resolve(__dirname, '../example.proto');

const GRPCClient = require('node-grpc-client');

const myClient = new GRPCClient(PROTO_PATH, 'packageservice', 'Theservice', 'localhost:3000');

const dataToSend = {
    id: 'abc123',
    text: 'Hello world'
};

myClient.runService('Task1', dataToSend, (err, res) => {

    console.log('Service response ', res);

});

```

### Full example using dynamic async (using callbacks) methods
``` bash

const path = require('path');
const PROTO_PATH = path.resolve(__dirname, '../example.proto');

const GRPCClient = require('node-grpc-client');

const myClient = new GRPCClient(PROTO_PATH, 'packageservice', 'Theservice', 'localhost:3000');

const dataToSend = {
    id: 'abc123',
    text: 'Hello world'
};

myClient.task1Async(dataToSend, (err, res) => {

    console.log('Service response ', res);

});

```

### Full example using dynamic sync (using promises) methods
``` bash

const path = require('path');
const PROTO_PATH = path.resolve(__dirname, '../example.proto');

const GRPCClient = require('node-grpc-client');

const myClient = new GRPCClient(PROTO_PATH, 'packageservice', 'Theservice', 'localhost:3000');

const dataToSend = {
    id: 'abc123',
    text: 'Hello world'
};

(async function () {

    const response1 = await myClient.task1Sync(dataToSend);
    console.log('The answer of request 1: ', response1);
    const response2 = await myClient.task2Sync(dataToSend);
    console.log('The answer of request 2: ', response2);

})();

```

## Authors
zetogk <zetogk@gmail.com>
