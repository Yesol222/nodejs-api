export class Fabtoken {
    id: {tx_id: string, index?: string}
    type: string;
    quantity: string;

    constructor(fabtoken: any) {
        this.id = {
            tx_id: fabtoken.tx_id,
        };
        if (!!fabtoken.index) {
            this.id['index'] = fabtoken.index;
        }
        this.type = fabtoken.type;
        this.quantity = fabtoken.quantity;
    }
}