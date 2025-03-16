import { LinkModel } from "./link.model";

export class PaymentResponseModel {
    id: string;
    intent: string;
    state: string;
    links: LinkModel[];
}