import Customer from "../entity/customer";
import CustomerInterface from "../entity/customer.interface";
import Address from "../value-object/address";
import { v4 as uuid } from "uuid";

export default class CustomerFactory {
    public static create(name: string): CustomerInterface {
        return new Customer(uuid(), name);
    }

    public static createWithAddress(name: string, address: Address): CustomerInterface {
        let customer = new Customer(uuid(), name);
        customer.changeAddress(address);
        return customer;
    }
}