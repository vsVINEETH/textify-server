import { createWorker } from 'tesseract.js'
import { AadhaarData } from '../../../types';
export interface ITesseractExtract {
    
    extract (file: Express.Multer.File | undefined): Promise<AadhaarData>;
};