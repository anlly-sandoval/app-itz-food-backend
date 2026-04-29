import express from 'express';
import { createUser, updateUser, getUser } from "../controller/userController.js";
import { jwtCheck, jwtParse } from '../middleware/auth.js';
import { validateUserRequest } from '../middleware/validation.js';

const router = express.Router();

//ruta para guardar un usuario
router.post("/", jwtCheck ,createUser);

//ruta para actualizar un usuario
router.put('/', jwtCheck, jwtParse, validateUserRequest, updateUser);

//ruta para obtener un usuario
router.get('/', jwtCheck, jwtParse, getUser);

export default router;