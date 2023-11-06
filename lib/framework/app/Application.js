"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const base = __importStar(require("../../base"));
const IoC_1 = require("../libs/IoC");
class Application {
    _options;
    _running;
    _ioc;
    constructor(options) {
        this._options = options;
        this._ioc = new IoC_1.IoC();
        this._running = true;
        base.log.init(options.name);
    }
    async run() {
        const options = this._options;
        console.log(`app '${options.name}' init...`);
        for (const p of options.modulePaths) {
            this._ioc.load(`${process.cwd()}/${p}`);
        }
        console.log(`app '${this.name}' quit.`);
    }
    get name() {
        return this._options.name;
    }
    get running() {
        return this._running;
    }
    set running(value) {
        this._running = value;
    }
    get(idOrType) {
        return this._ioc.get(idOrType);
    }
}
exports.Application = Application;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwbGljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZnJhbWV3b3JrL2FwcC9BcHBsaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLGlEQUFrQztBQUNsQyxxQ0FBa0M7QUFRbEMsTUFBYSxXQUFXO0lBQ1osUUFBUSxDQUFxQjtJQUM3QixRQUFRLENBQVU7SUFDbEIsSUFBSSxDQUFNO0lBRWxCLFlBQVksT0FBMkI7UUFDbkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFNBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBRXJCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRU0sS0FBSyxDQUFDLEdBQUc7UUFDWixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBRTlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxPQUFPLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQztRQUM3QyxLQUFJLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxXQUFXLEVBQUU7WUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUMzQztRQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsSUFBVyxJQUFJO1FBQ1gsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztJQUM5QixDQUFDO0lBRUQsSUFBVyxPQUFPO1FBQ2QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFDRCxJQUFXLE9BQU8sQ0FBQyxLQUFjO1FBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBQzFCLENBQUM7SUFFTSxHQUFHLENBQUksUUFBaUM7UUFDM0MsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0NBQ0o7QUF0Q0Qsa0NBc0NDIn0=