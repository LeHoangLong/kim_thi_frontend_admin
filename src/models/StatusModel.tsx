export enum EStatus {
    INIT,
    IN_PROGRESS,
    IDLE,
    ERROR,
    SUCCESS
}

export interface StatusModel {
    status: EStatus,
    message?: string
}