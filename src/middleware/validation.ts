import { body, validationResult } from "express-validator";
import { type Request, type Response, type NextFunction } from "express";

const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //existen errores en los datos recibidos en el request
    return res.status(400).json({ errors: errors.array() });
  }
  //no hay errores en los datos del request
  next();
}; //fin del handleValidationErrors

export const validateUserRequest = [
  body("name")
    .isString()
    .notEmpty()
    .withMessage("El nombre debe ser un string"),
  body("address")
    .isString()
    .notEmpty()
    .withMessage("La dirección debe ser un string"),
  body("city")
    .isString()
    .notEmpty()
    .withMessage("La ciudad debe ser un string"),
  body("country")
    .isString()
    .notEmpty()
    .withMessage("El país debe ser un string"),
  handleValidationErrors,
]; //fin del validateUserRequest