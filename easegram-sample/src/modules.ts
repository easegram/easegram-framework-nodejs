import {HttpGet, IocDefine, IocInject} from "@easegram/framework";

@IocDefine()
export class A {
    text: string = 'A'
}

@IocDefine()
export class Hello {
    @IocInject()
    a: A;

    @HttpGet('/hello')
    async hello({name}): Promise<string> {
        return `Hello ${name} ${this.a.text}`;
    }
}
