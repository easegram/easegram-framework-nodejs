import { http } from "../../base"
import { Module } from "../app/Module";

export interface HttpServiceOptions {
    args: http.WebAppArgs;
    routes: { [route: string]: { method: 'get'|'post', handler: (body: any)=>Promise<any> } }
}

export class HttpServiceModule extends Module {
    private readonly _options: HttpServiceOptions;

    constructor(options: HttpServiceOptions) {
        super();
        this._options = options;
    }

    public async ready() {
        await super.ready();

        const app = http.webapp(this._options.args);
        app.route(router=> {
            const routes = this._options.routes;
            for(const key in routes) {
                const {method, handler} = routes[key];
                router[method](key, http.handler(handler));
            }
        });

        app.start();
    }
}
