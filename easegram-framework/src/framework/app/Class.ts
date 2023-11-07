import fs from "fs";

export type Constructor<T = any> = new (...args: any[]) => T;

export interface Class {
    new(...args: any[])
}

export namespace Class {
    export const scan = async(home: string) : Promise<Array<Constructor>> => {
        const fileList = fs.readdirSync(home);
        console.log(fileList)

        const classList: Array<Constructor> = [];
        for (const file of fileList) {
            if (!(/\.js$/.test(file))) {
                continue;
            }
            if(file === 'app.js') {
                continue;
            }

            const exports = await import(`${home}${file}`);
            for (const key in exports) {
                const clazz = exports[key];
                if (typeof clazz === 'function') {
                    classList.push(clazz);
                }
            }
        }

        return classList;
    }
}
