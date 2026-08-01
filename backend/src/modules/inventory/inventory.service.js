import { InventoryRepository } from "./inventory.repository.js";
import { NotFoundError, ConflictError } from "../../utils/errors.js";

export class InventoryService {
  repository = new InventoryRepository();

  async getAll(params) {
    return this.repository.findAll(params);
  }

  async getById(id) {
    const product = await this.repository.findById(id);
    if (!product) throw new NotFoundError("Product");
    return product;
  }

  async create(dto) {
    const skuExists = await this.repository.skuExists(dto.sku);
    if (skuExists)
      throw new ConflictError("Product with this SKU already exists");

    const id = await this.repository.create({
      name: dto.name,
      sku: dto.sku,
      category_id: dto.category_id || null,
      supplier_id: dto.supplier_id || null,
      description: dto.description || null,
      quantity: dto.quantity,
      min_stock_level: dto.min_stock_level,
      unit_price: dto.unit_price,
      cost_price: dto.cost_price || null,
      last_restocked: null,
    });

    return this.repository.findById(id);
  }

  async update(id, dto) {
    const product = await this.repository.findById(id);
    if (!product) throw new NotFoundError("Product");

    if (dto.sku) {
      const skuExists = await this.repository.skuExists(dto.sku, id);
      if (skuExists)
        throw new ConflictError("Product with this SKU already exists");
    }

    // Recalculate status if quantity or min_stock_level changed
    const quantity = dto.quantity ?? product.quantity;
    const minLevel = dto.min_stock_level ?? product.min_stock_level;
    let status;
    if (quantity === 0) status = "out_of_stock";
    else if (quantity <= minLevel) status = "low_stock";
    else status = "in_stock";

    await this.repository.update(id, { ...dto, status });
    return this.repository.findById(id);
  }

  async delete(id) {
    const product = await this.repository.findById(id);
    if (!product) throw new NotFoundError("Product");
    await this.repository.delete(id);
  }

  async getLowStock() {
    return this.repository.getLowStockProducts();
  }

  async getOutOfStock() {
    return this.repository.getOutOfStockProducts();
  }
}
