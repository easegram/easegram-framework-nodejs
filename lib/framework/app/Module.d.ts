import { Constructor } from "../libs/Class";
export declare class Module {
    private _name;
    constructor(name?: string);
    get name(): string;
    init(): Promise<void>;
    ready(): Promise<void>;
    quit(): Promise<void>;
}
export declare class ModuleManager {
    private modules;
    constructor();
    init(): Promise<void>;
    ready(): Promise<void>;
    quit(): Promise<void>;
    install(m: Module): void;
    select<T extends Module>(nameOrType: string | Constructor<T>): T;
}
