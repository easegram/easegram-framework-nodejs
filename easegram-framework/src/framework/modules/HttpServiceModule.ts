import { http } from "../../base"
import { Module } from "../app/Module";
import {Constructor} from "../app/Class";


const $_HTTP = "@HTTP";

export const HTTP = function(method: string, path: string): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        const targetClazz = target.constructor;

        let mappings = {};
        if (Reflect.hasOwnMetadata($_HTTP, targetClazz)) {
            mappings = Reflect.getMetadata($_HTTP, targetClazz);
        }

        mappings[path] = { method, path, handler: target };

        Reflect.defineMetadata($_HTTP, mappings, targetClazz);
    };
};

export const GET = function(path: string): MethodDecorator {
    return HTTP('get', path);
};

export const POST = function(path: string): MethodDecorator {
    return HTTP('post', path);
};

export interface HttpServiceOptions {
    args: http.WebAppArgs;
}

export class HttpServiceModule extends Module {
    private readonly _options: HttpServiceOptions;
    private readonly _handlers: Array<Constructor<Module>> = [];

    constructor(options: HttpServiceOptions) {
        super();
        this._options = options;
    }

    public async ready() {
        await super.ready();

        const app = http.webapp(this._options.args);
        app.route(router=> {
            for(const handler of this._handlers) {
                const mappings = Reflect.getMetadata($_HTTP, handler);
                for(const path in mappings) {
                    const mapping = mappings[path];
                    if(!mapping) {
                        continue;
                    }
                    const {method, handler} = mapping;
                    router[method](path, http.handler(handler));
                }
            }
        });

        app.start();
    }

    public route(handlerClazz: Constructor<Module>):void {
        this._handlers.push(handlerClazz);
    }
}
