
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
        const routes = [Hello];
        this.http.start(args, routes);
    }
}
