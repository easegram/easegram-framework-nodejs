
import * as base from "../../base"
import { IoC } from "./IoC";
import { Constructor } from './Class';

export interface ApplicationOptions {
    name: string;
    modulePaths: string[];
}

export class Application {
    private _options: ApplicationOptions;
    private _running: boolean;
    private _ioc: IoC;

    constructor(options: ApplicationOptions) {
        this._options = options;
        this._ioc = new IoC();
        this._running = true;

        base.log.init(options.name);
    }

    public async run(): Promise<void> {
        const options = this._options;

        console.log(`app '${options.name}' init...`);
        for(const p of options.modulePaths) {
            await this._ioc.load(`${process.cwd()}/${p}`);
        }

        const poll = ()=>{
            if(!this._running) {
                return;
            }

            // do something.

            process.nextTick(poll);
        }
        process.nextTick(poll);

        console.log(`app '${this.name}' quit.`);
    }

    public get name(): string {
        return this._options.name;
    }

    public get running(): boolean {
        return this._running;
    }
    
    public set running(value: boolean) {
        this._running = value;
    }

    public install(id: string, clazz: any, args: Array<any>) {
        this._ioc.install(id, clazz, args);
    }

    public get<T>(idOrType: string | Constructor<T>): T {
        return this._ioc.get(idOrType);
    }
}
