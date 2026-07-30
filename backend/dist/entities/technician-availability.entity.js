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
exports.TechnicianAvailability = void 0;
const typeorm_1 = require("typeorm");
const technician_entity_1 = require("./technician.entity");
const numeric_transformer_1 = require("../common/transformers/numeric.transformer");
let TechnicianAvailability = class TechnicianAvailability {
    id;
    technicianId;
    technician;
    dayOfWeek;
    startTime;
    endTime;
    isAvailable;
};
exports.TechnicianAvailability = TechnicianAvailability;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: 'bigint',
        generated: 'increment',
        transformer: numeric_transformer_1.bigintTransformer,
    }),
    __metadata("design:type", Number)
], TechnicianAvailability.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'technician_id', type: 'bigint', transformer: numeric_transformer_1.bigintTransformer }),
    __metadata("design:type", Number)
], TechnicianAvailability.prototype, "technicianId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => technician_entity_1.Technician, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'technician_id' }),
    __metadata("design:type", technician_entity_1.Technician)
], TechnicianAvailability.prototype, "technician", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'day_of_week', type: 'tinyint' }),
    __metadata("design:type", Number)
], TechnicianAvailability.prototype, "dayOfWeek", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_time', type: 'time' }),
    __metadata("design:type", String)
], TechnicianAvailability.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_time', type: 'time' }),
    __metadata("design:type", String)
], TechnicianAvailability.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_available', default: true }),
    __metadata("design:type", Boolean)
], TechnicianAvailability.prototype, "isAvailable", void 0);
exports.TechnicianAvailability = TechnicianAvailability = __decorate([
    (0, typeorm_1.Entity)('technician_availability')
], TechnicianAvailability);
//# sourceMappingURL=technician-availability.entity.js.map