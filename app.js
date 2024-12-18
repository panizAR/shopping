import { productsData } from "./products.js";

const basket = document.querySelector(".basket");
const backdrop = document.querySelector(".backdrop");
const closeBtn = document.querySelectorAll(".close-modal");
const productDom = document.querySelector(".product");
const cartNum = document.querySelector(".cart-num");
const cartTotal = document.querySelector(".total-price");
const modalContent = document.querySelector(".modal__content");
const clearCartBtn = document.querySelector(".clear-cart");

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
let buttonDOM = [];
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
    const addToCartBtn = [...document.querySelectorAll(".add-to-cart")];
    buttonDOM = addToCartBtn;

    addToCartBtn.forEach((btn) => {
      const id = btn.dataset.id;

      const isInCart = cart.find((p) => p.id === parseInt(id));
      if (isInCart) {
        btn.innerHTML = `In Cart`;
        btn.disabled = true;
      }

      btn.addEventListener("click", (event) => {
        // const BtnId = event.target.dataset.id;
        event.target.innerHTML = "In Cart";
        event.target.disabled = true;
        //get product from products
        const addedProduct = { ...Storage.getProduct(id), quantity: 1 };

        //add to cart
        cart = [...cart, addedProduct];

        //save cart to localstorage
        Storage.saveCart(cart);

        // update cart value
        this.setCartValue(cart);

        // add product to cart modal
        this.addCartItem(addedProduct);
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
  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("modal__item");
    div.innerHTML = `
      <div class="modal__item-img">
        <img src=${cartItem.imageUrl} />
      </div>
      <div class="modal__item-header">
        <div class="modal__item-title">
          ${cartItem.title}
        </div>
        <div class="modal__item-price">  ${cartItem.price}</div>
      </div>
      <div class="modal__item-counter">
          <i class="fa-solid fa-chevron-up" data-id=${cartItem.id}></i>
          <span class="counter">${cartItem.quantity}</span>
          <i class="fa-solid fa-chevron-down" data-id=${cartItem.id}></i>
      </div>
      <i class="fa-solid fa-trash-can" data-id=${cartItem.id}></i>`;
    modalContent.appendChild(div);
  }
  setupApp() {
    //get cart from storage
    cart = Storage.getCart() || [];
    //add cartitem
    cart.forEach((cartitem) => this.addCartItem(cartitem));
    //set valus
    this.setCartValue(cart);
  }
  cartLogic() {
    //clear cart
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });

    // cart functionality
    modalContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("fa-chevron-up")) {
        const addQuantity = event.target;

        // get item from cart
        const addedItem = cart.find(
          (cItem) => cItem.id == addQuantity.dataset.id
        );
        addedItem.quantity++;

        // save cart
        this.setCartValue(cart);

        // update cart valu
        Storage.saveCart(cart);

        //update cart num qu in ui
        addQuantity.nextElementSibling.innerText = addedItem.quantity;
      } else if (event.target.classList.contains("fa-trash-can")) {
        const removeItem = event.target;
        // remove from cart item
        const _removedItem = cart.find((c) => c.id == removeItem.dataset.id);
        this.removeItem(_removedItem.id);

        modalContent.removeChild(removeItem.parentElement);
        // save cart
        this.setCartValue(cart);

        // update cart valu
        Storage.saveCart(cart);
      } else if (event.target.classList.contains("fa-chevron-down")) {
        const subQuantity = event.target;

        // get item from cart
        const substractedItem = cart.find(
          (c) => c.id == subQuantity.dataset.id
        );
        if (substractedItem.quantity === 1) {
          this.removeItem(substractedItem.id);
          modalContent.removeChild(subQuantity.parentElement.parentElement);
          return;
        }
        substractedItem.quantity--;

        // save cart
        this.setCartValue(cart);

        // update cart valu
        Storage.saveCart(cart);

        //update cart num qu in ui
        subQuantity.previousElementSibling.innerText = substractedItem.quantity;
      }
    });
  }
  clearCart() {
    //romove
    cart.forEach((cItem) => this.removeItem(cItem.id));
    cart = [];
    // remove cart content childeren
    while (modalContent.children.length > 0) {
      modalContent.removeChild(modalContent.children[0]);
    }
    this.setCartValue(cart);
    Storage.saveCart(cart);
  }
  removeItem(id) {
    //update cart
    cart = cart.filter((cItem) => cItem.id != id);

    //  update price ang cart item
    this.setCartValue(cart);
    // update storage
    Storage.saveCart(cart);

    // get aad to cart btn => update text
    this.getSinglebutton(id);
  }
  getSinglebutton(id) {
    const button = buttonDOM.find(
      (btn) => parseInt(btn.dataset.id) === parseInt(id)
    );
    button.innerText = "Add to cart";
    button.disabled = false;
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
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  const ui = new UI();
  ui.setupApp();
  ui.displayProducts(productsData);
  ui.getAddToCartBtn();
  ui.cartLogic();
  Storage.saveProducts(productsData);
});
