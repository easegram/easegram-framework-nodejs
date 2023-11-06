"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoC = exports.ModuleField = exports.ModuleInst = void 0;
require("reflect-metadata");
const fs_1 = __importDefault(require("fs"));
/**
 * 标注一个 ModuleClass，指定它在 IoC 容器中的 id 和 参数。
 * @ModuleClass("moduleName", ...args)
 * */
const MODULE_INST_ANNOTATION = 'ModuleInstAnnotation';
function ModuleInst(id, ...args) {
    return function (target) {
        const metadata = { id: id || target.name, args: args || [] };
        Reflect.defineMetadata(MODULE_INST_ANNOTATION, metadata, target);
        return target;
    };
}
exports.ModuleInst = ModuleInst;
/**
 *
 * */
const INJECT_FIELD_ANNOTATION = 'InjectFieldAnnotation';
function ModuleField(idOrType) {
    return function (target, targetKey) {
        let id = targetKey;
        if (idOrType) {
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
exports.ModuleField = ModuleField;
class IoC {
    metamap = new Map();
    objects = new Map();
    load(home) {
        const fileList = fs_1.default.readdirSync(home);
        console.log(fileList);
        for (const file of fileList) {
            if (!(/\.js$/.test(file))) {
                continue;
            }
            if (file === 'app.js') {
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
    install(id, clazz, args) {
        this.metamap.set(id, { clazz: clazz, args: args || [] });
    }
    get(idOrType) {
        if (!idOrType) {
            return null;
        }
        let id = typeof (idOrType) === 'string' ? idOrType : idOrType.name;
        let obj = this.objects.get(id);
        if (obj) {
            return obj;
        }
        const metadata = this.metamap.get(id);
        if (!metadata) {
            console.error(`IoC: Can't find metadata of '${id}'`);
            return null;
        }
        const { clazz, args } = metadata;
        const inst = Reflect.construct(clazz, args);
        const fields = Reflect.getMetadata(INJECT_FIELD_ANNOTATION, clazz);
        for (let f in fields) {
            // 递归注入 inst 的属性
            console.log(`IoC: inject field '${id}.${f}'.`);
            inst[f] = this.get(fields[f].id);
        }
        return inst;
    }
}
exports.IoC = IoC;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW9DLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ZyYW1ld29yay9saWJzL0lvQy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSw0QkFBMEI7QUFDMUIsNENBQW9CO0FBR3BCOzs7S0FHSztBQUVMLE1BQU0sc0JBQXNCLEdBQVcsc0JBQXNCLENBQUM7QUFDOUQsU0FBZ0IsVUFBVSxDQUFDLEVBQVcsRUFBRSxHQUFHLElBQWdCO0lBQ3ZELE9BQU8sVUFBVSxNQUFXO1FBQ3hCLE1BQU0sUUFBUSxHQUFHLEVBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLElBQUksRUFBRSxFQUFDLENBQUM7UUFDM0QsT0FBTyxDQUFDLGNBQWMsQ0FBQyxzQkFBc0IsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDakUsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQU5ELGdDQU1DO0FBRUQ7O0tBRUs7QUFDTCxNQUFNLHVCQUF1QixHQUFXLHVCQUF1QixDQUFDO0FBQ2hFLFNBQWdCLFdBQVcsQ0FBSSxRQUFrQztJQUM3RCxPQUFPLFVBQVUsTUFBVyxFQUFFLFNBQWlCO1FBRTNDLElBQUksRUFBRSxHQUFHLFNBQVMsQ0FBQztRQUNuQixJQUFHLFFBQVEsRUFBRTtZQUNULEVBQUUsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7U0FDbEU7UUFFRCxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO1FBRXZDLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNoQixJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsdUJBQXVCLEVBQUUsV0FBVyxDQUFDLEVBQUU7WUFDOUQsTUFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsdUJBQXVCLEVBQUUsV0FBVyxDQUFDLENBQUM7U0FDdEU7UUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQztRQUUzQixPQUFPLENBQUMsY0FBYyxDQUFDLHVCQUF1QixFQUFFLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN6RSxDQUFDLENBQUM7QUFDTixDQUFDO0FBbkJELGtDQW1CQztBQUVELE1BQWEsR0FBRztJQUNaLE9BQU8sR0FBcUIsSUFBSSxHQUFHLEVBQWUsQ0FBQztJQUNuRCxPQUFPLEdBQXFCLElBQUksR0FBRyxFQUFlLENBQUM7SUFFNUMsSUFBSSxDQUFDLElBQVk7UUFDcEIsTUFBTSxRQUFRLEdBQUcsWUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ3JCLEtBQUssTUFBTSxJQUFJLElBQUksUUFBUSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtnQkFDdkIsU0FBUzthQUNaO1lBQ0QsSUFBRyxJQUFJLEtBQUssUUFBUSxFQUFFO2dCQUNsQixTQUFTO2FBQ1o7WUFFRCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUMxQyxLQUFLLE1BQU0sR0FBRyxJQUFJLE9BQU8sRUFBRTtnQkFDdkIsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM1QixJQUFJLE9BQU8sTUFBTSxLQUFLLFVBQVUsRUFBRTtvQkFDOUIsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDckUsSUFBSSxRQUFRLEVBQUU7d0JBQ1YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDbkU7aUJBQ0o7YUFDSjtTQUNKO0lBQ0wsQ0FBQztJQUVNLE9BQU8sQ0FBQyxFQUFVLEVBQUUsS0FBVSxFQUFFLElBQWdCO1FBQ25ELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFLEVBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFTSxHQUFHLENBQUksUUFBaUM7UUFDM0MsSUFBRyxDQUFDLFFBQVEsRUFBRTtZQUNWLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFFRCxJQUFJLEVBQUUsR0FBRyxPQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDbEUsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0IsSUFBRyxHQUFHLEVBQUU7WUFDSixPQUFPLEdBQVEsQ0FBQztTQUNuQjtRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUcsQ0FBQyxRQUFRLEVBQUU7WUFDVixPQUFPLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3JELE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFFRCxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQztRQUNqQyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUU1QyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLHVCQUF1QixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25FLEtBQUssSUFBSSxDQUFDLElBQUksTUFBTSxFQUFFO1lBQ2xCLGdCQUFnQjtZQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUM5QyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDcEM7UUFFRCxPQUFPLElBQVMsQ0FBQztJQUNyQixDQUFDO0NBQ0o7QUE3REQsa0JBNkRDIn0=