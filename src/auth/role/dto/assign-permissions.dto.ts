import { ArrayNotEmpty, IsArray, IsInt, Min } from 'class-validator';

export class AssignPermissionsDto {
    @IsArray()
    @ArrayNotEmpty({ message: 'Debe enviar al menos un permiso' })
    @IsInt({ each: true, message: 'Cada permissionId debe ser un entero' })
    @Min(1, { each: true })
    permissionIds: number[];
}
