var hamburgerMenu = document.querySelector(".togglemenus");
hamburgerMenu.addEventListener("click", function () {
  document.querySelector(".menuoutbox").classList.toggle("slide");
  document.querySelector(".mobile-patch").classList.toggle("show");
});

document.querySelector(".mobile-patch").addEventListener("click", function () {
  document.querySelector(".menuoutbox").classList.remove("slide");
  document.querySelector(".mobile-patch").classList.remove("show");
});
