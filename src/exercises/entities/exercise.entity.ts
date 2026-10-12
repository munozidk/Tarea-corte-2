import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RoutineExercise } from '../../routine-exercises/entities/routine-exercise.entity';

/**
 * EXERCISE: catálogo general de ejercicios (flexiones, sentadillas, correr...).
 * No pertenece a ningún usuario; las rutinas lo referencian a través de RoutineExercise.
 */
@Entity('exercises')
export class Exercise {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ length: 50 }) // strength, cardio, core, flexibility...
    type: string;

    @Column({ name: 'estimated_calories', type: 'float', nullable: true })
    estimatedCalories: number | null;

    @Column({ name: 'estimated_distance_km', type: 'float', nullable: true })
    estimatedDistanceKm: number | null;

    @Column({ name: 'estimated_duration_min', type: 'int', nullable: true })
    estimatedDurationMin: number | null;

    @Column({ type: 'varchar', length: 255, nullable: true }) // tipo explícito: con `string | null` TS no lo infiere
    icon: string | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    // EXERCISE ||--o{ ROUTINE_EXERCISE : used_in
    @OneToMany(() => RoutineExercise, (routineExercise) => routineExercise.exercise)
    routineExercises: RoutineExercise[];
}
