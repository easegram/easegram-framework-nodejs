"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const modules_1 = require("./modules");
const main = async () => {
    console.log("startup");
    const app = new __1.Application({
        name: "nodex-app-test",
        modulePaths: ["lib/test/"]
    });
    await app.run();
    const a = app.get(modules_1.A);
    console.log(a);
    const b = app.get(modules_1.B);
    console.log(b);
    console.log("all shutdown");
};
main();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ZyYW1ld29yay90ZXN0L2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDJCQUErQjtBQUMvQix1Q0FBK0I7QUFFL0IsTUFBTSxJQUFJLEdBQUcsS0FBSyxJQUFFLEVBQUU7SUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUN0QixNQUFNLEdBQUcsR0FBRyxJQUFJLGVBQVcsQ0FBQztRQUN4QixJQUFJLEVBQUMsZ0JBQWdCO1FBQ3JCLFdBQVcsRUFBRSxDQUFDLFdBQVcsQ0FBQztLQUM3QixDQUFDLENBQUM7SUFFSCxNQUFNLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUVoQixNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQUMsQ0FBQyxDQUFDO0lBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFZixNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQUMsQ0FBQyxDQUFDO0lBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFZixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQy9CLENBQUMsQ0FBQTtBQUVELElBQUksRUFBRSxDQUFDIn0=