"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.B = exports.A = void 0;
const __1 = require("../");
const IoC_1 = require("../libs/IoC");
let A = class A extends __1.Module {
};
exports.A = A;
exports.A = A = __decorate([
    (0, IoC_1.ModuleInst)()
], A);
let B = class B extends __1.Module {
    a;
    async ready() {
        console.log(this.a);
    }
};
exports.B = B;
__decorate([
    (0, IoC_1.ModuleField)(A),
    __metadata("design:type", A)
], B.prototype, "a", void 0);
exports.B = B = __decorate([
    (0, IoC_1.ModuleInst)()
], B);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mcmFtZXdvcmsvdGVzdC9tb2R1bGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDJCQUEyQjtBQUMzQixxQ0FBb0Q7QUFHN0MsSUFBTSxDQUFDLEdBQVAsTUFBTSxDQUFFLFNBQVEsVUFBTTtDQUU1QixDQUFBO0FBRlksY0FBQztZQUFELENBQUM7SUFEYixJQUFBLGdCQUFVLEdBQUU7R0FDQSxDQUFDLENBRWI7QUFHTSxJQUFNLENBQUMsR0FBUCxNQUFNLENBQUUsU0FBUSxVQUFNO0lBR2pCLENBQUMsQ0FBSTtJQUViLEtBQUssQ0FBQyxLQUFLO1FBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEIsQ0FBQztDQUNKLENBQUE7QUFSWSxjQUFDO0FBR0Y7SUFEUCxJQUFBLGlCQUFXLEVBQUMsQ0FBQyxDQUFDOzhCQUNKLENBQUM7NEJBQUM7WUFISixDQUFDO0lBRGIsSUFBQSxnQkFBVSxHQUFFO0dBQ0EsQ0FBQyxDQVFiIn0=