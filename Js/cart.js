const inCart = JSON.parse(localStorage.getItem("cartItems")) || [];
const cartContainer = document.querySelector(".cartContainer");
const allProducts = document.querySelector(".products");
function displayCart() {
  if (inCart.length === 0) {
    allProducts.innerHTML += `<p class="empty-cart">السلة فارغة</p>`;
    return;
  }

  for (let i = 0; i < inCart.length; i++) {
    const name = inCart[i].name;
    const price = inCart[i].price;
    const image = inCart[i].image;

    let cart = document.createElement("div");
    cart.classList.add("cart");
    cart.innerHTML = `
    <img src="${image}" alt="${name}" />
    <h3>${name}</h3>
      <div class="info">
        <p>السعر :  <span>${price} </span></p>
      </div>
    <button class="deleteCart" data-product-name ="${name}">إزالة من السلة</button>
    `;
    allProducts.appendChild(cart);
    deleteBtn = document.querySelectorAll(".deleteCart");
    deleteBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        let cartElement = btn.closest(".cart");
        let productName = btn.dataset.productName;

        cartElement.remove();

        let items = JSON.parse(localStorage.getItem("cartItems")) || [];
        items = items.filter((item) => item.name !== productName);
        localStorage.setItem("cartItems", JSON.stringify(items));
        updateTotalPrice();
      });
    });
  }
}

function updateTotalPrice() {
  const items = JSON.parse(localStorage.getItem("cartItems")) || [];
  total.innerHTML = "";
  let sum = 0;

  for (let i = 0; i < items.length; i++) {
    total.innerHTML += `
    <p><span>ل.س ${items[i].price}</span> + </p>
    `;
    sum += items[i].price;
  }

  if (items.length > 0) {
    total.innerHTML += ` 
    <p style="font-weight:bold;">السعر الإجمالي :<span style="color:#4ab323;font-weight:bold;">${sum} ل.س</span></p>
    `;
  }
}

const total = document.querySelector(".total");
let sum = 0;
function totalPrice() {
  for (let i = 0; i < inCart.length; i++) {
    total.innerHTML += `
    <p><span>+</span> ${inCart[i].price} ل.س</p>
    `;
    sum += inCart[i].price;
  }
  total.innerHTML += ` 
  <p style="font-weight:bold;">السعر الإجمالي :<span style="color:#4ab323;font-weight:bold;">${sum} ل.س</span></p>
  `;
}

displayCart();
totalPrice();
