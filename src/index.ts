import type { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
dotenv.config();

//importamos las rutas de usuarios
import userRoutes from './routes/userRoutes.js';

mongoose.connect(process.env.DB_CONNECTION_STRING as string).then(() => {
    console.log("Base de datos conectada");
    console.log(process.env.DB_CONNECTION_STRING);
  })
  .catch((error) => {
    console.log(error);
    console.log("Error al conectar a la base de datos");
  });

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

//ruta para verificar que el servidor esta ejecutandose\
app.get('/health', async(req: Request, res: Response)=>{
  res.send({message: 'Servidor OK'})
});
app.get('/', async(req: Request, res: Response)=>{
  res.redirect('/health');
});

app.use('/api/user', userRoutes);

const port = process.env.port || 3000;
app.listen(port, ()=>{
  console.log("App corriendo en el puerto "+ port)
})

app.get("/", async (req: Request, res: Response) => {
  res.send("Hola mundo desde Express y TypeScript!");
});

app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000");
});