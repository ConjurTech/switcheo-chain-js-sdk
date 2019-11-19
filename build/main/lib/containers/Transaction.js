"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var StdSignDoc_1 = require("./StdSignDoc");
var Transaction = /** @class */ (function () {
    function Transaction(type, msg, signature, options) {
        if (options === void 0) { options = {}; }
        var fee = options.fee || new StdSignDoc_1.Fee([], config_1.CONFIG.DEFAULT_GAS);
        var mode = options.mode || 'sync';
        this.tx = {
            fee: fee,
            msg: [{
                    type: type,
                    value: msg,
                }],
            signatures: [signature],
        };
        this.mode = mode;
    }
    return Transaction;
}());
exports.Transaction = Transaction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2NvbnRhaW5lcnMvVHJhbnNhY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvQ0FBa0M7QUFDbEMsMkNBQWtDO0FBa0JsQztJQUtFLHFCQUFZLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLE9BQWdDO1FBQWhDLHdCQUFBLEVBQUEsWUFBZ0M7UUFDaEUsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsSUFBSSxJQUFJLGdCQUFHLENBQUMsRUFBRSxFQUFFLGVBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUMxRCxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQTtRQUNuQyxJQUFJLENBQUMsRUFBRSxHQUFHO1lBQ1IsR0FBRyxLQUFBO1lBQ0gsR0FBRyxFQUFFLENBQUM7b0JBQ0osSUFBSSxNQUFBO29CQUNKLEtBQUssRUFBRSxHQUFHO2lCQUNYLENBQUM7WUFDRixVQUFVLEVBQUUsQ0FBQyxTQUFTLENBQUM7U0FDeEIsQ0FBQTtRQUNELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO0lBQ2xCLENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMsQUFsQkQsSUFrQkM7QUFsQlksa0NBQVcifQ==