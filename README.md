# node-grpc-client
Simple gRPC client on NodeJS v1.4.0

### Important fix was solved in verison 1.4.0
Now are supported packages which have *dots* or style of *inverse DNS* like: `com.github.nodegrpcclient`.

## Methods

* `runService('TaskName', dataToSend, callback);`
* `listMethods();`

### Dynamic methods

The dynamic methods are the methods of the GRPC, then, its depends of your definition on your proto file.

* Example dynamic async (using callbacks) method: `task1Async(data, callback);`.
* Example dynamic sync (using promises) method: `await task2Sync(data);`.
* Example dynamic stream method: `task3Stream(data).on('data', callback);`

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

## Streaming gRPC

Some gRPC methods return a [stream](https://grpc.io/docs/tutorials/basic/node.html#streaming-rpcs). This allows subscription-based push communication between the server and the client, where the server can push data to the client.

You can use the dynamic stream method for this. For example, if the server has a gRPC method Task3 that returns a stream:

```bash

const stream = myClient.task3Stream(dataToSend);
stream.on('data', (data) => console.log(data));

```

## Authors
* zetogk <zetogk@gmail.com> - [GitHub profile](https://github.com/zetogk)

### Contributors
* netsaj <fabiomoreno@outlook.com> - [GitHub profile](https://github.com/netsaj)
* jwulf [GitHub profile](https://github.com/jwulf)
