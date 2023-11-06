
import "reflect-metadata";
import fs from "fs";
import {Constructor} from "./Class";

/**
 * 标注一个 ModuleClass，指定它在 IoC 容器中的 id 和 参数。
 * @ModuleClass("moduleName", ...args)
 * */

const MODULE_INST_ANNOTATION: string = 'ModuleInstAnnotation';
export function ModuleInst(id?: string, ...args: Array<any>) {
    return function (target: any) {
        const metadata = {id: id || target.name, args: args || []};
        Reflect.defineMetadata(MODULE_INST_ANNOTATION, metadata, target);
        return target;
    };
}

/**
 *
 * */
const INJECT_FIELD_ANNOTATION: string = 'InjectFieldAnnotation';
export function ModuleField<T>(idOrType?: string | Constructor<T>) {
    return function (target: any, targetKey: string) {

        let id = targetKey;
        if(idOrType) {
            id = typeof (idOrType) === 'string' ? idOrType : idOrType.name;
        }

        const targetClazz = target.constructor;

        let fields = {};
        if (Reflect.hasOwnMetadata(INJECT_FIELD_ANNOTATION, targetClazz)) {
            fields = Reflect.getMetadata(INJECT_FIELD_ANNOTATION, targetClazz);
        }

        fields[targetKey] = { id };

        Reflect.defineMetadata(INJECT_FIELD_ANNOTATION, fields, targetClazz);
    };
}

export class IoC {
    metamap: Map<string, any> = new Map<string, any>();
    objects: Map<string, any> = new Map<string, any>();

    public load(home: string) {
        const fileList = fs.readdirSync(home);
        console.log(fileList)
        for (const file of fileList) {
            if (!(/\.js$/.test(file))) {
                continue;
            }
            if(file === 'app.js') {
                continue;
            }

            const exports = require(`${home}${file}`);
            for (const key in exports) {
                const module = exports[key];
                if (typeof module === 'function') {
                    const metadata = Reflect.getMetadata(MODULE_INST_ANNOTATION, module);
                    if (metadata) {
                        this.install(metadata.id || module.name, module, metadata.args);
                    }
                }
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

        const fields = Reflect.getMetadata(INJECT_FIELD_ANNOTATION, clazz);
        for (let f in fields) {
            // 递归注入 inst 的属性
            console.log(`IoC: inject field '${id}.${f}'.`)
            inst[f] = this.get(fields[f].id);
        }

        return inst as T;
    }
}
