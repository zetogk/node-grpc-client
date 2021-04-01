const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

class GRPCClient {

    constructor(protoPath, packageName, service, host, options = {}) {

        this.packageDefinition = protoLoader.loadSync(protoPath, {
            keepCase: (options.keepCase === undefined) ? true : options.keepCase,
            longs: (options.longs === undefined) ? String : options.longs,
            enums: (options.enums === undefined) ? String : options.enums,
            defaults: (options.default === undefined) ? true : options.default,
            oneofs: (options.default === undefined) ? true : options.default
        });

        const proto = ((packageName) => {

            const packagePath = packageName.split('.');
            let proto = grpc.loadPackageDefinition(this.packageDefinition);

            for (let $i = 0; $i <= packagePath.length - 1; $i++) {

                proto = proto[packagePath[$i]];

            }

            return proto;

        })(packageName);

        const listMethods = this.packageDefinition[`${packageName}.${service}`];

        this.client = new proto[service](host, grpc.credentials.createInsecure());

        this.listNameMethods = [];

        for (const key in listMethods) {

            const methodName = listMethods[key].originalName;
            this.listNameMethods.push(methodName);

            this[`${methodName}Async`] = (data, fnAnswer, options = {}) => {

                let metadataGrpc = {};

                if (('metadata' in options) && (typeof options.metadata == 'object')) {

                    metadataGrpc = this.generateMetadata(options.metadata)

                }
                this.client[methodName](data, metadataGrpc, fnAnswer);

            }

            this[`${methodName}Stream`] = (data, options = {}) => {

                let metadataGrpc = {};

                if (('metadata' in options) && (typeof options.metadata == 'object')) {

                    metadataGrpc = this.generateMetadata(options.metadata)

                }

                return this.client[methodName](data, metadataGrpc)

            }

            this[`${methodName}Sync`] = (data, options = {}) => {

                let metadataGrpc = {};

                if (('metadata' in options) && (typeof options.metadata == 'object')) {

                    metadataGrpc = this.generateMetadata(options.metadata)

                }

                const client = this.client;

                return new Promise(function (resolve, reject) {
                    client[methodName](data, metadataGrpc, (err, dat) => {

                        if (err) {
                            return reject(err);
                        }

                        resolve(dat);

                    });

                })

            }

        }

    }

    generateMetadata = (metadata) => {

        let metadataGrpc = new grpc.Metadata();

        for (let [key, val] of Object.entries(metadata)) {

            metadataGrpc.add(key, val);

        }

        return metadataGrpc

    };

    runService(fnName, data, fnAnswer, options = {}) {

        let metadataGrpc = {};

        if (('metadata' in options) && (typeof options.metadata == 'object')) {

            metadataGrpc = this.generateMetadata(options.metadata)

        }

        this.client[fnName](data, metadataGrpc, fnAnswer);

    }

    listMethods() {

        return this.listNameMethods;

    }

} // End GRPCClient

module.exports = GRPCClient;
