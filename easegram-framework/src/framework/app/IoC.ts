
import "reflect-metadata";
import {Class, Constructor} from "./Class";

/**
 * 标注一个模块实例，指定它在 IoC 容器中的 id 和 参数。
 * @ModuleInst("moduleName", ...args)
 * */

const $_ModuleInst: string = '@ModuleInst';
export function ModuleInst(id?: string, ...args: Array<any>) : ClassDecorator {
    return target => {
        const metadata = {id: id || target.name, args: args || []};
        Reflect.defineMetadata($_ModuleInst, metadata, target);
        return target;
    };
}

/**
 *
 * */
const $_ModuleField: string = '@ModuleFields';
export function ModuleField<T>(idOrType?: string | Constructor<T>) {
    return function (target: any, targetKey: string) {

        let id = targetKey;
        if(idOrType) {
            id = typeof (idOrType) === 'string' ? idOrType : idOrType.name;
        }

        const targetClazz = target.constructor;

        let fields = {};
        if (Reflect.hasOwnMetadata($_ModuleField, targetClazz)) {
            fields = Reflect.getMetadata($_ModuleField, targetClazz);
        }

        fields[targetKey] = { id };

        Reflect.defineMetadata($_ModuleField, fields, targetClazz);
    };
}

export class IoC {
    metamap: Map<string, any> = new Map<string, any>();
    objects: Map<string, any> = new Map<string, any>();

    /**
     * Load @ModuleInst metadata from the directory indicated by home.
     * */
    public async load(home: string) {
        const classList = await Class.scan(home);
        for(const clazz of classList) {
            const metadata = Reflect.getMetadata($_ModuleInst, clazz);
            if (metadata) {
                this.install(metadata.id || clazz.name, clazz, metadata.args);
            }
        }
    }

    public install(id: string, clazz: any, args: Array<any>) {
        this.metamap.set(id, {clazz: clazz, args: args || []});
    }

    public get<T>(idOrType: string | Constructor<T>) : T {
        if(!idOrType) {
            return null;
        }

        let id = typeof(idOrType) === 'string' ? idOrType : idOrType.name;
        let obj = this.objects.get(id);
        if(obj) {
            return obj as T;
        }

        const metadata = this.metamap.get(id);
        if(!metadata) {
            console.error(`IoC: Can't find metadata of '${id}'`);
            return null;
        }

        const { clazz, args } = metadata;
        const inst = Reflect.construct(clazz, args);

        const fields = Reflect.getMetadata($_ModuleField, clazz);
        for (let f in fields) {
            // 递归注入 inst 的属性
            console.log(`IoC: inject field '${id}.${f}'.`)
            inst[f] = this.get(fields[f].id);
        }

        return inst as T;
    }
}
