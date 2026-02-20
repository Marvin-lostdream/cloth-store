const bars = document.querySelector(".bars");
const sections = document.querySelector(".sections");

bars.addEventListener("click", (el) => {
  el.stopPropagation();
  bars.classList.toggle("clicked");
  sections.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if (!bars.contains(e.target) && !sections.contains(e.target)) {
    bars.classList.remove("clicked");
    sections.classList.remove("active");
  }
});

const text = "عالم من أحدث الملابس والاكسسوارت";
const el = document.getElementById("typewriter");
let i = 0;

function typeWriter() {
  el.textContent = text.slice(0, i);
  i++;

  if (i <= text.length) {
    setTimeout(typeWriter, 50);
  }
}

typeWriter();

const start = document.querySelector(".start");

start.onclick = () => {
  window.scrollTo({
    top: 750,
    behavior: "smooth",
  });
};
