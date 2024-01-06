
import {HttpService, IocDefine, IocInject, Config} from "@easegram/framework";
import {Hello} from "./serv-hello";

@IocDefine()
export class Serv {

    @IocInject()
    config: Config;

    @IocInject()
    http: HttpService = null;

    public start() {
        const args = this.config['http'];

        this.http.create(args);

        this.http.use((ctx, next)=>{
            return next();
        });

        // Setup routes by functions
        this.http.routesWithFunc((router)=>{
            router.all("/", async(ctx, next)=>{
                ctx.body = 'Hello World.';
            });
        });

        // Setup routes by clazz
        const routes = [Hello];
        this.http.routesWithClazz(...routes);

        this.http.start();
    }
}
