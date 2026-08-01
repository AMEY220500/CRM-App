import { ZodError } from "zod";

export function validate(schema, source = "body") {
  return (req, res, next) => {
    try {
      const data = schema.parse(req[source]);
      req[source] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        res.status(422).json({
          success: false,
          message: "Validation failed",
          errors,
        });
        return;
      }
      next(error);
    }
  };
}
