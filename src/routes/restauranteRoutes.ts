import express from 'express';
import multer from 'multer';
import { createRestaurante, getRestaurante, updateRestaurante } from '../controller/restauranteController.js';
import { jwtCheck, jwtParse } from '../middleware/auth.js';
import { validateRestauranteRequest } from '../middleware/validation.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits:{
    fileSize: 5 * 1040 * 1024, //5mb
  }
});

//rutas para obtener los datos de un restaurante
router.get('/',
  jwtCheck,
  jwtParse,
  getRestaurante
)

//rutas para crear un restaurante
router.post('/',
  jwtCheck,
  jwtParse,
  upload.single("imageFile"),
  validateRestauranteRequest,
  createRestaurante
);

//ruta para actualizar un restaurante
router.put('/',
  jwtCheck,
  jwtParse,
  upload.single("imageFile"),
  validateRestauranteRequest,
  updateRestaurante
);


export default router;