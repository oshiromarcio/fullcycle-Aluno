import Order from "../../../domain/checkout/entity/order";
import OrderItem from "../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import ProductModel from "../../product/repository/product.model";

export default class OrderRepository implements OrderRepositoryInterface {

    async create(entity: Order): Promise<void> {
        await OrderModel.create(
            {
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map(item => ({
                    id: item.id,
                    product_id: item.productId,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                }))
            },
            {
              include: [{ model: OrderItemModel }]
            }
        );
    }

    async update(entity: Order): Promise<void> {
        await OrderModel.update(
            {
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total()
            },
            {
                where: { id: entity.id }
            }
        );

        OrderItemModel.destroy({
            where: { order_id: entity.id }
        });

        entity.items.forEach(async (item) => {
            OrderItemModel.create(
                {
                    id: item.id,
                    order_id: entity.id,
                    product_id: item.productId,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                },
                {
                    include: [ { model: ProductModel } ]
                }
            );
        });
    }
    
    async find(id: string): Promise<Order> {
        let orderModel;
        try {
            orderModel = await OrderModel.findOne({
                where: { id: id },
                include: [{ model: OrderItemModel }]
            });
        } catch (error) {
            throw new Error("Order not found");
        }
        
        return new Order(
            orderModel.id,
            orderModel.customer_id,
            orderModel.items.map(
                (item) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
            )
        );
    }

    async findAll(): Promise<Order[]> {
        const ordersModel = await OrderModel.findAll({
            include: [{ model: OrderItemModel }]
        });

        return ordersModel.map(
            (order) => 
                new Order(  order.id,
                            order.customer_id,
                            order.items.map(
                                (item) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
                            )
                )
        );
    }
}