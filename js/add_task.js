
document.addEventListener("click", function(e) {
  closeAllSelect(e.target);
});

function closeAllSelect(elmnt) {
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
      if (elmnt == y[i]) {
          arrNo.push(i)
      } else {
          y[i].classList.remove("select-arrow-active");
      }
  }
  for (i = 0; i < x.length; i++) {
      if (arrNo.indexOf(i)) {
          x[i].style.display = "none";
      }
  }
}

document.querySelector('.select-selected').addEventListener('click', function(e) {
  e.stopPropagation();
  closeAllSelect(this);
  this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';
});

document.querySelectorAll('.select-items div input').forEach(function(checkbox) {
  checkbox.addEventListener('click', function(e) {
      e.stopPropagation();
  });
});

