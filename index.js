const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

class GRPCClient {

    constructor(protoPath, packageName, service, host) {

        this.packageDefinition = protoLoader.loadSync(protoPath, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        });

        this.proto = grpc.loadPackageDefinition(this.packageDefinition)[packageName];

        this.client = new this.proto[service](host, grpc.credentials.createInsecure());

    }

    runService(fnName, data, fnAnswer) {

        this.client[fnName](data, fnAnswer);

    }

} // End GRPCClient

module.exports = GRPCClient;