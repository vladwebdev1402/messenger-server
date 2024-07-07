import { IsNotEmpty } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty()
    login: string; 
    
    @IsNotEmpty()
    password: string; 
}