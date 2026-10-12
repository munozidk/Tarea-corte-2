import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../auth/entities/user.entity';
import { Routine } from '../../routines/entities/routine.entity';
import { ActivityExercise } from '../../activity-exercises/entities/activity-exercise.entity';

/**
 * ACTIVITY_LOG: una sesión de entrenamiento real (historial).
 * Se crea cuando el usuario empieza a ejecutar una rutina.
 */
@Entity('activity_logs')
export class ActivityLog {
    @PrimaryGeneratedColumn()
    id: number;

    // USER ||--o{ ACTIVITY_LOG : performs
    @ManyToOne(() => User, (user) => user.activityLogs, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    // ROUTINE ||--o{ ACTIVITY_LOG : executed_as
    // SET NULL: si se borra la rutina, el historial de la sesión se conserva (requisito del README)
    @ManyToOne(() => Routine, (routine) => routine.activityLogs, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'routine_id' })
    routine: Routine | null;

    @Column({ name: 'started_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    startedAt: Date;

    @Column({ name: 'completed_at', type: 'timestamp', nullable: true }) // null = sesión en curso
    completedAt: Date | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    // ACTIVITY_LOG ||--o{ ACTIVITY_EXERCISE : contains
    @OneToMany(() => ActivityExercise, (activityExercise) => activityExercise.activityLog)
    activityExercises: ActivityExercise[];
}
