
import {App, AppEvents} from "@easegram/framework"
import {Serv} from "./serv";

const main = async()=> {
    console.log("startup")

    const app = new App({
        name:"test-app",
        features: {
            config: true,
            http: true,
        },
        paths: [
            `dist/serv/`,
        ]
    });

    app.events.on(AppEvents.Ready, async()=> {
        console.log(`App ready.`);
        const serv = await app.get(Serv);
        serv.start();
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
