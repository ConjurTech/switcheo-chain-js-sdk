"use strict";
// tslint:disable:max-classes-per-file
// import { BigNumber } from 'bignumber.js'
Object.defineProperty(exports, "__esModule", { value: true });
var CreateOrderMsg = /** @class */ (function () {
    function CreateOrderMsg(_a) {
        var originator = _a.originator, orderParams = _a.orderParams;
        this.Originator = originator;
        this.OrderParams = orderParams;
        // this.Side = side
        // this.Quantity = quantity
        // this.Price = new BigNumber(price).toFixed(18)  // decimal is precision 18
    }
    return CreateOrderMsg;
}());
exports.CreateOrderMsg = CreateOrderMsg;
var CancelOrderMsg = /** @class */ (function () {
    function CancelOrderMsg(_a) {
        var originator = _a.originator, id = _a.id;
        this.Originator = originator;
        this.ID = id;
    }
    return CancelOrderMsg;
}());
exports.CancelOrderMsg = CancelOrderMsg;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9tc2dzL29yZGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsc0NBQXNDO0FBQ3RDLDJDQUEyQzs7QUFFM0M7SUFPRSx3QkFBWSxFQUdYO1lBRkMsMEJBQVUsRUFDViw0QkFBVztRQUVYLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO1FBQzVCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFBO1FBQzlCLG1CQUFtQjtRQUNuQiwyQkFBMkI7UUFDM0IsNEVBQTRFO0lBQzlFLENBQUM7SUFDSCxxQkFBQztBQUFELENBQUMsQUFqQkQsSUFpQkM7QUFqQlksd0NBQWM7QUFtQjNCO0lBSUUsd0JBQVksRUFHWDtZQUZDLDBCQUFVLEVBQ1YsVUFBRTtRQUVGLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO1FBQzVCLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFBO0lBQ2QsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FBQyxBQVhELElBV0M7QUFYWSx3Q0FBYyJ9