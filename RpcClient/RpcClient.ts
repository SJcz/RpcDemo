import { IModuleIntroduce, IPromiseReturn } from './lib/Define';
import { promiseRequest } from './lib/Util';
import { ClientProxy } from './proxy';

export class RpcClient {
    private rpcModuleMap: { [moduleName: string]: IModuleIntroduce } = {};
    private static instance: RpcClient | null = null;
    private isInitializing = false;
    private rpcServerUrl = '';
    public rpc: RpcModule = {};
    constructor() {
        // 无论是使用 getInstance 还是 new 创建，保证都是同一个对象
        if (!RpcClient.instance) {
            RpcClient.instance = this;
        }
        return RpcClient.instance;
    }

    static getInstance(): RpcClient {
        if (!RpcClient.instance) {
            RpcClient.instance = new RpcClient();
        }
        return RpcClient.instance;
    }

    initClient (url: string): RpcClient {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        this.rpc = {};
        this.isInitializing = true;
        if (!url) {
            this.isInitializing = false;
            throw new Error('RpcClient: You must provide a rpc server url!!!');
        }
        this.rpcServerUrl = url;
        promiseRequest({
            url: this.rpcServerUrl + '/RpcServer/GetAllRpcMethod',
            method: 'POST'
        }).then((result: IPromiseReturn) => {
            this.isInitializing = false;
            if (result.statusCode !== 200) {
                console.error(`RpcClient: Can not get correct respose from RpcServer: ${self.rpcServerUrl} when reqeust module-method-list`);
                return;
            } else {
                self.rpcModuleMap = result.data;
                self.initProxy();
                console.log(`RpcClient: Get rpc module-method-list success: ${JSON.stringify(result.data)}`);
            }
        }).catch(this.errorHandler);
        return this;
    }

    initProxy(): RpcClient {
        for (let mod in this.rpcModuleMap) {
            for (let method of this.rpcModuleMap[mod].methodList) {
                ClientProxy.genProxy(this, mod, method);
            }
        }
        return this;
    }

    rpcFunction (moduleName: string, method: string, ...params: any): Promise<IPromiseReturn> {
        if(this.isInitializing) {
            throw new Error('RpcClient: RpcClient is initializing.');
        }
        if (!this.rpcModuleMap[moduleName]) {
            throw new Error(`RpcClient: RpcServer not provide module: ${moduleName}, please comfrim RpcClient initialize success or RpcServer own this module`);
        }
        if (Object.prototype.toString.call(this.rpcModuleMap[moduleName].methodList) !== '[object Array]') {
            throw new Error(`RpcClient: methodList of module ${moduleName} by RpcServer is not an array!!!`);
        }
        if (this.rpcModuleMap[moduleName].methodList.indexOf(method) === -1) {
            throw new Error(`RpcClient: module ${moduleName} no such function: ${method}`);
        }
        return promiseRequest({
            url: `${this.rpcServerUrl}/${moduleName}/${method}`,
            method: 'POST',
            json: true,
            headers: {
                'content-type': 'application/json',
            },
            body: params
        });
    }

    private errorHandler (e: Error): void {
        this.isInitializing = false;
        console.warn('RpcClient: initialize RpcClient rpcModuleMap failed.');
        console.error(e.stack);
    }
}
