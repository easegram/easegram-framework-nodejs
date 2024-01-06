import {http, Constructor, IoC, IocDefine, IocInject} from "../../base";

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

    private args: http.WebAppArgs;
    private app: http.WebApp;

    create(args: http.WebAppArgs) : void {
        this.args = args;
        this.app = http.webapp(args);
    }

    use(midware: http.WebMiddleWare): void {
        this.app.use(midware);
    }

    routesWithFunc(func: (router)=>void): void {
        this.app.route(func);
    }

    routesWithClazz(...clazzList: Constructor[]): void {
        if(!clazzList || !clazzList.length) {
            return;
        }

        const container = this.container;
        this.app.route(async router => {
                for (const clazz of clazzList) {
                    const target = await container.get(clazz);

                    const mappings = Reflect.getMetadata($_HTTP, clazz);
                    for (const path in mappings) {
                        const mapping = mappings[path];
                        if (!mapping) {
                            continue;
                        }
                        const {method, handler} = mapping;
                        router[method](path, http.handler(target[handler].bind(target)));
                        console.log(`http service '${this.args.name}' setup route [${method.toUpperCase()}] ${path}`);
                    }
                }

        });
    }

    start() {
        this.app.start();
    }
}
