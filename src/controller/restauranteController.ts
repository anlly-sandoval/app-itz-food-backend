import type { Request, Response } from 'express';
import Restaurant from '../model/restauranteModel.js';
import cloudinary from 'cloudinary';
import mongoose from 'mongoose';

//funcion para obtener los datos del resturante
export const getRestaurante = async (req:Request, res: Response) => {
    try {
        const restaurante = await Restaurant.findOne({user: req.userId});
        if(!restaurante){
            res.status(404).json({message: 'Restaurante no encontrado'})
        }
        res.json(restaurante);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error al obtener los datos del restaurante'})
    }
}

//funcion para crear un restaurante
export const createRestaurante = async (req: Request, res: Response)=>{
    try {
        const existingRestaurante = await Restaurant.findOne({ user: req.userId});
        if(existingRestaurante){
            res.status(500).json({message: 'El restaurante para este usuario ya existe'})
        }

        const imageUrl = await uploadImage(req.file as Express.Multer.File);

        //creamos el objeto restaurante y lo almacenamos en la base de datos
        const restaurante = new Restaurant(req.body);
        restaurante.imageUrl = imageUrl;
        restaurante.user = new mongoose.Types.ObjectId(req.userId);
        restaurante.lastUpdated = new Date();
        await restaurante.save();
        res.status(201).json(restaurante);
    } catch (error) {
        console.log(error);
        console.log("Error al crear el restaurante")
        res.status(500).json({message: 'Error al cear el restaurante'})
    }
}; //fin de createRestaurante

//funcion para actualizar un restaurante
export const updateRestaurante = async (req: Request, res: Response)=>{
    try {
        let restaurante = await Restaurant.findOne({user: req.userId})
        if(!restaurante){
            res.status(404).json({message: 'Restaurante no encontrado'})
        }
        //actualizamos los datos del restaurante
        restaurante!.restauranteName = req.body.restauranteName;
        restaurante!.city = req.body.city;
        restaurante!.country =  req.body.country;
        restaurante!.deliveryPrice = req.body.deliveryPrice;
        restaurante!.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
        restaurante!.cuisines = req.body.cuisines;
        restaurante!.menuItems = req.body.menuItems;
        restaurante!.lastUpdated = new Date();

        //actualizamos la imagen
        if (req.file) {
            const imageUrl = await uploadImage(req.file as Express.Multer.File);
            restaurante!.imageUrl = imageUrl;
        }

        await restaurante?.save();
        res.status(200).send(restaurante);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error al actualizar el restaurante'})
    }
}; //fin de updateRestaurante

const uploadImage = async (file: Express.Multer.File)=>{
    //creamos una url de clodinary para la imagen del restaurante
    const image = file;
    //convertimos el objeto de la imagen a un objeto base64 para poderlo almacenar como imagen en cloudinary
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataUri = "data:" + image.mimetype + ";base64," + base64Image;
    //subimos la imagen a clodinary
    const uploadResponse = await cloudinary.v2.uploader.upload(dataUri);
    //retornamos la url de la imagen en clodinary
    return uploadResponse.url;
} //fin de uploadImage