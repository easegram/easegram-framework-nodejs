"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleManager = exports.Module = void 0;
const base_1 = require("../../base");
class Module {
    _name;
    constructor(name) {
        this._name = name || this.constructor.name;
    }
    get name() {
        return this._name;
    }
    async init() {
    }
    async ready() {
    }
    async quit() {
    }
}
exports.Module = Module;
class ModuleManager {
    modules = new Map();
    constructor() {
    }
    async init() {
        for (let entry of this.modules) {
            await entry[1].init();
        }
    }
    async ready() {
        for (let entry of this.modules) {
            await entry[1].ready();
        }
    }
    async quit() {
        for (let entry of this.modules) {
            await entry[1].quit();
        }
    }
    install(m) {
        const mod = this.modules.get(m.name);
        if (mod) {
            throw (0, base_1.error)(`ERR_INSTALL_MODULE_FAILED`, `Install module failed.`);
        }
        this.modules.set(m.name, m);
    }
    select(nameOrType) {
        if (typeof (nameOrType) === 'string') {
            const m = this.modules.get(nameOrType);
            return m;
        }
        else {
            const m = this.modules.get(nameOrType.name);
            return m;
        }
    }
}
exports.ModuleManager = ModuleManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ZyYW1ld29yay9hcHAvTW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFtQztBQUduQyxNQUFhLE1BQU07SUFDUCxLQUFLLENBQVM7SUFFdEIsWUFBWSxJQUFhO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO0lBQy9DLENBQUM7SUFFRCxJQUFXLElBQUk7UUFDWCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFJO0lBRWpCLENBQUM7SUFFTSxLQUFLLENBQUMsS0FBSztJQUVsQixDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUk7SUFFakIsQ0FBQztDQUNKO0FBdEJELHdCQXNCQztBQUVELE1BQWEsYUFBYTtJQUNkLE9BQU8sR0FBd0IsSUFBSSxHQUFHLEVBQWtCLENBQUM7SUFFakU7SUFFQSxDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUk7UUFDYixLQUFJLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDM0IsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDekI7SUFDTCxDQUFDO0lBRU0sS0FBSyxDQUFDLEtBQUs7UUFDZCxLQUFJLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDM0IsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDMUI7SUFDTCxDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUk7UUFDYixLQUFJLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDM0IsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDekI7SUFDTCxDQUFDO0lBRU0sT0FBTyxDQUFDLENBQVM7UUFDcEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLElBQUcsR0FBRyxFQUFFO1lBQ0osTUFBTSxJQUFBLFlBQUssRUFDUCwyQkFBMkIsRUFDM0Isd0JBQXdCLENBQzNCLENBQUM7U0FDTDtRQUVELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVNLE1BQU0sQ0FBbUIsVUFBbUM7UUFDL0QsSUFBRyxPQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssUUFBUSxFQUFFO1lBQ2hDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3ZDLE9BQU8sQ0FBTSxDQUFDO1NBQ2pCO2FBQ0k7WUFDRCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDM0MsT0FBTyxDQUFNLENBQUM7U0FDakI7SUFDTCxDQUFDO0NBQ0o7QUEvQ0Qsc0NBK0NDIn0=