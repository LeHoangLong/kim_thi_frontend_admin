export enum EErrorLevel {
    INFO,
    WARNING,
    ERROR,
}

export interface ErrorModel {
    message: string,
    level: EErrorLevel,
    time: Date,
}