import { CONFIG } from '../config';
import { Fee } from './StdSignDoc';
export class Transaction {
    constructor(type, msg, signature, options = {}) {
        const fee = options.fee || new Fee([], CONFIG.DEFAULT_GAS);
        const mode = options.mode || 'sync';
        this.tx = {
            fee,
            msg: [{
                    type,
                    value: msg,
                }],
            signatures: [signature],
        };
        this.mode = mode;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2NvbnRhaW5lcnMvVHJhbnNhY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFdBQVcsQ0FBQTtBQUNsQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sY0FBYyxDQUFBO0FBa0JsQyxNQUFNLE9BQU8sV0FBVztJQUt0QixZQUFZLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFVBQThCLEVBQUU7UUFDaEUsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQzFELE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFBO1FBQ25DLElBQUksQ0FBQyxFQUFFLEdBQUc7WUFDUixHQUFHO1lBQ0gsR0FBRyxFQUFFLENBQUM7b0JBQ0osSUFBSTtvQkFDSixLQUFLLEVBQUUsR0FBRztpQkFDWCxDQUFDO1lBQ0YsVUFBVSxFQUFFLENBQUMsU0FBUyxDQUFDO1NBQ3hCLENBQUE7UUFDRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtJQUNsQixDQUFDO0NBQ0YifQ==