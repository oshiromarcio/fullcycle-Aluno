import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            let order = new Order("", "123", []);
        }).toThrowError("Id is required");
    });

    it("should throw error when customerId is empty", () => {
        expect(() => {
            let order = new Order("1", "", []);
        }).toThrowError("CustomerId is required");
    });

    it("should throw error when customerId is empty", () => {
        expect(() => {
            let order = new Order("1", "132", []);
        }).toThrowError("Items are required.");
    });

    it("should calculate total", () => {
        const item = new OrderItem("1", "Creme Nivea", 10, "p1", 2);
        const item2 = new OrderItem("2", "Controle Switch Pro", 350, "p2", 2);
        const order1 = new Order("1", "123", [item]);
        let totalItems1 = 0;
        order1.items.forEach(item => totalItems1 += item.orderItemTotal());
        expect(order1.total()).toBe(totalItems1);

        const order2 = new Order("2", "124", [item, item2]);
        let totalItems2 = 0;
        order2.items.forEach(item => totalItems2 += item.orderItemTotal());
        expect(order2.total()).toBe(totalItems2);
    });

    it("should throw error if the item quantity is less or equal zero", () => {
        expect(() => {
            const item = new OrderItem("1", "Creme Nivea", 10, "p1", 0);
            const order1 = new Order("1", "123", [item]);
        }).toThrowError("Quantity must be greater than zero");
    });

});