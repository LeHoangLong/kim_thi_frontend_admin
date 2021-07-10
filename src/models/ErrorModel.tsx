export enum EErrorLevel {
    INFO,
    WARNING,
    ERROR,
}

export interface ErrorModel {
    id?: string,
    message: string,
    level: EErrorLevel,
    timeMs: number,
}