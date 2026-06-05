import { pool } from "../../config/database.js";
import { StockRepository } from "./stock.repository.js";
import { CreateStockMovementDto } from "./stock.dto.js";
import { NotFoundError, BadRequestError } from "../../utils/errors.js";
import { PaginationParams } from "../../types/index.js";
import { RowDataPacket } from "mysql2";

export class StockService {
  private repository = new StockRepository();

  async getAll(
    params: PaginationParams & { product_id?: number; type?: string },
  ) {
    return this.repository.findAll(params);
  }

  async createMovement(dto: CreateStockMovementDto, userId: number) {
    // Get current product quantity
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM products WHERE id = ?",
      [dto.product_id],
    );
    const product = rows[0] as any;
    if (!product) throw new NotFoundError("Product");

    const previousQuantity = product.quantity;
    let newQuantity: number;

    switch (dto.type) {
      case "in":
        newQuantity = previousQuantity + dto.quantity;
        break;
      case "out":
        if (dto.quantity > previousQuantity) {
          throw new BadRequestError(
            "Insufficient stock. Available: " + previousQuantity,
          );
        }
        newQuantity = previousQuantity - dto.quantity;
        break;
      case "adjustment":
        newQuantity = dto.quantity;
        break;
      default:
        throw new BadRequestError("Invalid movement type");
    }

    // Update product quantity and status
    let status: string;
    if (newQuantity === 0) status = "out_of_stock";
    else if (newQuantity <= product.min_stock_level) status = "low_stock";
    else status = "in_stock";

    await pool.execute(
      'UPDATE products SET quantity = ?, status = ?, last_restocked = CASE WHEN ? = "in" THEN NOW() ELSE last_restocked END WHERE id = ?',
      [newQuantity, status, dto.type, dto.product_id],
    );

    // Create movement record
    const movementId = await this.repository.create({
      product_id: dto.product_id,
      type: dto.type,
      quantity: dto.quantity,
      previous_quantity: previousQuantity,
      new_quantity: newQuantity,
      reference: dto.reference || null,
      notes: dto.notes || null,
      performed_by: userId,
    });

    return {
      id: movementId,
      previous_quantity: previousQuantity,
      new_quantity: newQuantity,
      status,
    };
  }

  async getProductMovements(productId: number) {
    return this.repository.getProductMovements(productId);
  }
}
