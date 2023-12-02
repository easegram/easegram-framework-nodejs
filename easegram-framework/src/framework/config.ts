import fs from 'fs';
import path from 'path';
import { IocDefine } from "../base";

@IocDefine()
export class Config {
    [key: string]:any;

    async init(): Promise<any> {
        const argsPath = path.join(process.cwd(), `data/app-${process.env.NODE_ENV}.json`);
        if (!fs.existsSync(argsPath)) {
            throw new Error(`Invalid args file: '${argsPath}' because it is not found.`);
        }
        const argsData = await import(argsPath);
        for(const key in argsData) {
            this[key] = argsData[key];
        }
    }
}