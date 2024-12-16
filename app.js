import { productsData } from "./products.js";

const basket = document.querySelector(".basket");
const backdrop = document.querySelector(".backdrop");
const closeBtn = document.querySelectorAll(".close-modal");
const productDom = document.querySelector(".product");
const cartNum = document.querySelector(".cart-num");
const cartTotal = document.querySelector(".total-price");

// open and close modal
basket.addEventListener("click", openModal);
closeBtn.forEach((btn) => btn.addEventListener("click", closeModal));

function openModal() {
  backdrop.style.display = "block";
}

function closeModal() {
  backdrop.style.display = "none";
}
////////////////////////

let cart = [];
// 1. get produnct
class Products {
  getProducts() {
    return productsData;
  }
}
// 2. display product

class UI {
  displayProducts(products) {
    let result = "";

    products.forEach((item) => {
      result += `
      <div class="card">
          <div class="img-container">
              <img
                src=${item.imageUrl}
                class="card__image"
              />
          </div>
          <div class="card__header">
            <h3 class="card__price">${item.price}</h3>
            <h2 class="card__title">${item.title}</h2>
          </div>
          <footer class="card__footer">
            <button class="add-to-cart btn-primary" data-id=${item.id}>Add to cart</button>
          </footer>
        </div>`;
      productDom.innerHTML = result;
    });
  }
  getAddToCartBtn() {
    const addToCartBtn = document.querySelectorAll(".add-to-cart");
    const buttons = [...addToCartBtn];
    buttons.forEach((btn) => {
      const id = btn.dataset.id;

      const isInCart = cart.find((p) => p.id === id);
      if (isInCart) {
        btn.innerHTML = `In Cart`;
        btn.disabled = true;
      }

      btn.addEventListener("click", (event) => {
        // const BtnId = event.target.dataset.id;
        event.target.innerHTML = "In Cart";
        event.target.disabled = true;
        //get product from products
        const addedProduct = Storage.getProduct(id);

        //add to cart
        cart = [...cart, { ...addedProduct, quantity: 1 }];

        //save cart to localstorage
        Storage.saveCart(cart);

        // update cart value
        this.setCartValue(cart);
      });
    });
  }
  setCartValue(cart) {
    let tempCartItem = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItem += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartTotal.innerHTML = totalPrice.toFixed(2);
    cartNum.innerHTML = tempCartItem;
  }
}

// 3.localstorage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === parseInt(id));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  const ui = new UI();
  ui.displayProducts(productsData);
  ui.getAddToCartBtn();
  Storage.saveProducts(productsData);
});
