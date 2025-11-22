export function randomHsl() {
    const h = Math.floor(Math.random() * 360);
    const s = 70;
    const l = 70;
    return `hsl(${h}, ${s}%, ${l}%)`;
}

export function createId() {
    return (
        Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
    );
}
