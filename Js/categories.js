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
    function displayProducts(category, section, index, subindex) {
      for (
        let i = 0;
        i < data.categories[index].subcategories[subindex].products.length;
        i++
      ) {
        let product = document.createElement("div");
        product.classList.add("product");
        let title = document.createElement("h3");
        title.append(
          data.categories[index].subcategories[subindex].products[i].name,
        );
        let productImg = document.createElement("img");
        productImg.src =
          data.categories[index].subcategories[subindex].products[i].image;
        productImg.alt =
          data.categories[index].subcategories[subindex].products[i].name;
        let info = document.createElement("div");
        info.classList.add("info");
        let price = document.createElement("p");
        price.appendChild(document.createTextNode("السعر : "));
        let pSpan = document.createElement("span");
        pSpan.append(
          data.categories[index].subcategories[subindex].products[i].price,
        );
        pSpan.innerHTML += " ل.س ";
        price.appendChild(pSpan);
        let stats = document.createElement("p");
        stats.appendChild(document.createTextNode("الحالة :"));
        let sSpan = document.createElement("span");
        let inStock =
          data.categories[index].subcategories[subindex].products[i].inStock;
        sSpan.innerHTML = inStock ? " متوفر " : " غير متوفر ";
        sSpan.style.color = inStock ? "blue" : "red";
        stats.appendChild(sSpan);
        info.appendChild(price);
        info.appendChild(stats);
        let cartbtn = document.createElement("button");
        cartbtn.classList.add("cartBtn");
        if (inStock) {
          cartbtn.style.cssText = "background-color: #ff5722; color:black";
          cartbtn.innerHTML = "إضافة إلى السلة";
        } else {
          cartbtn.style.cssText =
            "background-color: #6e6e6e; color:black; pointer-events: none; user-select: none";
          cartbtn.innerHTML = "غير متاح حاليا";
        }

        let discount =
          data.categories[index].subcategories[subindex].products[i].special;

        let special = document.createElement("div");
        special.classList.add("special");
        let spDiscount = document.createTextNode("حسم %10");
        special.appendChild(spDiscount);
        if (discount) {
          product.appendChild(special);
          let newPrice =
            (data.categories[index].subcategories[subindex].products[i].price /
              10) %
            100;
          pSpan.innerHTML = newPrice + " ل.س ";
        }

        // Send To LocalStorage

        cartbtn.addEventListener("click", () => {
          const added = document.querySelector(".added");

          setTimeout(() => {
            added.style.left = 0;
          }, 0);
          setTimeout(() => {
            added.style.left = -100 + "%";
          }, 2000);

          const product =
            data.categories[index].subcategories[subindex].products[i];

          const cart = JSON.parse(localStorage.getItem("cartItems")) || [];

          const exists = cart.some((item) => item.name === product.name);
          if (exists) {
            added.innerHTML = "! تمت إضافته في السلة مسبقا";
            added.style.backgroundColor = "#dd4e4e";
            setTimeout(() => {
              added.style.left = 0;
            }, 0);
            setTimeout(() => {
              added.style.left = -100 + "%";
            }, 2000);
            return;
          } else {
            added.innerHTML = "! تمت الإضافة إلى السلة";
            added.style.backgroundColor = "#44cc88";
            setTimeout(() => {
              added.style.left = 0;
            }, 0);
            setTimeout(() => {
              added.style.left = -100 + "%";
            }, 2000);
          }

          cart.push({
            name: product.name,
            price: product.price,
            image: product.image,
            inStock: product.inStock,
          });

          localStorage.setItem("cartItems", JSON.stringify(cart));
        });

        product.appendChild(title);
        product.appendChild(productImg);
        product.appendChild(info);
        product.appendChild(cartbtn);
        // All products
        products.appendChild(product);
      }
    }
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
