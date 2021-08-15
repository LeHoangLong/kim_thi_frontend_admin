export async function delay(delayMs: number) : Promise<boolean> {
    return await new Promise(resolve => setTimeout(() => resolve(true), delayMs))
}