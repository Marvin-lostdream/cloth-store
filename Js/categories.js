function classActive(pElement, cElement) {
  const parent = document.querySelector(pElement);

  parent.addEventListener("click", (e) => {
    const target = e.target.closest(cElement);
    if (!target) return;

    parent.querySelectorAll(cElement).forEach((el) => {
      el.classList.remove("active");
    });
    target.classList.add("active");
  });
}

classActive(".all-sections ul", "li");
classActive(".clothes ul", "li");

// Start Get Products

const products = document.querySelector(".products");
const clothesSection = document.querySelector(".clothes ul");

fetch("/products.json")
  .then((res) => res.json())
  .then((data) => {
    let path = window.location.pathname;
    let targetCategory;

    if (path === "/categoryMen.html") targetCategory = "men";
    else if (path === "/categoryWomen.html") targetCategory = "women";
    else if (path === "/categoryKids.html") targetCategory = "kids";
    else if (path === "/categoryAccessories.html")
      targetCategory = "accessories";

    const defaultCategory = data.categories.find(
      (cat) => cat.name === targetCategory,
    );
    const defaultSection = defaultCategory.subcategories.find(
      (sec) => sec.name,
    ).name;
    const defaultIndex = data.categories.findIndex(
      (ind) => ind.name === targetCategory,
    );
    const defaultSubindex = defaultCategory.subcategories.findIndex(
      (ind) => ind.name === defaultSection,
    );
    displayProducts(
      defaultCategory.name,
      defaultSection,
      defaultIndex,
      defaultSubindex,
    );
    clothesSection.addEventListener("click", (e) => {
      const li = e.target.closest("li");
      if (!li) return;
      products.innerHTML = "";

      const section = li.dataset.section;
      const category = products.dataset.category;

      const index = data.categories.findIndex((cate) => cate.name === category);
      if (index === -1) return;
      const subindex = data.categories[index].subcategories.findIndex(
        (sub) => sub.name === section,
      );
      if (subindex === -1) return;

      displayProducts(category, section, index, subindex);
    });

    // Product Card

    function productCard(product) {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
      const title = document.createElement("h3");
      title.textContent = product.name;
      const img = document.createElement("img");
      img.src = product.image;
      img.alt = product.name;
      const infoDiv = document.createElement("div");
      infoDiv.classList.add("info");
      const price = document.createElement("p");
      const finalPrice = product.special ? product.price * 0.9 : product.price;
      price.innerHTML = `السعر : <span>${finalPrice} ل.س</span>`;
      const status = document.createElement("p");
      status.innerHTML = `الحالة : <span style="color: ${product.inStock ? "blue" : "red"}">${product.inStock ? "متوفر" : "غير متوفر"}</span>`;
      infoDiv.appendChild(price);
      infoDiv.appendChild(status);

      const cartBtn = document.createElement("button");
      cartBtn.classList.add("cartBtn");
      cartBtn.textContent = product.inStock
        ? "إضافة إلى السلة"
        : "غير متاح حاليا";

      if (!product.inStock) {
        cartBtn.style.cssText =
          "background-color: #6e6e6e; color:black; pointer-events: none; user-select: none";
      } else {
        cartBtn.style.cssText = "background-color: #ff5722; color:black";
      }
      const detailsBtn = document.createElement("button");
      detailsBtn.classList.add("detailsBtn");
      detailsBtn.textContent = "تفاصيل المنتج";

      if (product.special) {
        const specialDiv = document.createElement("div");
        specialDiv.classList.add("special");
        specialDiv.textContent = "حسم %10";
        productDiv.appendChild(specialDiv);
      }
      productDiv.appendChild(title);
      productDiv.appendChild(img);
      productDiv.appendChild(infoDiv);
      productDiv.appendChild(cartBtn);
      productDiv.appendChild(detailsBtn);

      products.appendChild(productDiv);

      const added = document.querySelector(".added");

      cartBtn.addEventListener("click", () => {
        addToCart(product, added);
      });

      detailsBtn.addEventListener("click", () => {
        const existingOverlay = document.querySelector(".overlay");
        const existingDetails = document.querySelector(".product-details");
        if (existingOverlay) existingOverlay.remove();
        if (existingDetails) existingDetails.remove();

        document.body.insertAdjacentHTML(
          "beforeend",
          `
          <div class="overlay"></div>
            <div class="product-details">
              <button class="closeBtn"><i class="fa-solid fa-xmark"></i></button>
              <hr/>
              <div class="details">
                <img src="${product.image}" alt="${product.name}" />
                  <div class="infoDiv">
                    <div class="info">
                      <p>القياسات :<span style="color: rgb(61, 61, 175)"> متوفر بجميع القياسات</span></p>
                      <p>الحالة :<span style="color: ${product.inStock ? "blue" : "red"}">${product.inStock ? "متوفر" : "غير متوفر"}</span></p>
                      <p>السعر : ${product.special ? `<span style="text-decoration: line-through; color: #acacac;">${product.price}</span> <span style="color: blue;">${product.price * 0.9} ل.س</span>` : product.price + " ل.س"}</p>
                    </div>
                  <button class="cartBtn detailsCartBtn" style="${product.inStock ? "background-color: #ff5722; color:black;" : "background-color: #6e6e6e; color:black; pointer-events: none; user-select: none"}">${product.inStock ? "إضافة إلى السلة" : "غير متاح حاليا"}</button>
                </div>
              </div>
            </div>
    `,
        );

        const closeBtn = document.querySelector(".closeBtn");
        const overlay = document.querySelector(".overlay");
        const detailsCartBtn = document.querySelector(".detailsCartBtn");

        const closeModal = () => {
          document.querySelector(".product-details")?.remove();
          document.querySelector(".overlay")?.remove();
        };

        closeBtn.onclick = closeModal;
        overlay.onclick = closeModal;

        if (detailsCartBtn && product.inStock) {
          detailsCartBtn.onclick = () => {
            addToCart(product, added);
            closeModal();
          };
        }
      });
    }

    // Send To LocalStorage

    function addToCart(product, addedElement) {
      addedElement.style.left = "0";

      const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
      const exists = cart.some((item) => item.name === product.name);

      if (exists) {
        addedElement.innerHTML = "! تمت إضافته في السلة مسبقا";
        addedElement.style.backgroundColor = "#dd4e4e";
      } else {
        let finalPrice = product.special ? product.price * 0.9 : product.price;

        cart.push({
          name: product.name,
          price: finalPrice,
          image: product.image,
          inStock: product.inStock,
        });

        localStorage.setItem("cartItems", JSON.stringify(cart));

        addedElement.innerHTML = "! تمت الإضافة إلى السلة";
        addedElement.style.backgroundColor = "#44cc88";
      }
      setTimeout(() => {
        addedElement.style.left = "-100%";
      }, 2000);
    }
    function displayProducts(category, section, index, subindex) {
      for (
        let i = 0;
        i < data.categories[index].subcategories[subindex].products.length;
        i++
      ) {
        const productJson =
          data.categories[index].subcategories[subindex].products[i];
        productCard(productJson);
      }
    }

    // Search input

    let search = document.getElementById("search");
    search.addEventListener("input", () => {
      const value = search.value.toLowerCase();
      products.innerHTML = "";
      let msg = document.getElementById("msgNotFound");

      if (value === "") {
        displayProducts(
          defaultCategory.name,
          defaultSection,
          defaultIndex,
          defaultSubindex,
        );
        msg.remove();
        return;
      }
      let found = false;
      defaultCategory.subcategories.forEach((sub) => {
        sub.products.forEach((product) => {
          if (product.name.toLowerCase().includes(value)) {
            productCard(product);
            found = true;
            if (msg) {
              msg.remove();
            }
          }
        });
      });

      if (!found && !msg) {
        products.insertAdjacentHTML(
          "afterend",
          `<p id="msgNotFound" style = "text-align:center; color:red; margin-bottom:30px;">لا توجد منتجات مطابقة</p>`,
        );
      }
    });
  });

// Up Button
let btnAdded = false;
window.onscroll = () => {
  if (window.scrollY >= 400 && !btnAdded) {
    let upBtn = document.createElement("button");
    upBtn.classList.add("upBtn");
    upBtn.textContent = "↑";
    upBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    background: #ff0000;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 26px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.9);
    z-index: 1000;
    opacity:0;
    transition:all 0.3s;
    `;
    document.body.appendChild(upBtn);
    btnAdded = true;
    upBtn.onclick = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };
  } else if (btnAdded) {
    let upBtn = document.querySelector(".upBtn");
    if (upBtn) {
      if (window.scrollY < 400) {
        upBtn.style.opacity = "0";
        upBtn.style.pointerEvents = "none";
      } else {
        upBtn.style.opacity = "1";
        upBtn.style.pointerEvents = "all";
      }
    }
  }
};
