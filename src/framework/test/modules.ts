import { Module} from "../"
import {ModuleInst, ModuleField} from "../libs/IoC";

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