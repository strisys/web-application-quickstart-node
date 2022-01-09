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
const customer_repository_1 = require("../customer-repository");
describe('CustomerRepository', () => {
    describe('get', function () {
        it('should return more than 0 customers', () => __awaiter(this, void 0, void 0, function* () {
            // Assemble/Arrange
            const entities = (new customer_repository_1.CustomerRepository()).get();
            // Assert
            (0, chai_1.expect)(entities.length).to.be.greaterThan(0);
        }));
    });
});
