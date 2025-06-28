import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(403).send("Token is required");
        return;
    } 

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);        
        next();
    } catch (error) {
        res.status(401).send(`Invalid token: ${error}`);
        return ;
    }
}
