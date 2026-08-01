import { CustomerRepository } from "./customer.repository.js";
import { NotFoundError } from "../../utils/errors.js";

export class CustomerService {
  repository = new CustomerRepository();

  async getAll(params) {
    return this.repository.findAll(params);
  }

  async getById(id) {
    const customer = await this.repository.findById(id);
    if (!customer) throw new NotFoundError("Customer");
    return customer;
  }

  async create(dto) {
    const id = await this.repository.create({
      first_name: dto.first_name,
      last_name: dto.last_name,
      company: dto.company || null,
      email: dto.email || null,
      phone: dto.phone || null,
      address: dto.address || null,
      city: dto.city || null,
      state: dto.state || null,
      zip_code: dto.zip_code || null,
      status: dto.status || "active",
      notes: dto.notes || null,
    });
    return this.repository.findById(id);
  }

  async update(id, dto) {
    const customer = await this.repository.findById(id);
    if (!customer) throw new NotFoundError("Customer");
    await this.repository.update(id, dto);
    return this.repository.findById(id);
  }

  async delete(id) {
    const customer = await this.repository.findById(id);
    if (!customer) throw new NotFoundError("Customer");
    await this.repository.delete(id);
  }
}
