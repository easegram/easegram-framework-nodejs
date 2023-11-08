
import {AppEvents, Application, HttpService} from "@easegram/framework"
import {A, Hello} from "./modules";

const main = async()=> {
    console.log("startup")

    const app = new Application({
        name:"test-app",
        modulePaths: [
            `dist/`,
        ]
    });

    app.events.on(AppEvents.Ready, ()=>{
        app.install('http', HttpService, {
            args: {
                name: 'http',
                host: '0.0.0.0',
                port: 80,
                log: true,
                cors: true,
                proxy: false
            },
            routes: {Hello}
        });

        const a = app.get(A);
        console.log(a);
        const hello = app.get(Hello);
        console.log(hello);
    });

    app.events.on(AppEvents.Tick, (delta)=>{
        console.log(`app running: ${delta}`);
        if(app.time >= 10) {
            app.running = false;
        }
    })

    await app.run();

    console.log("all shutdown")
}

main();
