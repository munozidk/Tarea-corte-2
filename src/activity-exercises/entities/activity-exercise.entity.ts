import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ActivityLog } from '../../activity-logs/entities/activity-log.entity';
import { RoutineExercise } from '../../routine-exercises/entities/routine-exercise.entity';

/**
 * ACTIVITY_EXERCISE: lo que el usuario REALMENTE hizo en un ejercicio durante una sesión.
 * Se compara contra las metas (target*) del RoutineExercise para ver la diferencia plan vs. real.
 */
@Entity('activity_exercises')
export class ActivityExercise {
    @PrimaryGeneratedColumn()
    id!: number;

    // Si se borra la sesión, se borra su detalle
    @ManyToOne(() => ActivityLog, (activityLog) => activityLog.activityExercises, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'activity_log_id' })
    activityLog!: ActivityLog;

    // SET NULL: si se edita la rutina y se quita ese ejercicio, el registro histórico se conserva
    @ManyToOne(() => RoutineExercise, (routineExercise) => routineExercise.activityExercises, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'routine_exercise_id' })
    routineExercise!: RoutineExercise | null;

    @Column({ name: 'actual_sets', type: 'int', nullable: true })
    actualSets!: number | null;

    @Column({ name: 'actual_reps', type: 'int', nullable: true })
    actualReps!: number | null;

    @Column({ name: 'actual_weight_kg', type: 'float', nullable: true })
    actualWeightKg!: number | null;

    @Column({ name: 'actual_duration_min', type: 'int', nullable: true })
    actualDurationMin!: number | null;

    @Column({ name: 'calories_burned', type: 'float', nullable: true })
    caloriesBurned!: number | null;

    @Column({ name: 'distance_covered_km', type: 'float', nullable: true })
    distanceCoveredKm!: number | null;

    @Column({ name: 'started_at', type: 'timestamp', nullable: true })
    startedAt!: Date | null;

    @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
    completedAt!: Date | null;
}
