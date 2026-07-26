const items = document.querySelectorAll(".faq-item");
const search = document.getElementById("search");

// Accordion
items.forEach(item => {
  const btn = item.querySelector(".faq-question");

  btn.addEventListener("click", () => {
    items.forEach(el => {
      if (el !== item) el.classList.remove("active");
    });

    item.classList.toggle("active");
  });
});

// Search filter
search.addEventListener("input", () => {
  const value = search.value.toLowerCase();

  items.forEach(item => {
    const text = item.innerText.toLowerCase();

    if (text.includes(value)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
});