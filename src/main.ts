import Address from "./domain/entity/address";
import Customer from "./domain/entity/customer";
import Order from "./domain/entity/order";
import OrderItem from "./domain/entity/order_item";

let customer = new Customer("123", "Melissa");
const address = new Address("Rua 1", 2, "Sao Paulo", "Sao Paulo");
customer.changeAddress(address);
customer.activate();

const item1 = new OrderItem("1", "Item 1", 10, "P1", 1);
const item2 = new OrderItem("2", "Item 2", 15, "P2", 1);

const order =  new Order("1", "123", [item1, item2]);
