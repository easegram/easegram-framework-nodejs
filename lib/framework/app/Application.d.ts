import { Constructor } from '../libs/Class';
export interface ApplicationOptions {
    name: string;
    modulePaths: string[];
}
export declare class Application {
    private _options;
    private _running;
    private _ioc;
    constructor(options: ApplicationOptions);
    run(): Promise<void>;
    get name(): string;
    get running(): boolean;
    set running(value: boolean);
    get<T>(idOrType: string | Constructor<T>): T;
}
