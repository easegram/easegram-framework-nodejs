import {HttpGet, IocDefine, IocInject} from "@easegram/framework";

@IocDefine()
export class A {

}

@IocDefine()
export class Hello {
    @IocInject()
    a: A;

    @HttpGet('/hello')
    async hello({name}): Promise<any> {
        return `Hello ${name}`;
    }
}
