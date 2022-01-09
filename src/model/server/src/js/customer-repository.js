"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRepository = exports.Customer = void 0;
const model_core_1 = require("model-core");
Object.defineProperty(exports, "Customer", { enumerable: true, get: function () { return model_core_1.Customer; } });
const cache = [{
        id: '1',
        name: 'Elon Musk',
        address: '1 EV Way'
    }, {
        id: '2',
        name: 'Bill Gates',
        address: '2 Software Way'
    }];
class CustomerRepository {
    get() {
        return model_core_1.Customer.from(cache);
    }
    getOne(id) {
        const state = cache.find((c) => {
            return (c.id === id);
        });
        return ((state) ? (new model_core_1.Customer(state)) : model_core_1.Customer.null());
    }
}
exports.CustomerRepository = CustomerRepository;
