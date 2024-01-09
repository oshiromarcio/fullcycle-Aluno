import Address from "../../../domain/customer/value-object/address";
import Customer from "../../../domain/customer/entity/customer";
import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";
import CustomerModel from "./customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {
    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            street: entity.address.street,
            number: entity.address.number,
            zipcode: entity.address.zipcode,
            city: entity.address.city,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints
        });
    }
    async update(entity: Customer): Promise<void> {
        await CustomerModel.update({
            name: entity.name,
            street: entity.address.street,
            number: entity.address.number,
            zipcode: entity.address.zipcode,
            city: entity.address.city,
            rewardPoints: entity.rewardPoints
        },
        {
            where: { id: entity.id },
        });
    }
    async find(id: string): Promise<Customer> {
        let customerModel;
        try {
            customerModel = await CustomerModel.findOne({ where: { id }, rejectOnEmpty: true });
        } catch (error) {
            throw new Error("Customer not found");
        }

        const customer = new Customer(customerModel.id, customerModel.name );
        const address = new Address(
            customerModel.street,
            customerModel.number,
            customerModel.city,
            customerModel.zipcode);
        customer.changeAddress(address);
        return customer;
    }
    async findAll(): Promise<Customer[]> {
        const customersModel = await CustomerModel.findAll();
        const customers = customersModel.map((customersModel) => {
            let customer = new Customer(customersModel.id, customersModel.name);
            customer.addRewardPoints(customersModel.rewardPoints);
            const address = new Address(
                customersModel.street,
                customersModel.number,
                customersModel.city,
                customersModel.zipcode
            );
            customer.changeAddress(address);
            if (customersModel.active) {
                customer.activate();
            }
            return customer;
        });
        return customers;
    }
    
}