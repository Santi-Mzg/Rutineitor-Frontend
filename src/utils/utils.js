export const arrayReps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, "RIR 2", "RIR 1", "Max"];
export const arrayTime = [15, 30, 60, 90, 120, "Max"];
export const arrayWeights = ["Libre", "Banda", 2.5, 5, 7.5, 10, 12, 15, 17.5, 20, 22.5, 25, 27.5, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 130, 140, 150, 160, 170, 180, 190, 200];


export const arrayTypes = ["Empuje", "Tire", "Pierna", "Skills", "Movilidad", "Core", "Potencia", "Cardio"].map(type => ({
    label: type,
    value: type
}));

export const arraySeries = [1, 2, 3, 4, 5, 6].map(number => ({
    label: number.toString(),
    value: number
}))

export const formatDate = date => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
};