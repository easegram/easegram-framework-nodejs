export type Constructor<T extends {}> = new (...args: any[]) => T;
export interface Class {
    new (...args: any[]): any;
}
