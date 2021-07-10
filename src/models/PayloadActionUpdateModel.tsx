export interface PayloadActionUpdateModel<N, T> {
    type: string,
    payload: {
        current: N,
        new: T,
    }
}
