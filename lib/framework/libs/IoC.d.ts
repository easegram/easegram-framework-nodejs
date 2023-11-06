import "reflect-metadata";
import { Constructor } from "./Class";
export declare function ModuleInst(id?: string, ...args: Array<any>): (target: any) => any;
export declare function ModuleField<T>(idOrType?: string | Constructor<T>): (target: any, targetKey: string) => void;
export declare class IoC {
    metamap: Map<string, any>;
    objects: Map<string, any>;
    load(home: string): void;
    install(id: string, clazz: any, args: Array<any>): void;
    get<T>(idOrType: string | Constructor<T>): T;
}
