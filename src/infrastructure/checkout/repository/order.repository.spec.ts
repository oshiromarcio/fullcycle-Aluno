import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../customer/repository/customer.model";
import ProductModel from "../../product/repository/product.model";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import CustomerRepository from "../../customer/repository/customer.repository";
import ProductRepository from "../../product/repository/product.repository";
import OrderRepository from "./order.repository";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import Product from "../../../domain/product/entity/product";
import Order from "../../../domain/checkout/entity/order";
import OrderItem from "../../../domain/checkout/entity/order_item";

const newAddress = () =>
    new Address(    "Street " + Math.floor((Math.random() * 1000) + 1).toString(),
                    Math.floor((Math.random() * 1000) + 1),
                    "City " + Math.floor((Math.random() * 100) + 1).toString(),
                    Math.floor((Math.random() * 100000) + 1).toString());

const newProduct = () =>
    new Product(    Math.floor((Math.random() * 10000) + 1).toString(),
                    "Product " + Math.floor((Math.random() * 100) + 1).toString(),
                    Math.floor((Math.random() * 10000) + 1));

const newCustomer = () =>
    new Customer(   Math.floor((Math.random() * 10000) + 1).toString(),
                    "Customer " + Math.floor((Math.random() * 100) + 1).toString());

const newOrderItem = (id: number, product: Product) =>
    new OrderItem(  `o${id}`,
                    product.name,
                    product.price,
                    product.id,
                    Math.floor((Math.random() * 10) + 1) );

const newOrder = (customer: Customer, items: OrderItem[]) =>
    new Order(  Math.floor((Math.random() * 10000) + 1).toString(),
                customer.id,
                items);

describe("Order repository test", () => {
    let sequelize: Sequelize;
    beforeEach(async() => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        });

        sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async() => {
        await sequelize.close();
    });

    it("should create a new order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = newCustomer();
        customer.changeAddress(newAddress());
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = newProduct();
        await productRepository.create(product);
        
        const orderItem = newOrderItem(1, product);

        const order = newOrder(customer, [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ['items']
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    product_id: orderItem.productId,
                    name: orderItem.name,
                    order_id: order.id,
                    quantity: orderItem.quantity,
                    price: orderItem.price
                }
            ]
        });
    });

    it("should update an order", async() => {
        const customerRepository = new CustomerRepository();
        const customer = newCustomer();
        const address = newAddress();
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product1 = newProduct();
        await productRepository.create(product1);

        const orderItem1 = newOrderItem(1, product1);

        const order = newOrder(customer, [orderItem1]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const product2 = newProduct();
        await productRepository.create(product2);

        const orderItem2 = newOrderItem(2, product2);
        order.addItem(orderItem2);
        await orderRepository.update(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"]
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem1.id,
                    product_id: orderItem1.productId,
                    name: orderItem1.name,
                    order_id: order.id,
                    quantity: orderItem1.quantity,
                    price: orderItem1.price
                },
                {
                    id: orderItem2.id,
                    product_id: orderItem2.productId,
                    name: orderItem2.name,
                    order_id: order.id,
                    quantity: orderItem2.quantity,
                    price: orderItem2.price
                }
            ]
        })
    });

    it("should find an order by id", async() => {
        const customerRepository = new CustomerRepository();
        const customer1 = newCustomer();
        const address1 = newAddress();
        customer1.changeAddress(address1);
        await customerRepository.create(customer1);

        const productRepository = new ProductRepository();
        const product1 = newProduct();
        await productRepository.create(product1);
        const product2 = newProduct();
        await productRepository.create(product2);

        const orderItem1 = newOrderItem(1, product1);
        const orderItem2 = newOrderItem(2, product2);

        const orderRepository = new OrderRepository();
        const order1 = newOrder(customer1, [ orderItem1, orderItem2 ]);
        await orderRepository.create(order1);

        const foundOrder = await orderRepository.find(order1.id);

        expect(foundOrder).toStrictEqual(order1);
    });

    it("should find all orders", async() => {
        const customerRepository = new CustomerRepository();
        const customer1 = newCustomer();
        const address1 = newAddress();
        customer1.changeAddress(address1);
        await customerRepository.create(customer1);

        const productRepository = new ProductRepository();
        const product1 = newProduct();
        await productRepository.create(product1);
        const product2 = newProduct();
        await productRepository.create(product2);
        const product3 = newProduct();
        await productRepository.create(product3);
        const product4 = newProduct();
        await productRepository.create(product4);

        const orderItem1 = newOrderItem(1, product1);
        const orderItem2 = newOrderItem(2, product2);

        const orderRepository = new OrderRepository();
        const order1 = newOrder(customer1, [ orderItem1, orderItem2 ]);
        await orderRepository.create(order1);

        const customer2 = newCustomer();
        const address2 = newAddress();
        customer2.changeAddress(address2);
        await customerRepository.create(customer2);

        const orderItem3 = newOrderItem(3, product3);
        const orderItem4 = newOrderItem(4, product4);

        const order2 = newOrder(customer2, [ orderItem3, orderItem4 ]);
        await orderRepository.create(order2);

        const foundOrders = await orderRepository.findAll();

        expect(foundOrders).toEqual([ order1, order2 ]);
    });
});