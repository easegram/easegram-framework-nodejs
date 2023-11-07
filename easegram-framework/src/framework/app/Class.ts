
export type Constructor<T = any> = new (...args: any[]) => T;

export interface Class {
    new(...args: any[])
}
