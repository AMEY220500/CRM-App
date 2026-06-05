import { CustomerRepository } from "./customer.repository.js";
import { CreateCustomerDto, UpdateCustomerDto } from "./customer.dto.js";
import { NotFoundError } from "../../utils/errors.js";
import { PaginationParams } from "../../types/index.js";

export class CustomerService {
  private repository = new CustomerRepository();

  async getAll(params: PaginationParams & { status?: string }) {
    return this.repository.findAll(params);
  }

  async getById(id: number) {
    const customer = await this.repository.findById(id);
    if (!customer) throw new NotFoundError("Customer");
    return customer;
  }

  async create(dto: CreateCustomerDto) {
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

  async update(id: number, dto: UpdateCustomerDto) {
    const customer = await this.repository.findById(id);
    if (!customer) throw new NotFoundError("Customer");
    await this.repository.update(id, dto as any);
    return this.repository.findById(id);
  }

  async delete(id: number) {
    const customer = await this.repository.findById(id);
    if (!customer) throw new NotFoundError("Customer");
    await this.repository.delete(id);
  }
}
