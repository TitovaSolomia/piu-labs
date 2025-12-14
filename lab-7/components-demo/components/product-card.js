export class ProductCard extends HTMLElement {
    constructor() {
        super();
        const root = this.attachShadow({ mode: 'open' });
        root.innerHTML = `
      <style>
        :host{display:block}
        .card{
          width:100%;
          height:var(--h);
          border-radius:var(--radius);
          background:linear-gradient(180deg, rgba(255, 255, 255, 0.85), rgba(216, 206, 216, 0.55));
          border:1px solid rgba(148, 163, 184, 0.14);
          border-color: #6b7280;
          box-shadow:var(--shadow);
          overflow:hidden;
          display:flex;
          flex-direction:column;
          position:relative;
          transform:translateZ(0);
        }
        .media{
          height:var(--imgH);
          position:relative;
          overflow:hidden;
          border-bottom:1px solid rgba(141, 143, 146, 0.14);
          background:rgba(73, 75, 85, 0.25);
        }
        .media ::slotted(img){
          width:100%;
          height:100%;
          object-fit:cover;
          display:block;
          transform:scale(1.02);
          transition:transform .35s ease;
        }
        .card:hover .media ::slotted(img){transform:scale(1.08)}
        .promo{
          position:absolute;top:12px;left:12px;
          display:inline-flex;align-items:center;justify-content:center;
          padding:8px 10px;border-radius:999px;
          background:rgba(209, 201, 208, 0.68);
          border:1px solid rgba(148,163,184,.22);
          font-size:12px;font-weight:800;letter-spacing:.2px;
          backdrop-filter:blur(10px);
        }
        .promo[hidden]{display:none}
        .promo ::slotted(*){color:rgba(207, 31, 148, 0.95)}
        .body{
          padding:14px 14px 12px;
          display:flex;
          flex-direction:column;
          gap:10px;
          flex:1;
        }
        .row{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:12px;
          min-height:42px;
        }
        .name{
          font-weight:800;
          letter-spacing:.2px;
          font-size:15px;
          line-height:1.2;
          flex:1;
          overflow:hidden;
          display:-webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;
        }
        .price{
          font-weight:900;
          font-size:15px;
          white-space:nowrap;
        }
        .muted{
          color:var(--muted);
          font-size:12px;
          letter-spacing:.15px;
        }
        .colors, .sizes{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          padding:10px 12px;
          border-radius:14px;
          border:1px solid rgba(231, 229, 229, 0.88);
          background:rgba(209, 206, 209, 0.7);
          min-height:44px;
        }
        .colors-left, .sizes-left{display:flex;align-items:center;gap:10px}
        .colors-right, .sizes-right{
          display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end
        }
        .empty{
          color:rgba(148,163,184,.75);
          font-size:12px;
          padding:6px 10px;
          border-radius:999px;
          border:1px dashed rgba(219, 219, 219, 0.61);
          background:rgba(243, 243, 243, 0.41);
        }
        .empty[hidden]{display:none}
        .footer{
          padding:0 14px 14px;
          display:flex;
          gap:10px;
          align-items:center;
        }
        .btn{
          appearance:none;border:1px solid rgba(252, 142, 250, 0.38);
          background:rgba(244, 89, 249, 0.47);
          color:var(--text);
          font-weight:800;
          letter-spacing:.2px;
          padding:12px 12px;
          border-radius:14px;
          cursor:pointer;
          flex:1;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          transition:transform .06s ease, border-color .2s ease, background .2s ease;
        }
        .btn:hover{border-color:rgba(254, 127, 247, 0.76);background:rgba(222, 96, 250, 0.22)}
        .btn:active{transform:translateY(1px)}
        .mini{
          width:46px;min-width:46px;
          height:46px;
          border-radius:14px;
          border:1px solid rgba(193, 201, 212, 0.52);
          background:rgba(2,6,23,.22);
          color:rgba(229,231,235,.9);
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;
          transition:transform .06s ease, border-color .2s ease;
        }
        .mini:hover{border-color:rgba(218, 221, 219, 0.55)}
        .mini:active{transform:translateY(1px)}
        .check{
          display:none;
          width:9px;height:9px;border-radius:999px;
          background:rgba(202, 202, 202, 0.95);
          box-shadow:0 0 0 4px rgba(34,197,94,.18);
        }
        .mini[data-has-size="true"] .check{display:inline-block}
        .sr{position:absolute;left:-9999px}
      </style>

      <article class="card" part="card">
        <div class="media">
          <slot name="image"></slot>
          <div class="promo" id="promo"><slot name="promo"></slot></div>
        </div>

        <div class="body">
          <div class="row">
            <div class="name"><slot name="name"></slot></div>
            <div class="price"><slot name="price"></slot></div>
          </div>

          <div class="colors" id="colorsBar">
            <div class="colors-left">
              <span class="muted">Kolory</span>
            </div>
            <div class="colors-right">
              <span class="empty" id="colorsEmpty">Brak</span>
              <slot name="colors" id="colorsSlot"></slot>
            </div>
          </div>

          <div class="sizes" id="sizesBar">
            <div class="sizes-left">
              <span class="muted">Rozmiary</span>
            </div>
            <div class="sizes-right">
              <span class="empty" id="sizesEmpty">Brak</span>
              <slot name="sizes" id="sizesSlot"></slot>
            </div>
          </div>
        </div>

        <div class="footer">
          <button class="btn" type="button" id="add">
            <span>Do koszyka</span>
          </button>
          <button class="mini" type="button" id="status" data-has-size="false" aria-label="Wybrany rozmiar">
            <span class="check"></span>
          </button>
        </div>

        <span class="sr" id="chosen"></span>
      </article>
    `;
        this._selectedSize = '';
    }

    connectedCallback() {
        const promo = this.shadowRoot.getElementById('promo');
        const add = this.shadowRoot.getElementById('add');
        const status = this.shadowRoot.getElementById('status');
        const chosen = this.shadowRoot.getElementById('chosen');

        const colorsSlot = this.shadowRoot.getElementById('colorsSlot');
        const sizesSlot = this.shadowRoot.getElementById('sizesSlot');
        const colorsEmpty = this.shadowRoot.getElementById('colorsEmpty');
        const sizesEmpty = this.shadowRoot.getElementById('sizesEmpty');

        const hasMeaningful = (slotEl) => {
            const nodes = slotEl.assignedNodes({ flatten: true });
            return nodes.some((n) =>
                n.nodeType === 3 ? n.textContent.trim().length > 0 : true
            );
        };

        const togglePromo = () => {
            const slot = this.shadowRoot.querySelector(`slot[name="promo"]`);
            const ok =
                slot &&
                slot
                    .assignedNodes({ flatten: true })
                    .some((n) =>
                        n.nodeType === 3
                            ? n.textContent.trim().length > 0
                            : true
                    );
            promo.hidden = !ok;
        };

        const refresh = () => {
            togglePromo();
            colorsEmpty.hidden = hasMeaningful(colorsSlot);
            sizesEmpty.hidden = hasMeaningful(sizesSlot);
            status.dataset.hasSize = this._selectedSize ? 'true' : 'false';
            chosen.textContent = this._selectedSize
                ? `Wybrany rozmiar: ${this._selectedSize}`
                : `Brak wybranego rozmiaru`;
        };

        const hookSizeButtons = () => {
            const nodes = sizesSlot.assignedElements({ flatten: true });
            nodes.forEach((container) => {
                container.querySelectorAll?.('[data-size]')?.forEach((btn) => {
                    btn.setAttribute('aria-pressed', 'false');
                    btn.addEventListener('click', () => {
                        const size = btn.getAttribute('data-size') || '';
                        const all = container.querySelectorAll('[data-size]');
                        all.forEach((b) =>
                            b.setAttribute('aria-pressed', 'false')
                        );
                        btn.setAttribute('aria-pressed', 'true');
                        this._selectedSize = size;
                        refresh();
                    });
                });
            });
        };

        sizesSlot.addEventListener('slotchange', () => {
            hookSizeButtons();
            refresh();
        });
        colorsSlot.addEventListener('slotchange', () => {
            refresh();
        });
        this.shadowRoot
            .querySelector(`slot[name="promo"]`)
            .addEventListener('slotchange', () => {
                refresh();
            });

        add.addEventListener('click', () => {
            const sku = this.getAttribute('data-sku') || '';
            const name = this._getTextFromSlot('name');
            const price = this._getTextFromSlot('price');
            const size = this._selectedSize;
            this.dispatchEvent(
                new CustomEvent('add-to-cart', {
                    bubbles: true,
                    composed: true,
                    detail: { sku, name, price, size },
                })
            );
        });

        status.addEventListener('click', () => {
            this._selectedSize = '';
            const nodes = sizesSlot.assignedElements({ flatten: true });
            nodes.forEach((container) => {
                container
                    .querySelectorAll?.('[data-size]')
                    ?.forEach((b) => b.setAttribute('aria-pressed', 'false'));
            });
            refresh();
        });

        hookSizeButtons();
        refresh();
    }

    _getTextFromSlot(name) {
        const slot = this.shadowRoot.querySelector(`slot[name="${name}"]`);
        const nodes = slot ? slot.assignedNodes({ flatten: true }) : [];
        return nodes
            .map((n) =>
                n.nodeType === 3 ? n.textContent : n.textContent || ''
            )
            .join(' ')
            .trim();
    }
}

customElements.define('product-card', ProductCard);

const cartCount = document.getElementById('cartCount');
const lastAdded = document.getElementById('lastAdded');

let count = 0;

document.getElementById('products').addEventListener('add-to-cart', (e) => {
    count += 1;
    cartCount.textContent = String(count);

    const { name, price, size } = e.detail || {};
    const pill = document.createElement('div');
    pill.className = 'pill';
    pill.innerHTML = `<b>${name || 'Produkt'}</b> <i>${price || ''}</i> <u>${
        size ? 'Rozm. ' + size : 'Bez rozm.'
    }</u>`;
    lastAdded.prepend(pill);

    const items = Array.from(lastAdded.children);
    items.slice(6).forEach((n) => n.remove());
});
