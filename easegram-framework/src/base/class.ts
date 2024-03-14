import fs from "fs";

export type Constructor<T = any> = new (...args: any[]) => T;

export interface Class {
    new(...args: any[])
}

export namespace Class {
    export const scan = async(home: string) : Promise<Array<Constructor>> => {
        const fileList = fs.readdirSync(home);

        const classList: Array<Constructor> = [];
        for (const fileName of fileList) {
            const filePath = `${home}${fileName}`;
            const fileStat = fs.statSync(filePath);

            if(fileStat.isFile()) {
                if (!(/\.js$/.test(fileName))) {
                    continue;
                }
                if(fileName === 'app.js') {
                    continue;
                }
                const exports = await import(filePath);
                for (const key in exports) {
                    const clazz = exports[key];
                    if (typeof clazz === 'function') {
                        classList.push(clazz);
                    }
                }
            }
            else if(fileStat.isDirectory()) {
                const subClassList = await scan(`${filePath}/`);
                for(const clazz of subClassList) {
                    classList.push(clazz);
                }
            }
        }

        return classList;
    }
}
