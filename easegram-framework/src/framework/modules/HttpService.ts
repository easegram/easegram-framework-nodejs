import { http, Constructor, IocDefine } from "../../base"


const $_HTTP = "@HTTP";

export const HttpRoute = function(method: string, path: string): MethodDecorator {
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

export const HttpGet = function(path: string): MethodDecorator {
    return HttpRoute('get', path);
};

export const HttpPost = function(path: string): MethodDecorator {
    return HttpRoute('post', path);
};

export interface HttpServiceOptions {
    args: http.WebAppArgs;
    routes: Array<Constructor<Object>>;
}

@IocDefine()
export class HttpService {
    readonly options: HttpServiceOptions;

    constructor(options: HttpServiceOptions) {
        this.options = options;

        const app = http.webapp(options.args);

        const routes = options.routes;
        if(routes && routes.length > 0) {
            app.route(router => {
                for (const handler of routes) {
                    const mappings = Reflect.getMetadata($_HTTP, handler);

                    for (const path in mappings) {
                        const mapping = mappings[path];
                        if (!mapping) {
                            continue;
                        }
                        const {method, handler} = mapping;
                        router[method](path, http.handler(handler));
                    }
                }
            });
        }

        app.start();
    }
}
