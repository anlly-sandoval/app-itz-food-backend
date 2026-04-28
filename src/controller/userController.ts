import { type Request, type Response } from "express";
import User from "../model/userModel.js";

//funcion para crear un usuario
export const createUser = async (req: Request, res: Response): Promise<any> => {
  //1. verificar si el usuario ya existe en la bd
  //2. crear un usuario si no existe
  //3. regrersar un objeto usuairo al cliente (frontEnd)
  try {
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
      //el usuario ya existe en la bd
      return res.status(200).json(existingUser);
    }
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear el usuario" });
  }
}; //fin de createUser

//funcion para actualizar los datos del usuario
export const updateUser = async(req: Request, res:Response): Promise<any>=>{
  try {
    const {name, address, city, country } = req.body;
    //buscamos en la bd el usuario q inicio sesion
    const user = await User.findById(req.userId);
    if(!user){
      return res.status(404).json({message: 'Usuario no encontrado'});
    }
    user!.name = name;
    user!.address = address;
    user!.city = city;
    user!.country = country;

    await user!.save();
    res.send(user);

  } catch (error) {
    console.log(error);
    return res.status(500).json({message: 'Error al actualizar usuario'});
  }
}

//funcion para obtner los datos del usuario
export const getUser = async(req: Request, res: Response): Promise<any>=>{
  try {
    const currentUser = await User.findById({_id: req.userId});
    if(!currentUser)
      return res.status(404).json({message: "Usuario no encontrado"})
    res.json(currentUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: 'Error al obtener datos del usuario'})
  }
}