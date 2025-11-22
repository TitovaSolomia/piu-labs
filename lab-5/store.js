import { randomHsl, createId } from './helpers.js';

const STORAGE_KEY = 'app-state';

class Store {
    constructor() {
        this.state = this.#loadInitialState();
        this.subscribers = new Set();
    }

    #loadInitialState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return { shapes: [] };
            }
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed.shapes)) {
                return { shapes: [] };
            }
            return parsed;
        } catch (e) {
            console.warn(
                'Błąd odczytu localStorage, startuję z pustym stanem',
                e
            );
            return { shapes: [] };
        }
    }

    #saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        } catch (e) {
            console.warn('Błąd zapisu do localStorage', e);
        }
    }

    getState() {
        return {
            shapes: this.state.shapes.map((s) => ({ ...s })),
        };
    }

    subscribe(callback) {
        this.subscribers.add(callback);
        callback(this.getState());
        return () => this.subscribers.delete(callback);
    }

    #notify() {
        this.#saveState();
        const snapshot = this.getState();
        for (const cb of this.subscribers) {
            cb(snapshot);
        }
    }

    addShape(type) {
        if (type !== 'square' && type !== 'circle') return;

        const newShape = {
            id: createId(),
            type,
            color: randomHsl(),
        };

        this.state.shapes = [...this.state.shapes, newShape];
        this.#notify();
    }

    removeShape(id) {
        const before = this.state.shapes.length;
        this.state.shapes = this.state.shapes.filter((s) => s.id !== id);
        if (this.state.shapes.length !== before) {
            this.#notify();
        }
    }

    recolorShapes(type) {
        this.state.shapes = this.state.shapes.map((s) =>
            s.type === type ? { ...s, color: randomHsl() } : s
        );
        this.#notify();
    }

    clearAll() {
        if (this.state.shapes.length === 0) return;
        this.state.shapes = [];
        this.#notify();
    }

    getCounters() {
        let squares = 0;
        let circles = 0;

        for (const s of this.state.shapes) {
            if (s.type === 'square') squares++;
            if (s.type === 'circle') circles++;
        }

        return {
            squares,
            circles,
            total: this.state.shapes.length,
        };
    }
}

export const store = new Store();
