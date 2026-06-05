import { EmployeeRepository } from "./employee.repository.js";
import { CreateEmployeeDto, UpdateEmployeeDto } from "./employee.dto.js";
import { NotFoundError, ConflictError } from "../../utils/errors.js";
import { PaginationParams } from "../../types/index.js";

export class EmployeeService {
  private repository = new EmployeeRepository();

  async getAll(
    params: PaginationParams & { department_id?: number; status?: string },
  ) {
    return this.repository.findAll(params);
  }

  async getById(id: number) {
    const employee = await this.repository.findById(id);
    if (!employee) throw new NotFoundError("Employee");
    return employee;
  }

  async create(dto: CreateEmployeeDto) {
    const exists = await this.repository.emailExists(dto.email);
    if (exists)
      throw new ConflictError("Employee with this email already exists");

    const id = await this.repository.create({
      ...dto,
      user_id: null,
      first_name: dto.first_name,
      last_name: dto.last_name,
      email: dto.email,
      phone: dto.phone || null,
      department_id: dto.department_id || null,
      designation: dto.designation || null,
      salary: dto.salary || null,
      joining_date: new Date(dto.joining_date),
      status: dto.status || "active",
      address: dto.address || null,
    });

    return this.repository.findById(id);
  }

  async update(id: number, dto: UpdateEmployeeDto) {
    const employee = await this.repository.findById(id);
    if (!employee) throw new NotFoundError("Employee");

    if (dto.email) {
      const exists = await this.repository.emailExists(dto.email, id);
      if (exists)
        throw new ConflictError("Employee with this email already exists");
    }

    await this.repository.update(id, dto as any);
    return this.repository.findById(id);
  }

  async delete(id: number) {
    const employee = await this.repository.findById(id);
    if (!employee) throw new NotFoundError("Employee");
    await this.repository.delete(id);
  }
}
