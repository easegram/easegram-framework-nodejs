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