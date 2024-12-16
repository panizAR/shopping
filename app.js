// open modal
const basket = document.querySelector(".basket");
const backdrop = document.querySelector(".backdrop");
const closeBtn = document.querySelectorAll(".close-modal");

basket.addEventListener("click", openModal);
closeBtn.forEach((btn) => btn.addEventListener("click", closeModal));

function openModal() {
  backdrop.classList.remove("hidden");
}

function closeModal() {
  console.log("object");
  backdrop.classList.add("hidden");
}
