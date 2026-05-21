import express from 'express';
import multer from 'multer';
import { createRestaurante, getRestaurante, searchRestaurante, updateRestaurante } from '../controller/restauranteController.js';
import { jwtCheck, jwtParse } from '../middleware/auth.js';
import { validateRestauranteRequest } from '../middleware/validation.js';
import { param } from 'express-validator';

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

//ruta para buscar los datos de un restaurante
router.get('/search/:city', param("city").isString()
                                          .trim()
                                          .notEmpty()
                                          .withMessage("El parametro ciudad debe ser un string valido"),
                            searchRestaurante
);


export default router;