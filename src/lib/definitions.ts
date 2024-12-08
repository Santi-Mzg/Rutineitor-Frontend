export type ExerciseType = {
    label: string;
    isometric: boolean;
    weighted: boolean;
    volume: string;
    weight: string;
}

export type BlockType = {
    series: number;
    exerciseList: ExerciseType[];
}

export type WorkoutType = {
    date: string;
    type: string;
    blockList: BlockType[];
    comments: string;
    modificable: boolean;
}