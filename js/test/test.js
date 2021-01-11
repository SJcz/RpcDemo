"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var RpcServer_1 = require("../RpcServer/RpcServer");
var RpcClient_1 = require("../RpcClient/RpcClient");
var path = require("path");
// 启动RPC服务器
// console.log(path.resolve(__dirname, '../remote'));
RpcServer_1.RpcServer.getInstance().initRpcServer(path.resolve(__dirname, '../remote'));
var rpcClient = RpcClient_1.RpcClient.getInstance();
// 异步
function startRpc() {
    rpcClient.rpc.Test.add(1, 2).then(function (result) {
        console.log('-------------------------------------');
        console.log('async:', result);
    }).catch(function (e) {
        console.log('-------------------------------------');
        console.log(e.message);
    });
}
// 同步
function startRpcSync() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rpcClient.rpc.Test.add(1, 2)];
                case 1:
                    result = _a.sent();
                    console.log('sync:', result);
                    return [2 /*return*/];
            }
        });
    });
}
function startClient() {
    rpcClient.initClient('http://localhost:10008');
    setTimeout(startRpc, 3000);
    setTimeout(startRpcSync, 4000);
}
setTimeout(startClient, 3000);
/*

function sleep(time) {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
    return promise;
}

async function asyncTest() {
    let i = 0;
    while (i < 10) {
        let date = new Date();
        console.log(`time: ${date} i=${i}`);
        i++;
        await sleep(1000); //暂停1秒
    }
}

console.log('==开始执行异步函数==');
asyncTest();
console.log('==我是异步函数后面的内容==');

*/ 
