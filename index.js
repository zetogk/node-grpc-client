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

        const proto = grpc.loadPackageDefinition(this.packageDefinition)[packageName];

        const listMethods = this.packageDefinition[`${packageName}.${service}`];

        this.client = new proto[service](host, grpc.credentials.createInsecure());

        this.listNameMethods = [];

        for (const key in listMethods) {

            const methodName = listMethods[key].originalName;
            this.listNameMethods.push(methodName);

        }

    }

    runService(fnName, data, fnAnswer) {

        this.client[fnName](data, fnAnswer);

    }

    listMethods() {

        return this.listNameMethods;

    }

} // End GRPCClient

module.exports = GRPCClient;
