export interface PayloadActionFetchedModel<T> {
    type: string,
    payload: {
        offset: number,
        objects: T[],
    }
}
