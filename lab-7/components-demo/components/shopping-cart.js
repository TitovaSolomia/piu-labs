export class ShoppingCart extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._items = [];

        this.shadowRoot.innerHTML = `
      <style>
        :host{display:block}
        .panel {
          margin-top: 22px;
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: #ffffff;
          box-shadow: var(--shadow2);
        }
        .panel-row { padding: 14px 16px; }
        .panel-title { font-weight: 800; letter-spacing: 0.2px; }

        .list { margin-top: 10px; display:flex; flex-direction:column; gap:10px; }
        .row {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          padding:10px 12px;
          border-radius: 14px;
          border: 1px solid var(--line);
          background: #f9fafb;
        }
        .meta { display:flex; flex-direction:column; gap:4px; min-width:0; }
        .name { font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width: 520px; }
        .price { font-size: 12px; color: var(--muted); }

        .btn {
          border: 1px solid var(--line);
          border-color: #6b7280;
          background: #ffffff;
          color: var(--text);
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 12px;
          cursor: pointer;
        }
        .btn:hover { background:#f3f4f6; }

        .sum {
          margin-top: 12px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding-top: 12px;
          border-top: 1px solid var(--line);
          font-weight: 800;
        }

        .empty {
          margin-top: 10px;
          color: var(--muted);
          font-size: 13px;
        }
      </style>

      <section class="panel">
        <div class="panel-row">
          <div class="panel-title">Koszyk</div>

          <div id="empty" class="empty">Brak produktów w koszyku</div>
          <div id="list" class="list"></div>

          <div class="sum" id="sumRow" hidden>
            <span>Suma</span>
            <span id="sumValue">0 zł</span>
          </div>
        </div>
      </section>
    `;
    }

    addItem(item) {
        if (!item || typeof item !== 'object') return;
        this._items = [
            ...this._items,
            {
                id: crypto.randomUUID(),
                sku: item.sku || '',
                name: item.name || 'Produkt',
                price: Number(item.price) || 0,
            },
        ];

        this._render();
    }

    removeItem(id) {
        this._items = this._items.filter((x) => x.id !== id);
        this._render();
    }

    _formatPrice(n) {
        return `${n.toFixed(2).replace('.', ',')} zł`;
    }

    _render() {
        const empty = this.shadowRoot.getElementById('empty');
        const list = this.shadowRoot.getElementById('list');
        const sumRow = this.shadowRoot.getElementById('sumRow');
        const sumValue = this.shadowRoot.getElementById('sumValue');

        list.innerHTML = '';

        empty.hidden = this._items.length > 0;
        sumRow.hidden = this._items.length === 0;

        for (const item of this._items) {
            const row = document.createElement('div');
            row.className = 'row';
            row.innerHTML = `
        <div class="meta">
          <div class="name">${item.name}</div>
          <div class="price">${this._formatPrice(item.price)}</div>
        </div>
        <button class="btn" type="button">Usuń</button>
      `;
            row.querySelector('button').addEventListener('click', () =>
                this.removeItem(item.id)
            );
            list.appendChild(row);
        }

        const total = this._items.reduce(
            (acc, x) => acc + (Number(x.price) || 0),
            0
        );
        sumValue.textContent = this._formatPrice(total);
    }
}

customElements.define('shopping-cart', ShoppingCart);
