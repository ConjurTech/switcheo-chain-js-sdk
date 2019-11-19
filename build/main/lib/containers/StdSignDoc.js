"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:max-classes-per-file
var StdSignDoc = /** @class */ (function () {
    function StdSignDoc(_a) {
        var chainId = _a.chainId, accountNumber = _a.accountNumber, sequence = _a.sequence, fee = _a.fee, msgs = _a.msgs, memo = _a.memo;
        this.chain_id = chainId;
        this.account_number = accountNumber;
        this.sequence = sequence;
        this.fee = fee;
        this.msgs = msgs;
        this.memo = memo;
    }
    return StdSignDoc;
}());
exports.StdSignDoc = StdSignDoc;
var Fee = /** @class */ (function () {
    function Fee(amount, gas) {
        this.amount = amount;
        this.gas = gas;
    }
    return Fee;
}());
exports.Fee = Fee;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RkU2lnbkRvYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvY29udGFpbmVycy9TdGRTaWduRG9jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXNDO0FBQ3RDO0lBVUUsb0JBQVksRUFPWDtZQU5DLG9CQUFPLEVBQ1AsZ0NBQWEsRUFDYixzQkFBUSxFQUNSLFlBQUcsRUFDSCxjQUFJLEVBQ0osY0FBSTtRQUVKLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFBO1FBQ3ZCLElBQUksQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFBO1FBQ25DLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO1FBQ3hCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ2QsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7UUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7SUFDbEIsQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FBQyxBQXpCRCxJQXlCQztBQXpCWSxnQ0FBVTtBQTJCdkI7SUFJRSxhQUFZLE1BQU0sRUFBRSxHQUFHO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO1FBQ3BCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBO0lBQ2hCLENBQUM7SUFDSCxVQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7QUFSWSxrQkFBRyJ9