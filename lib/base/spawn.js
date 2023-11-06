"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execSync = exports.exec = void 0;
const cross_spawn_1 = __importDefault(require("cross-spawn"));
/**
 * 执行一条命令
*/
async function exec(command, args, options) {
    options = options || {};
    return new Promise((resolve, reject) => {
        const stdout = [];
        const stderr = [];
        const spawned = (0, cross_spawn_1.default)(command, args, {
            cwd: options.cwd || process.cwd(),
            env: options.env || process.env,
        });
        spawned.stdout.on('data', (data) => {
            stdout.push(data);
        });
        spawned.stderr.on('data', (data) => {
            stderr.push(data);
        });
        spawned.on('error', (err) => {
            reject(err);
        });
        spawned.on('close', (exitcode) => {
            const stdoutStr = stdout.length > 0 ? Buffer.concat(stdout).toString('utf-8') : '';
            const stderrStr = stderr.length > 0 ? Buffer.concat(stderr).toString('utf-8') : '';
            resolve({
                stdout: stdoutStr,
                stderr: stderrStr,
                exitcode: exitcode,
            });
        });
    });
}
exports.exec = exec;
/**
 * 同步执行一调命令
*/
function execSync(command, args) {
    return cross_spawn_1.default.sync(command, args);
}
exports.execSync = execSync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Bhd24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmFzZS9zcGF3bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSw4REFBcUM7QUFrQ3JDOztFQUVFO0FBQ0ssS0FBSyxVQUFVLElBQUksQ0FBQyxPQUFlLEVBQUUsSUFBYyxFQUFFLE9BQXNCO0lBQzlFLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0lBRXhCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDbkMsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUVsQixNQUFNLE9BQU8sR0FBRyxJQUFBLHFCQUFVLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBRTtZQUN0QyxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFO1lBQ2pDLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxHQUFHO1NBQ2xDLENBQUMsQ0FBQztRQUNILE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1lBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEIsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUN4QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEIsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQzdCLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ25GLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ25GLE9BQU8sQ0FBQztnQkFDSixNQUFNLEVBQUUsU0FBUztnQkFDakIsTUFBTSxFQUFFLFNBQVM7Z0JBQ2pCLFFBQVEsRUFBRSxRQUFRO2FBQ3JCLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBOUJELG9CQThCQztBQUVEOztFQUVFO0FBQ0YsU0FBZ0IsUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJO0lBQ2xDLE9BQU8scUJBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFGRCw0QkFFQyJ9