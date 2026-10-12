import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Routine } from '../../routines/entities/routine.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';
import { ActivityExercise } from '../../activity-exercises/entities/activity-exercise.entity';

/**
 * ROUTINE_EXERCISE: tabla intermedia entre Routine y Exercise con datos propios
 * (orden y metas planeadas). Por tener columnas extra NO se usa @ManyToMany,
 * sino dos @ManyToOne, igual que RolePermission en el proyecto base.
 */
@Entity('routine_exercises')
export class RoutineExercise {
    @PrimaryGeneratedColumn()
    id: number;

    // Si se borra la rutina, se borran sus ejercicios planeados
    @ManyToOne(() => Routine, (routine) => routine.routineExercises, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'routine_id' })
    routine: Routine;

    // RESTRICT: no se puede borrar del catálogo un ejercicio que alguna rutina está usando
    @ManyToOne(() => Exercise, (exercise) => exercise.routineExercises, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'exercise_id' })
    exercise: Exercise;

    @Column({ name: 'order_index', type: 'int' }) // posición del ejercicio dentro de la rutina
    orderIndex: number;

    @Column({ name: 'target_sets', type: 'int', nullable: true })
    targetSets: number | null;

    @Column({ name: 'target_reps', type: 'int', nullable: true })
    targetReps: number | null;

    @Column({ name: 'target_weight_kg', type: 'float', nullable: true })
    targetWeightKg: number | null;

    @Column({ name: 'target_duration_min', type: 'int', nullable: true })
    targetDurationMin: number | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    // ROUTINE_EXERCISE ||--o{ ACTIVITY_EXERCISE : executed_as
    @OneToMany(() => ActivityExercise, (activityExercise) => activityExercise.routineExercise)
    activityExercises: ActivityExercise[];
}
