"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const customer_1 = require("../customer");
describe('CustomerRepository', () => {
    describe('constructor', function () {
        it('should contain the specified state', () => __awaiter(this, void 0, void 0, function* () {
            // Assemble/Arrange
            const state = { id: '1', name: `Stephen Trudel`, address: '1 TS Way' };
            const entity = new customer_1.Customer(state);
            // Assert
            (0, chai_1.expect)(entity.id).to.be.eq(state.id);
            (0, chai_1.expect)(entity.name).to.be.eq(state.name);
            (0, chai_1.expect)(entity.address).to.be.eq(state.address);
        }));
    });
});
