import { Request, Response, NextFunction } from "express";
import { IUserController } from "./interface/IUserController";
import { IUserUseCase } from "../../interactor/useCases/interfaces/IUserUseCase";
import { UserUseCase } from "../../interactor/useCases/UserUseCase";
import { tesseractExtract } from "../../gateways/services/Tesseract";
import { TypeFile } from "../../../types";
import { ResponseMessages } from "../../interactor/constants/responseMessages";
import { HttpStatus } from "../../domain/enums/httpStatus";
// useCases, interface tesseract, and so on
class UserController implements IUserController {

    constructor(private userUsecase: IUserUseCase){};

    extractText = async (req: Request, res: Response, next: NextFunction) => {
         try {

            const files = req.files as TypeFile;
            if (!files?.front?.[0] || !files?.back?.[0]) {
                res.status(HttpStatus.BAD_REQUEST).json({message: ResponseMessages.MINIMUM_IMAGE_IS_REQUIRED})
                return;
            };

            const extractedText = await this.userUsecase.processData(files);
            console.log(extractedText)
            res.status(200).json({data: extractedText});
            return; 

         } catch (error) {
           next(error);
         };
    };
}

const userUseCase = new UserUseCase(tesseractExtract);
export const userController = new UserController(userUseCase);