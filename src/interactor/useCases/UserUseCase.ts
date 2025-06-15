import { ITesseractExtract } from "../../domain/services/ITesseract";
import { IUserUseCase } from "./interfaces/IUserUseCase";
import { TypeFile, TExtracted } from "../../../types";
export class UserUseCase implements IUserUseCase{

    constructor(private tesseract: ITesseractExtract){}

    processData = async (files: TypeFile): Promise<any> => {
        try {
            const frontText = await this.tesseract.extract(files.front?.[0] );
            const backText = await this.tesseract.extract(files.back?.[0]);
            return {frontText, backText}   
        } catch (error) {
           throw new Error('Something happend in processData') 
        }
    };
};