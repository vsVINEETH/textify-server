import { TypeFile, TExtracted } from "../../../../types";

export interface IUserUseCase {
    processData (file:TypeFile): Promise<TExtracted>
};
