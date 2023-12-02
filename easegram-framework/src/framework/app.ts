
import * as base from "../base"
import { Constructor, IoC } from "../base";
import { EventEmitter } from "events";
import { Config } from "./config";
import {HttpService} from "./modules/http-service";

export interface AppOptions {
    /**
     * 应用名称，将会作为日志标签及其他标记。
     * */
    name: string;

    /**
     * 特性开关
     * */
    features: {
        config?: boolean,
        http?: boolean,
    }

    /**
     * 对象列表。应用启动时，将自动在 IoC 容器中定义列表中的对象。
     * */
    objects?: {
        [id: string]: {
            clazz: Constructor,
            args?: Array<any>
        }
    };

    /**
     * 扫描路径列表。应用启动时，将自动扫描列表中的所有路径，并在容器中定义 @IocDefine 注解的对象。
     * */
    paths?: string[];
}

export enum AppEvents {
    Init = 'init',
    Ready = 'ready',
    Tick = 'tick',
    Quit = 'quit',
}

export class App {
    readonly options: AppOptions;
    readonly events: EventEmitter;
    readonly container: IoC.Container;

    running: boolean = false;
    elapse: number = 1.0 / 30;

    private _time = 0;

    constructor(options: AppOptions) {
        this.options = options;
        this.events = new EventEmitter();
        this.container = new IoC.Container();

        this.running = true;

        base.log.init(options.name);
    }

    public async run(): Promise<void> {
        const options = this.options;

        console.log(`App: '${options.name}' init...`);
        this.events.emit(AppEvents.Init);

        // Define internal features.
        const features = options.features;
        if(features) {
            features.config && this.container.define('Config', Config, []);
            features.http && this.container.define('HttpService', HttpService, []);
        }

        // Define objects
        for (const id in options.objects) {
            const info = options.objects[id];
            if (!info || !info.clazz) {
                continue;
            }
            console.log(`App: define object ${id}: ${info.clazz.name}`);
            this.container.define(id, info.clazz, info.args || [])
        }

        // Scan paths
        for (const path of options.paths) {
            if (!path) {
                continue;
            }
            console.log(`App: Load modules from '${path}'`);
            await this.container.load(`${process.cwd()}/${path}`);
        }

        console.log(`App: '${options.name}' ready...`);
        this.events.emit(AppEvents.Ready);
        await new Promise<void>((resolve, reject) => {
            let last = Date.now();

            setInterval(() => {
                if (!this.running) {
                    this.events.emit(AppEvents.Quit);
                    console.log(`app '${options.name}' quit...`);
                    return resolve();
                }

                const now = Date.now();
                const delta = (now - last) / 1000.0;
                if (delta >= this.elapse) {
                    last = now;
                    this._time += delta;
                    this.events.emit(AppEvents.Tick, delta);
                }

            }, this.elapse * 1000);
        });
    }

    public get name(): string {
        return this.options.name;
    }

    public get time(): number {
        return this._time;
    }

    public define<T>(id: string, clazz: Constructor<T>, ...args: Array<any>) {
        this.container.define(id, clazz, args);
    }

    public async get<T>(idOrType: string | Constructor<T>): Promise<T> {
        return await this.container.get(idOrType);
    }
}
