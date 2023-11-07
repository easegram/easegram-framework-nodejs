# @easegram/framework

## For Users
### Install
```shell
npm install @easegram/framework --save
```
### A simple app
```typescript
import { Application } from "@easegram/framework"

const main = async()=> {
    const app = new Application({
        name:"test-app",
        modulePaths: ["dist/"]
    });

    await app.run();

    // Do something
    // ...
}

main();
```
### Modules
* A simple module
```typescript
import { Module, ModuleInst } from "@easegram/framework";

@ModuleInst()
export class A extends Module {
}
```
* A module contains injected fields.
```typescript
import { Module, ModuleInst, ModuleField } from "@easegram/framework";

@ModuleInst()
export class A extends Module {

}

@ModuleInst()
export class B extends Module {
    @ModuleField(A)
    private a: A;

    async ready() {
        console.log(this.a);
    }
}
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
