
import * as base from "../../base"
import { Constructor, IoC } from "../../base";
import { EventEmitter } from "events";

export interface ApplicationOptions {
    name: string;
    modulePaths: string[];
}

export enum AppEvents {
    Init = 'init',
    Ready = 'ready',
    Tick = 'tick',
    Quit = 'quit',
}

export class Application {
    readonly options: ApplicationOptions;
    readonly events: EventEmitter;
    readonly container: IoC.Container;

    running: boolean = false;
    elapse: number = 1.0 / 30;

    private _time = 0;

    constructor(options: ApplicationOptions) {
        this.options = options;
        this.events = new EventEmitter();
        this.container = new IoC.Container();

        this.running = true;

        base.log.init(options.name);
    }

    public async run(): Promise<void> {
        const options = this.options;

        console.log(`app '${options.name}' init...`);
        this.events.emit(AppEvents.Init);

        for(const p of options.modulePaths) {
            await this.container.load(`${process.cwd()}/${p}`);
        }

        this.events.emit(AppEvents.Ready);
        await new Promise<void>((resolve, reject)=>{
            let last = Date.now();
            const poll = ()=>{
                if(!this.running) {
                    return resolve();
                }

                const now = Date.now();
                const delta = (now - last) / 1000.0;
                if (delta >= this.elapse) {
                    last = now;
                    this._time += delta;
                    this.events.emit(AppEvents.Tick, delta);
                }

                process.nextTick(poll);
            }

            process.nextTick(poll);
        });

        this.events.emit(AppEvents.Quit);
        console.log(`app '${this.name}' quit.`);
    }

    public get name(): string {
        return this.options.name;
    }

    public get time(): number {
        return this._time;
    }

    public install<T>(id: string, clazz: Constructor<T>, ...args: Array<any>) {
        this.container.install(id, clazz, args);
    }

    public get<T>(idOrType: string | Constructor<T>): T {
        return this.container.get(idOrType);
    }
}
