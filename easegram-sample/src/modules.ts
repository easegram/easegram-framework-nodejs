import { IocDefine, IocInject } from "@easegram/framework";

@IocDefine()
export class A {

}

@IocDefine()
export class Hello {
    @IocInject()
    a: A;
}
