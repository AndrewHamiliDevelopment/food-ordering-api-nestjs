import { ItemModel } from "./Item.model";

export class PaymentModel {
    items: ItemModel[];
    returnUrl: string;
    description: string;
}