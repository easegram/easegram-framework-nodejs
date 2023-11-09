import { http, Constructor, IocDefine } from "../../base"


const $_HTTP = "@HTTP";

export const HttpRoute = function(method: string, path: string): MethodDecorator {
    return (target, key, descriptor) => {
        const targetOwnerClazz = target.constructor;

        let mappings = {};
        if (Reflect.hasOwnMetadata($_HTTP, targetOwnerClazz)) {
            mappings = Reflect.getMetadata($_HTTP, targetOwnerClazz);
        }

        mappings[path] = { method, path, handler: target[key] };
        Reflect.defineMetadata($_HTTP, mappings, targetOwnerClazz);
    };
};

export const HttpGet = function(path: string): MethodDecorator {
    return HttpRoute('get', path);
};

export const HttpPost = function(path: string): MethodDecorator {
    return HttpRoute('post', path);
};

export interface HttpServiceOptions {
    args: http.WebAppArgs;
    routes: Constructor<Object>[];
}

@IocDefine()
export class HttpService {
    readonly options: HttpServiceOptions;

    constructor(options: HttpServiceOptions) {
        this.options = options;

        const app = http.webapp(options.args);

        const routes = options.routes;

        app.route(router => {
            if(!routes || !routes.length) {
                return;
            }
            for(const clazz of routes) {
                const mappings = Reflect.getMetadata($_HTTP, clazz);
                for (const path in mappings) {
                    const mapping = mappings[path];
                    if (!mapping) {
                        continue;
                    }
                    const {method, handler} = mapping;
                    router[method](path, http.handler(handler));
                    console.log(`setup http route: ${method}=>${path}`);
                }
            }
        });

        app.start();
    }
}
