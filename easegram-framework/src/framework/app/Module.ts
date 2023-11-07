import { error } from "../../base";
import { Constructor} from "./Class"

export class Module {
    private _name: string;

    constructor(name?: string) {
        this._name = name || this.constructor.name;
    }

    public get name(): string {
        return this._name;
    }

    public async init(): Promise<void> {

    }

    public async ready(): Promise<void> {

    }

    public async quit(): Promise<void> {

    }
}

export class ModuleManager {
    private modules: Map<string, Module> = new Map<string, Module>();

    constructor() {

    }

    public async init(): Promise<void> {
        for(let entry of this.modules) {
            await entry[1].init();
        }
    }

    public async ready(): Promise<void> {
        for(let entry of this.modules) {
            await entry[1].ready();
        }
    }

    public async quit(): Promise<void> {
        for(let entry of this.modules) {
            await entry[1].quit();
        }
    }

    public install(m: Module) {
        const mod = this.modules.get(m.name);
        if(mod) {
            throw error(
                `ERR_INSTALL_MODULE_FAILED`,
                `Install module failed.`
            );
        }

        this.modules.set(m.name, m);
    }

    public select<T extends Module>(nameOrType: string | Constructor<T>): T {
        if(typeof(nameOrType) === 'string') {
            const m = this.modules.get(nameOrType);
            return m as T;
        }
        else {
            const m = this.modules.get(nameOrType.name)
            return m as T;
        }
    }
}
