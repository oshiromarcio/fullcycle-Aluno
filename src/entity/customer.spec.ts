import Address from "./address";
import Customer from "./customer";

describe("Customer unit tests", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            let customer = new Customer("", "John");
        }).toThrowError("Id is required");
    });

    it("should throw error when name is empty", () => {
        expect(() => {
            let customer = new Customer("1", "");
        }).toThrowError("Name is required");
    });

    it("should change name", () => {
        let customer = new Customer("1", "Jane");
        customer.changeName("Janet");
        expect(customer.name).toBe("Janet");
    });

    it("should activate customer", () => {
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Test Street", "123", "São Paulo", "São Paulo", "03440-040");
        customer.Address = address;
        customer.activate();
        expect(customer.isActive()).toBe(true);
    });

    it("should deactivate customer", () => {
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Test Street", "123", "São Paulo", "São Paulo", "03440-040");
        customer.Address = address;
        customer.activate();
        customer.deactivate();
        expect(customer.isActive()).toBe(false);
    });

    it("should throw error when address is undefined when you activate a customer", () => {
        expect(() => {
            const customer = new Customer("1", "Customer 1");
            customer.activate();
        }).toThrowError("Address is mandatory to activate a customer");
    });
});