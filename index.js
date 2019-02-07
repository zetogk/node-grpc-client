const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const { log } = console;

class GRPCClient {

    constructor(protoPath, packageName, service, host, options = {}) {

        this.packageDefinition = protoLoader.loadSync(protoPath, {
            keepCase: (options.keepCase === undefined) ? true : options.keepCase,
            longs: (options.longs === undefined) ? String : options.longs,
            enums: (options.enums === undefined) ? String : options.enums,
            defaults: (options.default === undefined) ? true : options.default,
            oneofs: (options.default === undefined) ? true : options.default
        });

        const proto = grpc.loadPackageDefinition(this.packageDefinition)[packageName];

        const listMethods = this.packageDefinition[`${packageName}.${service}`];

        this.client = new proto[service](host, grpc.credentials.createInsecure());

        this.listNameMethods = [];

        for (const key in listMethods) {

            const methodName = listMethods[key].originalName;
            this.listNameMethods.push(methodName);

            this[`${methodName}Async`] = (data, fnAnswer, options = {}) => {

                if ('metadata' in options) {

                    let meta = new grpc.Metadata();

                    for (let [key, value] of Object.entries(options.metadata)) {
                        meta.add(key, value);
                    }

                    this.client[methodName](data, meta, fnAnswer);

                } else {

                    this.client[methodName](data, fnAnswer);

                }

            }


            this[`${methodName}Stream`] = (data) => {

                if ('metadata' in options) {

                    let meta = new grpc.Metadata();

                    for (let [key, value] of Object.entries(options.metadata)) {
                        meta.add(key, value);
                    }

                    return this.client[methodName](data, meta)

                } else {

                    return this.client[methodName](data);

                }

            }

            this[`${methodName}Sync`] = (data) => {

                const client = this.client;

                return new Promise(function (resolve, reject) {

                    if ('metadata' in options) {

                        let meta = new grpc.Metadata();

                        for (let [key, value] of Object.entries(options.metadata)) {
                            meta.add(key, value);
                        }

                        client[methodName](data, meta, (err, dat) => {

                            if (err) {
                                return reject(err);
                            }

                            resolve(dat);

                        });

                    } else {

                        client[methodName](data, (err, dat) => {

                            if (err) {
                                return reject(err);
                            }

                            resolve(dat);

                        });

                    }

                })

            }

        }

    }

    runService(fnName, data, fnAnswer, metadata = {}) {
        try {

            let meta = new grpc.Metadata();

            for (let [key, value] of Object.entries(metadata)) {
                meta.add(key, value);
            }

            this.client[fnName](data, meta, fnAnswer);

        } catch (e) {

            log(e.message);
            throw e;

        }
    }

    listMethods() {

        return this.listNameMethods;

    }

} // End GRPCClient

module.exports = GRPCClient;
