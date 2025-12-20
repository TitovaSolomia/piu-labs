import './product-card.js';

export class ProductList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._products = [];

        this.shadowRoot.innerHTML = `
      <style>
        :host{display:block}
        .grid{
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(var(--w), 1fr));
          gap: 18px;
          padding-top: 18px;
        }
      </style>
      <section class="grid" id="grid"></section>
    `;
    }

    get products() {
        return this._products;
    }

    set products(value) {
        this._products = Array.isArray(value) ? value : [];
        this._render();
    }

    _render() {
        const grid = this.shadowRoot.getElementById('grid');
        grid.innerHTML = '';

        for (const p of this._products) {
            const card = document.createElement('product-card');
            card.product = p;
            grid.appendChild(card);
        }
    }
}

customElements.define('product-list', ProductList);
