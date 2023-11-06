"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpServiceModule = void 0;
const base_1 = require("../../base");
const Module_1 = require("../app/Module");
class HttpServiceModule extends Module_1.Module {
    _options;
    constructor(options) {
        super();
        this._options = options;
    }
    async ready() {
        await super.ready();
        const app = base_1.http.webapp(this._options.args);
        app.route(router => {
            const routes = this._options.routes;
            for (const key in routes) {
                const { method, handler } = routes[key];
                router[method](key, base_1.http.handler(handler));
            }
        });
        app.start();
    }
}
exports.HttpServiceModule = HttpServiceModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSHR0cFNlcnZpY2VNb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZnJhbWV3b3JrL21vZHVsZXMvSHR0cFNlcnZpY2VNb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQWlDO0FBQ2pDLDBDQUF1QztBQU92QyxNQUFhLGlCQUFrQixTQUFRLGVBQU07SUFDeEIsUUFBUSxDQUFxQjtJQUU5QyxZQUFZLE9BQTJCO1FBQ25DLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDNUIsQ0FBQztJQUVNLEtBQUssQ0FBQyxLQUFLO1FBQ2QsTUFBTSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFcEIsTUFBTSxHQUFHLEdBQUcsV0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFBLEVBQUU7WUFDZCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUNwQyxLQUFJLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRTtnQkFDckIsTUFBTSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3RDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsV0FBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQzlDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBdEJELDhDQXNCQyJ9