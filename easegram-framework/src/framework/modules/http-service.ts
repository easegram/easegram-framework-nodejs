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

@IocDefine()
export class HttpService {
    @IocInject()
    private container: IoC.Container;

    start(args: http.WebAppArgs, routes: Constructor[]) {
        const container = this.container;

        const app = http.webapp(args);

        app.route(async router => {
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
                    const target = await container.get(clazz);
                    router[method](path, http.handler(target[handler].bind(target)));
                    console.log(`http service '${args.name}' setup route [${method.toUpperCase()}] ${path}`);
                }
            }
        });

        app.start();
    }
}