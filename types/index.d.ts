export interface Cors {
    origin: string,
    credentials: boolean,
    method: string[],
}

export interface TypeFile {
    front?: Express.Multer.File[]
    back?: Express.Multer.File[]
};


export type TExtracted  = {
    frontText: string
    backText: string
};

export type AadhaarData = {
  name?: string;
  dob?: string;
  gender?: string;
  aadhaarNumber?: string;
  address?: string;
};