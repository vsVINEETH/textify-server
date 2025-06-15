import { Request, Response, NextFunction } from "express";

export interface IUserController {
    extractText (req: Request, res: Response, next: NextFunction): Promise<void>;
};

