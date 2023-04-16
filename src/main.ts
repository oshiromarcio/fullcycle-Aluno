import Address from "./entity/address";
import Customer from "./entity/customer";
import Order from "./entity/order";
import OrderItem from "./entity/order_item";

let customer = new Customer("123", "Melissa");
const address = new Address("Rua 1", "2", "Sao Paulo", "Sao Paulo", "03440-040");
customer.Address = address;
customer.activate();

const item1 = new OrderItem("1", "Item 1", 10, "P1", 1);
const item2 = new OrderItem("2", "Item 2", 15, "P2", 1);

const order =  new Order("1", "123", [item1, item2]);