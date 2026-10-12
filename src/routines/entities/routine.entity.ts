import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { User } from '../../auth/entities/user.entity';
import { RoutineExercise } from '../../routine-exercises/entities/routine-exercise.entity';
import { ActivityLog } from '../../activity-logs/entities/activity-log.entity';

/**
 * ROUTINE: plan de entrenamiento personalizado que crea un usuario.
 */
@Entity('routines')
export class Routine {
    @PrimaryGeneratedColumn()
    id: number;

    // USER ||--o{ ROUTINE : creates  -> si se borra el usuario, se borran sus rutinas
    @ManyToOne(() => User, (user) => user.routines, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' }) // TypeORM lo actualiza solo en cada save
    updatedAt: Date;

    // ROUTINE ||--o{ ROUTINE_EXERCISE : contains
    @OneToMany(() => RoutineExercise, (routineExercise) => routineExercise.routine)
    routineExercises: RoutineExercise[];

    // ROUTINE ||--o{ ACTIVITY_LOG : executed_as
    @OneToMany(() => ActivityLog, (activityLog) => activityLog.routine)
    activityLogs: ActivityLog[];
}
