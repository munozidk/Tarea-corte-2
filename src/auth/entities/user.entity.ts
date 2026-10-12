import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Routine } from '../../routines/entities/routine.entity';
import { ActivityLog } from '../../activity-logs/entities/activity-log.entity';

import { Role } from './role.entity';

@Entity('users') // This decorator marks the class as a database entity and specifies the table name as 'users'
// DON'T CALL IT USER, IT'S A RESERVED WORD IN SQL
export class User {
    @PrimaryGeneratedColumn() // Primary key, auto-incremented
    id!: number;

    @Column({ unique: true, length: 50 }) // Unique username with a maximum length of 50 characters
    username!: string;

    @Column({ unique: true, length: 255 }) // Unique email address for each user
    email!: string;

    @Exclude() // Nunca se envía el hash en las respuestas JSON (lo aplica ClassSerializerInterceptor en main.ts)
    @Column({ length: 255, name: 'password_hash' }) // Hashed password for each user
    passwordHash!: string;

    @Column({ length: 255, nullable: true }) // Optional full name of the user
    bio!: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Automatically set the creation date of the user record to the current timestamp
    createdAt!: Date;

    @ManyToOne(() => Role, (role) => role.users, { eager: false, nullable: false }) // Many-to-one relationship with Role entity, meaning that each user can have one role, but a role can be assigned to many users
    @JoinColumn({ name: 'role_id' }) // Eager loading is enabled for the role relationship, meaning that when a user is fetched from the database, the associated role will be loaded automatically without needing to specify it in the query
    role!: Role; // This property represents the role associated with the user, is of type Role and not an array because it's a many-to-one relationship

    @OneToMany(() => Routine, (routine) => routine.user) // Un usuario crea muchas rutinas
    routines!: Routine[];

    @OneToMany(() => ActivityLog, (activityLog) => activityLog.user) // Un usuario realiza muchas sesiones
    activityLogs!: ActivityLog[];
}
