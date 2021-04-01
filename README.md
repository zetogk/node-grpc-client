# node-grpc-client
Simple gRPC client on NodeJS v1.5.0

### * New feature in 1.5.0
Send `metadata` is supported.

### * Important fix was solved in verison 1.4.0.
Now are supported packages which have *dots* or style of *inverse DNS* like: `com.github.nodegrpcclient`.

## Methods

* `runService('TaskName', dataToSend, callback, options);`
* `listMethods();`

### Dynamic methods

The dynamic methods are the methods of the GRPC, then, its depends of your definition on your proto file.

* Example dynamic async (using callbacks) method: `task1Async(data, callback, options);`.
* Example dynamic sync (using promises) method: `await task2Sync(data, options);`.
* Example dynamic stream method: `task3Stream(data, options).on('data', callback);`

&nbsp;

---
&nbsp;

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

// options is optional and is supported from version 1.5.0
const options = {
    metadata: {
        hello: 'world'
    }
};

myClient.runService('Task1', dataToSend, (err, res) => {

    console.log('Service response ', res);

}, options);

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

// options is optional and is supported from version 1.5.0
const options = {
    metadata: {
        hello: 'world'
    }
};

myClient.task1Async(dataToSend, (err, res) => {

    console.log('Service response ', res);

}, options);

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

// options is optional and is supported from version 1.5.0
const options = {
    metadata: {
        hello: 'world'
    }
};

(async function () {

    const response1 = await myClient.task1Sync(dataToSend, options);
    console.log('The answer of request 1: ', response1);
    const response2 = await myClient.task2Sync(dataToSend);
    console.log('The answer of request 2: ', response2);

})();

```
&nbsp;

---
&nbsp;

## Streaming gRPC

Some gRPC methods return a [stream](https://grpc.io/docs/tutorials/basic/node.html#streaming-rpcs). This allows subscription-based push communication between the server and the client, where the server can push data to the client.

You can use the dynamic stream method for this. For example, if the server has a gRPC method Task3 that returns a stream:

```bash

// options is optional and is supported from version 1.5.0
const options = {
    metadata: {
        hello: 'world'
    }
};

const stream = myClient.task3Stream(dataToSend, options);
stream.on('data', (data) => console.log(data));

```
&nbsp;

---
&nbsp;
## Options

*Options* is a feature added in version 1.5.0.

* Currently support the property **metadata**.
* Is optional, you can or can not send it like parameters in the methods.
* In case is not passed like a parameter, its default value is `{}`;

### metadata

**metadata** is a property added to *options* in version 1.5.0.

* This property has to be an object *(key, value)*.
* The values in most have to be a *string*. Just in case that the key ends with *-bin*, the values have to be a *Buffer*.
Example: 
```
const options = {
    metadata: {
        myheader: 'testing metadata', //string
        myheader2: '2', // string
        'myheader-bin': myBuffer // buffer
    }
}
```

&nbsp;

---
&nbsp;

## Authors
* zetogk <zetogk@gmail.com> - [GitHub profile](https://github.com/zetogk)

### Contributors
* netsaj <fabiomoreno@outlook.com> - [GitHub profile](https://github.com/netsaj)
* jwulf [GitHub profile](https://github.com/jwulf)
* stivenson <stivenson.rpm@gmail.com> - [GitHub profile](https://github.com/stivenson)