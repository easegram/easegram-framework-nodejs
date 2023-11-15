
import "reflect-metadata";
import { EventEmitter } from "events";
import {Class, Constructor} from "./class";

/**
 * 标注一个模块实例，指定它在 IoC 容器中的 id 和 参数。
 * @ModuleInst("moduleName", ...args)
 * */
export const $_IocDefine: string = '@IocDefine';
export function IocDefine(id?: string, ...args: Array<any>) : ClassDecorator {
    return target => {
        const metadata = {id: id || target.name, args: args || []};
        Reflect.defineMetadata($_IocDefine, metadata, target);
        return target;
    };
}

/**
 *
 * */
export const $_IocInject: string = '@IocInject';
export function IocInject(id?: string): PropertyDecorator  {
    return (target, key) : void => {
        const targetOwnerClazz = target.constructor;
        const targetTypeClazz = Reflect.getMetadata('design:type', target, key);

        let fields = {};
        if (Reflect.hasOwnMetadata($_IocInject, targetOwnerClazz)) {
            fields = Reflect.getMetadata($_IocInject, targetOwnerClazz);
        }

        if(!id) {
            id = targetTypeClazz.name;
        }

        fields[key] = { id, clazz: targetTypeClazz };

        Reflect.defineMetadata($_IocInject, fields, targetOwnerClazz);
    };
}

export namespace IoC {
    export enum Events {
        Install = 'install',
        Construct = 'construct'
    }

    export class Container {
        readonly metamap: Map<string, any> = new Map<string, any>();
        readonly objects: Map<string, any> = new Map<string, any>();

        readonly events: EventEmitter = new EventEmitter();

        /**
         * Load @ModuleInst metadata from the directory indicated by home.
         * */
        public async load(home: string) {
            console.log(`IoC: Load modules from '${home}'`);
            const classList = await Class.scan(home);
            for(const clazz of classList) {
                const metadata = Reflect.getMetadata($_IocDefine, clazz);
                if (metadata) {
                    this.define(metadata.id || clazz.name, clazz, metadata.args);
                }
            }
        }

        public define(id: string, clazz: any, args: Array<any>) {
            console.log(`IoC: Define metadata for '${id}'`)
            this.metamap.set(id, {clazz: clazz, args: args || []});
            this.events.emit(Events.Install, id, clazz, args);
        }

        public get<T>(idOrType: string | Constructor<T>) : T {
            if(!idOrType) {
                console.error(`IoC: Invalid object id.`);
                return null;
            }

            let id = typeof(idOrType) === 'string' ? idOrType : idOrType.name;
            console.log(`IoC: Get object '${id}'`);
            if(id === 'Container') {
                return this as unknown as T;
            }
            let obj = this.objects.get(id);
            if(obj) {
                return obj as T;
            }

            const metadata = this.metamap.get(id);
            if(!metadata) {
                console.error(`IoC: Can't find metadata '${id}'`);
                return null;
            }

            console.log(`IoC: Construct object '${id}'.`)
            const { clazz, args } = metadata;
            const inst = Reflect.construct(clazz, args);
            this.objects.set(id, inst)

            const fields = Reflect.getMetadata($_IocInject, clazz);
            for (let f in fields) {
                // 递归注入 inst 的属性
                console.log(`IoC: Inject field '${id}.${f}'.`)
                inst[f] = this.get(fields[f].id);
            }

            this.events.emit(Events.Construct, id, inst)

            return inst as T;
        }
    }
}
