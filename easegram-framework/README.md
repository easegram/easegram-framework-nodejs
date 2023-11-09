# @easegram/framework

## Get Start
### Install
```shell
npm install @easegram/framework --save
```
### Setup App

```typescript
import {AppEvents, Application} from "@easegram/framework"

const main = async () => {
    const app = new Application({
        name: "test-app",
        modulePaths: ["dist/"]
    })

    app.events.on(AppEvents.Init, ()=>{
        console.log(`app init.`)
    })
    
    app.events.on(AppEvents.Ready, ()=>{
        console.log(`app ready.`)
    })
    
    app.events.on(AppEvents.Quit, ()=>{
        console.log(`app quit.`)
    })
    
    app.events.on(AppEvents.Tick, (delta: number)=>{
        console.log(`app running: ${app.time}`)
    })

    await app.run()
}

main();
```
### IoC
* Define a IoC object
```typescript
import { IocDefine } from "@easegram/framework";

@IocDefine() // Define a object named 'A'.
@IocDefine('Instance-A') // Define a object named 'Instance-A'.
export class A {
    
}

//...
{
    const a = app.container.get('A')
    const instance = app.container.ge('Instance-A');
}
```
* IoC object and field injections.
```typescript
import { IocDefine, IocInject } from "@easegram/framework";


@IocDefine() // Define a object named 'A'.
@IocDefine('Instance-A') // Define a object named 'Instance-A'.
export class A {

}

@IocDefine() // Define a object named 'B'.
export class B {
    @IocInject() // Inject value with the object 'A'.
    private a: A;
    
    @IocInject('Instance-A') // Inject value with the object 'Instance-A'.
    private instanceA: A;

    start() {
        console.log(this.a);
        console.log(this.instanceA);
    }
}
```
### Http Service
```typescript
import {AppEvents, Application, IocDefine} from "@easegram/framework"
import {HttpService, HttpServiceOptions, HttpGet} from "@easegram/framework";

/**
 * Define a http route handler class
 * */
@IocDefine
class Hello {

    // Define a route handler
    // It is equivalent to: koa.router.get('/hello', http.handler(hello))
    @HttpGet('/hello')
    async hello({name}) {
        return `hello ${name}`
    }
    
}

// In main function
app.events.on(AppEvents.Ready, () => {
    // Install HttpService with args
    app.install('http', HttpService, {
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

    // Construct and Get HttpService instance
    app.get<HttpService>('http');
})
```

## For Developers

### Build
```shell
npm run build
```

### Publish
```shell
npm run publish
```
## License
MIT License
