import productsData from "./data.json" with { type: "json" };

import "./components/product-list.js";
import "./components/shopping-cart.js";

const productList = document.querySelector("product-list");
const cart = document.querySelector("shopping-cart");

productList.products = productsData;

productList.addEventListener("add-to-cart", (e) => {
  cart.addItem(e.detail);
});


// poniżej dodaję obsługę koszyka, ponieważ bolą oczy patrzeć na krzywy koszyk na stronie

const cartSidebar = document.getElementById("cartSidebar");
const cartFab = document.getElementById("cartFab");
const cartOverlay = document.getElementById("cartOverlay");

function openCart() {
  cartSidebar.classList.add("is-open");
  cartFab.setAttribute("aria-expanded", "true");
  cartOverlay.hidden = false;
}

function closeCart() {
  cartSidebar.classList.remove("is-open");
  cartFab.setAttribute("aria-expanded", "false");
  cartOverlay.hidden = true;
}

cartFab.addEventListener("click", () => {
  const isOpen = cartSidebar.classList.contains("is-open");
  if (isOpen) closeCart();
  else openCart();
});

cartOverlay.addEventListener("click", closeCart);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCart();
});
