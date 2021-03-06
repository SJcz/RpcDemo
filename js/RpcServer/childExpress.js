"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Define_1 = require("./lib/Define");
const httpServer_1 = require("./httpServer");
const wsServer_1 = require("./wsServer");
const SERVER_SUCCESS = '服务器 rpc 路由添加完成';
class ChildExpress {
    constructor() {
    }
    run() {
        this.initProcess();
    }
    initProcess() {
        console.log('RpcServer: intialize child process message | uncaughtException | exit events');
        process.on('message', this.onMessage.bind(this));
        process.on('uncaughtException', (err) => {
            console.log('子进程捕获到为处理异常', err);
            process.exit(1);
        });
    }
    onMessage(msgObj) {
        console.log('收到父进程消息', JSON.stringify(msgObj));
        if (msgObj.type === 'start') {
            if (msgObj.data.protocol === Define_1.ProtocolTypes[Define_1.ProtocolTypes.http]) {
                if (this.httpServer) {
                    this.httpServer.close();
                }
                this.httpServer = new httpServer_1.HttpServer();
                this.httpServer.initParam(msgObj.data).initExpress();
            }
            if (msgObj.data.protocol === Define_1.ProtocolTypes[Define_1.ProtocolTypes.webSocket]) {
                if (this.wsServer) {
                    this.wsServer.close();
                }
                this.wsServer = new wsServer_1.WSServer();
                this.wsServer.initParam(msgObj.data).initWS();
            }
        }
    }
}
new ChildExpress().run();
//# sourceMappingURL=ChildExpress.js.map