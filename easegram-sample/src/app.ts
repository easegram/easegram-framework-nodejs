
import {Application, HttpServiceModule} from "@easegram/framework"
import {A, B, Hello} from "./modules";

const main = async()=> {
    console.log("startup")

    const app = new Application({
        name:"test-app",
        modulePaths: ["dist/"]
    });
    await app.run();

    const a = app.get(A);
    console.log(a);
    const b = app.get(B);
    console.log(b);

    const http= new HttpServiceModule({
        args: {
            name: "http",
            host: "0.0.0.0",
            port: 80,
            log: true,
            cors: true,
            proxy: false
        }
    });

    http.handle(Hello);

    await http.ready();

    console.log("all shutdown")
}

main();
