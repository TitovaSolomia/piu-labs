export class ProductCard extends HTMLElement {
    static get observedAttributes() {
        return ['sku', 'name', 'price', 'image', 'promo'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this._product = null; // obiekt z JSON
        this._selectedSize = ''; // wybrany rozmiar (opcjonalnie)

        this.shadowRoot.innerHTML = `
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
        .media img{
          width:100%;
          height:100%;
          object-fit:cover;
          display:block;
          transform:scale(1.02);
          transition:transform .35s ease;
        }
        .card:hover .media img{transform:scale(1.08)}
        .promo{
          position:absolute;top:12px;left:12px;
          display:inline-flex;align-items:center;justify-content:center;
          padding:8px 10px;border-radius:999px;
          background:rgba(209, 201, 208, 0.68);
          border:1px solid rgba(148,163,184,.22);
          font-size:12px;font-weight:800;letter-spacing:.2px;
          backdrop-filter:blur(10px);
          color:rgba(207, 31, 148, 0.95);
        }
        .promo[hidden]{display:none}

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
        .dot {
          width: 16px;
          height: 16px;
          border-radius: 999px;
          display: inline-block;
          background: var(--c, #9ca3af);
          border: 1px solid var(--line);
        }

        .chip{
          border: 1px solid var(--line);
          border-color: #6b7280;
          background: #ffffff;
          color: var(--text);
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 12px;
          cursor: pointer;
          transition: transform 0.06s ease, background 0.2s ease;
        }
        .chip:hover{background:#f3f4f6}
        .chip:active{transform:translateY(1px)}
        .chip[aria-pressed="true"]{
          background:#2f292e;color:#fff;border-color:#6b7280;
        }

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
          <img id="img" alt="" />
          <div class="promo" id="promo" hidden></div>
        </div>

        <div class="body">
          <div class="row">
            <div class="name" id="name"></div>
            <div class="price" id="price"></div>
          </div>

          <div class="colors" id="colorsBar">
            <div class="colors-left">
              <span class="muted">Kolory</span>
            </div>
            <div class="colors-right" id="colorsRight">
              <span class="empty" id="colorsEmpty">Brak</span>
            </div>
          </div>

          <div class="sizes" id="sizesBar">
            <div class="sizes-left">
              <span class="muted">Rozmiary</span>
            </div>
            <div class="sizes-right" id="sizesRight">
              <span class="empty" id="sizesEmpty">Brak</span>
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
    }

    connectedCallback() {
        this.shadowRoot
            .getElementById('add')
            .addEventListener('click', () => this._emitAdd());
        this.shadowRoot
            .getElementById('status')
            .addEventListener('click', () => this._clearSize());
        this._render();
    }

    attributeChangedCallback() {
        this._render();
    }

    get product() {
        return this._product;
    }
    set product(value) {
        this._product = value && typeof value === 'object' ? value : null;

        if (this._product) {
            this.setAttribute('sku', this._product.sku ?? '');
            this.setAttribute('name', this._product.name ?? '');
            this.setAttribute('price', String(this._product.price ?? ''));
            this.setAttribute('image', this._product.image ?? '');
            this.setAttribute('promo', this._product.promo ?? '');
        }

        this._selectedSize = '';
        this._render();
    }

    get sku() {
        return this.getAttribute('sku') || '';
    }
    get name() {
        return this.getAttribute('name') || '';
    }
    get image() {
        return this.getAttribute('image') || '';
    }

    get price() {
        const raw = this.getAttribute('price');
        const n = Number(raw);
        return Number.isFinite(n) ? n : 0;
    }

    get promo() {
        return this.getAttribute('promo') || '';
    }

    _formatPrice(priceNumber) {
        return `${priceNumber.toFixed(2).replace('.', ',')} zł`;
    }

    _render() {
        const img = this.shadowRoot.getElementById('img');
        const promoEl = this.shadowRoot.getElementById('promo');
        const nameEl = this.shadowRoot.getElementById('name');
        const priceEl = this.shadowRoot.getElementById('price');

        const colorsRight = this.shadowRoot.getElementById('colorsRight');
        const sizesRight = this.shadowRoot.getElementById('sizesRight');
        const colorsEmpty = this.shadowRoot.getElementById('colorsEmpty');
        const sizesEmpty = this.shadowRoot.getElementById('sizesEmpty');

        const chosen = this.shadowRoot.getElementById('chosen');
        const status = this.shadowRoot.getElementById('status');

        const p = this._product || {
            sku: this.sku,
            name: this.getAttribute('name') || '',
            price: this.price,
            image: this.image,
            promo: this.promo,
            colors: [],
            sizes: [],
        };

        img.src = p.image || '';
        img.alt = p.name || 'Produkt';

        const promoText = (p.promo || '').trim();
        promoEl.textContent = promoText;
        promoEl.hidden = promoText.length === 0;

        nameEl.textContent = p.name || '';
        priceEl.textContent = this._formatPrice(Number(p.price) || 0);

        colorsRight.querySelectorAll('.dot').forEach((n) => n.remove());
        const colors = Array.isArray(p.colors) ? p.colors : [];
        colorsEmpty.hidden = colors.length > 0;
        colors.forEach((c) => {
            const dot = document.createElement('span');
            dot.className = 'dot';
            dot.style.setProperty('--c', c);
            colorsRight.appendChild(dot);
        });

        sizesRight.querySelectorAll('.chip').forEach((n) => n.remove());
        const sizes = Array.isArray(p.sizes) ? p.sizes : [];
        sizesEmpty.hidden = sizes.length > 0;

        sizes.forEach((s) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'chip';
            btn.textContent = s;
            btn.setAttribute('data-size', s);
            btn.setAttribute(
                'aria-pressed',
                this._selectedSize === s ? 'true' : 'false'
            );
            btn.addEventListener('click', () => {
                this._selectedSize = s;
                sizesRight
                    .querySelectorAll('.chip')
                    .forEach((b) => b.setAttribute('aria-pressed', 'false'));
                btn.setAttribute('aria-pressed', 'true');
                this._refreshStatus();
            });
            sizesRight.appendChild(btn);
        });

        this._refreshStatus();
    }

    _refreshStatus() {
        const chosen = this.shadowRoot.getElementById('chosen');
        const status = this.shadowRoot.getElementById('status');
        status.dataset.hasSize = this._selectedSize ? 'true' : 'false';
        chosen.textContent = this._selectedSize
            ? `Wybrany rozmiar: ${this._selectedSize}`
            : 'Brak wybranego rozmiaru';
    }

    _clearSize() {
        this._selectedSize = '';
        this.shadowRoot
            .getElementById('sizesRight')
            .querySelectorAll('.chip')
            .forEach((b) => b.setAttribute('aria-pressed', 'false'));
        this._refreshStatus();
    }

    _emitAdd() {
        const p = this._product || {
            sku: this.sku,
            name: this.getAttribute('name') || '',
            price: this.price,
        };

        this.dispatchEvent(
            new CustomEvent('add-to-cart', {
                bubbles: true,
                composed: true,
                detail: {
                    sku: p.sku || '',
                    name: p.name || '',
                    price: Number(p.price) || 0,
                    size: this._selectedSize || '',
                },
            })
        );
    }
}

customElements.define('product-card', ProductCard);
