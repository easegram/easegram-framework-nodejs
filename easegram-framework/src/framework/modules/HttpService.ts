import {http, Constructor, IoC, IocDefine, IocInject} from "../../base"


const $_HTTP = "@HTTP";

export const HttpRoute = function(method: string, path: string): MethodDecorator {
    return (target, key, descriptor) => {
        const targetOwnerClazz = target.constructor;

        let mappings = {};
        if (Reflect.hasOwnMetadata($_HTTP, targetOwnerClazz)) {
            mappings = Reflect.getMetadata($_HTTP, targetOwnerClazz);
        }

        mappings[path] = { method, path, handler: key };
        Reflect.defineMetadata($_HTTP, mappings, targetOwnerClazz);

        return descriptor;
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

    @IocInject()
    private container: IoC.Container;

    constructor(options: HttpServiceOptions) {
        this.options = options;
    }

    start() {
        const container = this.container;
        const options = this.options;

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
                    const target = container.get(clazz);
                    router[method](path, http.handler(target[handler].bind(target)));
                    console.log(`http service '${options.args.name}' setup route [${method.toUpperCase()}] ${path}`);
                }
            }
        });

        app.start();
    }
}
