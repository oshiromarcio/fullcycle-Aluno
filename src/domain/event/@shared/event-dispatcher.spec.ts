import EventDispatcher from "./event-dispatcher";
import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../product/product-created.event";
import EnviaConsoleLog1Handler from "../customer/handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "../customer/handler/envia-console-log-2.handler";
import CustomerCreatedEvent from "../customer/customer-created.event";
import Customer from "../../entity/customer";
import EnviaConsoleLogHandler from "../customer/handler/envia-console-log.handler";
import Address from "../../entity/address";
import CustomerAddressChangedEvent from "../customer/customer-address-changed.event";

describe("Domain events tests", () => {
    it("should register an product event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    });

    it("should unregister a product event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
    });

    it("should unregister all product event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregisterAll();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
    });

    it("should notify a product event", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 10.0
        });

        // Quando o notify for executado o SendEmailWhenProductCreated.handle() deve ser chamado
        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toBeCalled();
    });

    it("should register customer event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const firstEventHandler = new EnviaConsoleLog1Handler();
        const secondEventHandler = new EnviaConsoleLog2Handler();

        eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
        eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(firstEventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(secondEventHandler);
    });

    it("should unregister a customer event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const firstEventHandler = new EnviaConsoleLog1Handler();
        const secondEventHandler = new EnviaConsoleLog2Handler();

        eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
        eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(firstEventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(secondEventHandler);

        eventDispatcher.unregister("CustomerCreatedEvent", firstEventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(secondEventHandler);
    });

    it("should unregister all customer event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const firstEventHandler = new EnviaConsoleLog1Handler();
        const secondEventHandler = new EnviaConsoleLog2Handler();

        eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
        eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(firstEventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(secondEventHandler);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeUndefined();
    });

    it("should notify a customer created event", () => {
        const eventDispatcher = new EventDispatcher();
        const firstEventHandler = new EnviaConsoleLog1Handler();
        const secondEventHandler = new EnviaConsoleLog2Handler();
        const firstSpyEventHandler = jest.spyOn(firstEventHandler, "handle");
        const secondSpyEventHandler = jest.spyOn(secondEventHandler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
        eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(firstEventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(secondEventHandler);

        const customer = new Customer("1", "Joao Ninguem");
        const firstCustomerEvent = new CustomerCreatedEvent(customer);
        eventDispatcher.notify(firstCustomerEvent);
        expect(firstSpyEventHandler).toBeCalled();
        expect(secondSpyEventHandler).toBeCalled();
    });

    it("should register a customer address changed event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLogHandler();

        eventDispatcher.register("CustomerAddressChanged", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerAddressChanged"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerAddressChanged"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerAddressChanged"][0]).toMatchObject(eventHandler);
    });

    it("should notify a customer address changed event", () => {
        const eventDispatcher = new EventDispatcher();
        const firstEventHandler = new EnviaConsoleLog1Handler();
        const secondEventHandler = new EnviaConsoleLog2Handler();
        const addressChangedEventHandler = new EnviaConsoleLogHandler();
        const firstSpyEventHandler = jest.spyOn(firstEventHandler, "handle");
        const secondSpyEventHandler = jest.spyOn(secondEventHandler, "handle");
        const addressChangedSpyEventHandler = jest.spyOn(addressChangedEventHandler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
        eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);
        eventDispatcher.register("CustomerAddressChangedEvent", addressChangedEventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(firstEventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(secondEventHandler);
        
        const customer = new Customer("2", "Jose Comilao");
        const firstCustomerEvent = new CustomerCreatedEvent(customer);
        eventDispatcher.notify(firstCustomerEvent);
        expect(firstSpyEventHandler).toBeCalled();
        expect(secondSpyEventHandler).toBeCalled();

        const address = new Address("Rua Popopo", 31, "Popopo", "05667040");
        customer.changeAddress(address);
        const addressChangedEvent = new CustomerAddressChangedEvent(customer);
        eventDispatcher.notify(addressChangedEvent);
        expect(addressChangedSpyEventHandler).toBeCalled();
    });
});