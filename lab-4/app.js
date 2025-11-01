(function () {
    'use strict';

    const STORAGE = 'KANBAN_SIMPLE_V2';

    const lists = {
        todo: document.querySelector('[data-list="todo"]'),
        doing: document.querySelector('[data-list="doing"]'),
        done: document.querySelector('[data-list="done"]'),
    };

    const counts = {
        todo: document.querySelector('[data-count="todo"]'),
        doing: document.querySelector('[data-count="doing"]'),
        done: document.querySelector('[data-count="done"]'),
    };

    let state = load() || {
        columns: { todo: [], doing: [], done: [] },
        sort: { todo: 'none', doing: 'none', done: 'none' },
    };

    function uid() {
        return (
            'id-' +
            Date.now().toString(36) +
            '-' +
            Math.random().toString(36).slice(2, 8)
        );
    }
    function randColor() {
        const h = Math.floor(Math.random() * 360);
        const s = 70 + Math.floor(Math.random() * 20);
        const l = 40 + Math.floor(Math.random() * 10);
        return `hsl(${h} ${s}% ${l}%)`;
    }
    function save() {
        localStorage.setItem(STORAGE, JSON.stringify(state));
    }
    function load() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE));
        } catch {
            return null;
        }
    }

    function makeCardEl(card, colKey) {
        const root = document.createElement('article');
        root.className = 'card';
        root.tabIndex = 0;
        root.dataset.id = card.id;
        root.style.background = `linear-gradient(180deg, ${card.color}, rgba(0,0,0,.15))`;
        root.style.borderColor = 'rgba(255,255,255,.06)';

        const top = document.createElement('div');
        top.className = 'card__top';

        const left = document.createElement('div');

        const title = document.createElement('div');
        title.className = 'card__title';
        title.contentEditable = 'true';
        title.textContent = card.title || '';
        title.addEventListener('input', () => {
            card.title = title.textContent.trim();
            save();
            if (state.sort[colKey] !== 'none') renderColumn(colKey);
        });

        const dot = document.createElement('span');
        dot.className = 'card__color-dot';
        dot.style.background = card.color;

        left.appendChild(title);
        left.appendChild(dot);

        const actions = document.createElement('div');
        actions.className = 'card__actions';
        actions.innerHTML = `
      <button class="icon-btn" title="Kolor karty" data-action="colorCard">🎨</button>
      <button class="icon-btn" title="W lewo" data-action="moveLeft">←</button>
      <button class="icon-btn" title="W prawo" data-action="moveRight">→</button>
      <button class="icon-btn icon-btn--danger" title="Usuń kartę" data-action="delete">×</button>
    `;

        const meta = document.createElement('span');
        meta.className = 'small-muted';
        meta.textContent = `#${card.id}`;

        top.appendChild(left);
        top.appendChild(actions);
        root.appendChild(top);
        root.appendChild(meta);

        return root;
    }

    function sortArray(arr, mode) {
        const out = [...arr];
        if (mode === 'none') return out;
        out.sort((a, b) =>
            (a.title || '').localeCompare(b.title || '', 'pl', {
                sensitivity: 'base',
            })
        );
        return mode === 'az' ? out : out.reverse();
    }

    function renderColumn(colKey) {
        const list = lists[colKey];
        list.innerHTML = '';

        const data = sortArray(state.columns[colKey], state.sort[colKey]);
        data.forEach((card) => list.appendChild(makeCardEl(card, colKey)));

        counts[colKey].textContent = state.columns[colKey].length;

        const sortBtn = list
            .closest('.column')
            .querySelector('[data-action="sort"]');
        if (sortBtn) {
            sortBtn.textContent =
                state.sort[colKey] === 'none'
                    ? 'Sortuj'
                    : state.sort[colKey] === 'az'
                    ? 'Sortuj A→Z'
                    : 'Sortuj Z→A';
        }
    }

    function renderBoard() {
        renderColumn('todo');
        renderColumn('doing');
        renderColumn('done');
    }

    function addCard(colKey) {
        const t = prompt('Tytuł nowej karty:', 'Nowa karta');
        if (t === null) return;
        const card = {
            id: uid(),
            title: String(t).trim() || 'Bez tytułu',
            color: randColor(),
            createdAt: Date.now(),
        };
        state.columns[colKey].push(card);
        save();
        renderColumn(colKey);
    }

    function deleteCard(colKey, id) {
        state.columns[colKey] = state.columns[colKey].filter(
            (c) => c.id !== id
        );
        save();
        renderColumn(colKey);
    }

    function moveCard(fromKey, id, dir) {
        const order = ['todo', 'doing', 'done'];
        const toIdx = order.indexOf(fromKey) + dir;
        if (toIdx < 0 || toIdx >= order.length) return;

        const toKey = order[toIdx];
        const list = state.columns[fromKey];
        const idx = list.findIndex((c) => c.id === id);
        if (idx === -1) return;

        const [card] = list.splice(idx, 1);
        state.columns[toKey].push(card);
        save();
        renderColumn(fromKey);
        renderColumn(toKey);
    }

    function colorizeCard(colKey, id) {
        const card = state.columns[colKey].find((c) => c.id === id);
        if (!card) return;
        card.color = randColor();
        save();
        renderColumn(colKey);
    }

    function colorizeColumn(colKey) {
        state.columns[colKey].forEach((c) => (c.color = randColor()));
        save();
        renderColumn(colKey);
    }

    function toggleSort(colKey) {
        const curr = state.sort[colKey];
        state.sort[colKey] =
            curr === 'none' ? 'az' : curr === 'az' ? 'za' : 'none';
        save();
        renderColumn(colKey);
    }

    document.querySelectorAll('.column').forEach((column) => {
        const colKey = column.dataset.col;
        const listEl = column.querySelector('.cards');

        column.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.dataset.action;

            if (action === 'add') return addCard(colKey);
            if (action === 'colorizeColumn') return colorizeColumn(colKey);
            if (action === 'sort') return toggleSort(colKey);
        });

        listEl.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;

            const cardEl = e.target.closest('.card');
            if (!cardEl) return;

            const id = cardEl.dataset.id;
            const action = btn.dataset.action;

            if (action === 'delete') return deleteCard(colKey, id);
            if (action === 'moveLeft') return moveCard(colKey, id, -1);
            if (action === 'moveRight') return moveCard(colKey, id, +1);
            if (action === 'colorCard') return colorizeCard(colKey, id);
        });
    });

    renderBoard();
})();
