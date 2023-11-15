
import {AppEvents, Application, HttpService} from "@easegram/framework"
import {Hello} from "./modules";

const main = async()=> {
    console.log("startup")

    const app = new Application({
        name:"test-app",
        modulePaths: [
            `dist/`,
        ]
    });

    app.events.on(AppEvents.Ready, ()=>{
        app.define('http', HttpService, {
            args: {
                name: 'http',
                host: '0.0.0.0',
                port: 80,
                log: true,
                cors: true,
                proxy: false
            },
            routes: [Hello]
        });

        const http = app.get<HttpService>('http');
        http.start();
    });

    let accumulance = 0;
    app.events.on(AppEvents.Tick, (delta)=>{
        accumulance += delta;
        if(accumulance >= 60.0) {
            console.log(`app running: ${app.time}`);
            accumulance = 0;
        }
    })

    await app.run();

    console.log("all shutdown")
}

main();
