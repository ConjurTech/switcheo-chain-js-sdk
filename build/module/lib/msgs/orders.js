// tslint:disable:max-classes-per-file
// import { BigNumber } from 'bignumber.js'
export class CreateOrderMsg {
    constructor({ originator, orderParams, }) {
        this.Originator = originator;
        this.OrderParams = orderParams;
        // this.Side = side
        // this.Quantity = quantity
        // this.Price = new BigNumber(price).toFixed(18)  // decimal is precision 18
    }
}
export class CancelOrderMsg {
    constructor({ originator, id, }) {
        this.Originator = originator;
        this.ID = id;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9tc2dzL29yZGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxzQ0FBc0M7QUFDdEMsMkNBQTJDO0FBRTNDLE1BQU0sT0FBTyxjQUFjO0lBT3pCLFlBQVksRUFDVixVQUFVLEVBQ1YsV0FBVyxHQUNaO1FBQ0MsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7UUFDNUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUE7UUFDOUIsbUJBQW1CO1FBQ25CLDJCQUEyQjtRQUMzQiw0RUFBNEU7SUFDOUUsQ0FBQztDQUNGO0FBRUQsTUFBTSxPQUFPLGNBQWM7SUFJekIsWUFBWSxFQUNWLFVBQVUsRUFDVixFQUFFLEdBQ0g7UUFDQyxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtRQUM1QixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQTtJQUNkLENBQUM7Q0FDRiJ9