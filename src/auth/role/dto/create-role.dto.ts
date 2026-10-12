import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre del rol es obligatorio' })
    @MaxLength(50)
    name: string;

    @IsString()
    @MaxLength(255)
    description: string;
}
