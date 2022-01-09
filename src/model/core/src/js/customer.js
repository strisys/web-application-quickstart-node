"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
class Customer {
    constructor(state = null) {
        this._state = Customer.emptyState;
        this._state = Customer.correct(state);
    }
    get id() {
        return (this._state.id || '');
    }
    set id(value) {
        this._state.id = (value || '');
    }
    get name() {
        return (this._state.name || '');
    }
    set name(value) {
        this._state.name = (value || '');
    }
    get address() {
        return (this._state.address || '');
    }
    get state() {
        return Object.assign({}, this._state);
    }
    set address(value) {
        this._state.address = (value || '');
    }
    static null() {
        return (new Customer());
    }
    static get emptyState() {
        return {
            id: '',
            name: '',
            address: ''
        };
    }
    static correct(source) {
        const val = (source || Customer.emptyState);
        return {
            id: val.id,
            name: (val.name || ''),
            address: (val.address || '')
        };
    }
    static from(states) {
        if (!states) {
            return [];
        }
        return states.map((s) => {
            return (new Customer(s));
        });
    }
}
exports.Customer = Customer;
