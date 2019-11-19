import * as containers from '../containers';
import * as msgs from '../msgs';
import * as types from '../types';
export async function mintToken(wallet, params, options) {
    const address = wallet.pubKeyBech32;
    const msg = new msgs.MintTokenMsg({
        ...params,
        originator: address,
    });
    const signature = await wallet.signMessage(msg, options);
    const broadcastTxBody = new containers.Transaction(types.MINT_TOKEN_MSG_TYPE, msg, signature, options);
    return wallet.broadcast(broadcastTxBody);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWludHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2FwaS9taW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssVUFBVSxNQUFNLGVBQWUsQ0FBQTtBQUMzQyxPQUFPLEtBQUssSUFBSSxNQUFNLFNBQVMsQ0FBQTtBQUMvQixPQUFPLEtBQUssS0FBSyxNQUFNLFVBQVUsQ0FBQTtBQVdqQyxNQUFNLENBQUMsS0FBSyxVQUFVLFNBQVMsQ0FBQyxNQUFjLEVBQUUsTUFBdUIsRUFBRSxPQUFpQjtJQUN4RixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFBO0lBQ25DLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQztRQUNoQyxHQUFHLE1BQU07UUFDVCxVQUFVLEVBQUUsT0FBTztLQUNwQixDQUFDLENBQUE7SUFDRixNQUFNLFNBQVMsR0FBRyxNQUFNLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQ3hELE1BQU0sZUFBZSxHQUFHLElBQUksVUFBVSxDQUFDLFdBQVcsQ0FDaEQsS0FBSyxDQUFDLG1CQUFtQixFQUN6QixHQUFHLEVBQ0gsU0FBUyxFQUNULE9BQU8sQ0FDUixDQUFBO0lBQ0QsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFBO0FBQzFDLENBQUMifQ==