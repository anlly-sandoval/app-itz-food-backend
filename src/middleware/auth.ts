import { type Request, type Response, type NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';

//Instanciamos dotenv para avriables de ambiente
dotenv.config();

//agregamos el userId y auth0Id al objeto request
declare global {
    namespace Express {
        interface Request {
            userId: string,
            auth0Id: string
        }
    }
}


export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE || '',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || '',
  tokenSigningAlg: 'RS256'
});

export const jwtParse = async (req: Request, res: Response, next: NextFunction): Promise<any>=>{
    const { authorization } = req.headers;
    if(!authorization || !authorization.startsWith('Bearer')){
        console.log('jwtParse - autorizacion denegada');
        return res.sendStatus(401).json({message: 'Autorizacion denegada'});
    }
    //obtenemos token del header
    //Bearer 123enxcdjne <-- Convertir a un arreglo
    //[0        1]
    const token = authorization.split(" ")[1];
    try {
        console.log("jwtParse - Analizando token");
        //analizamos el token que sea correcto
        //deadcode decodifica el token diviendo en partes 
        const decoded = jwt.decode(token || "")  as jwt.JwtPayload
        //Ele elemnto sub del token contiene el id del usuairio que inicio sesion
        const auth0Id = decoded.sub || "";

        //comprobamos que exista el usuario en la base de datos 
        const user = await User.findOne({auth0Id});

        if(!user){
            console.log("jwtParse - !user Autorizacion denegada");
            return res.status(401).json({message: 'Autorizacion denegada, usuario no encontrado'})
        }
        //guardamos los datos del usuairo q inicio sesion en el objecto request
        req.auth0Id = auth0Id as string;
        req.userId = user._id.toString();
        console.log('jwtParse - Autorizacion concedida');
        next();
    } catch (error) {
        console.log('jwtParse - Autorizacion denegada');
        return res.sendStatus(401).json({message: 'Autorizacion denegada'});
    }
}