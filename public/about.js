(function () {
  const backgroundImage = new Image();
  backgroundImage.src = './resources/promo.jpg';
  backgroundImage.onload = () => {
    const header = document.getElementById('header');
    header.classList.add('show');
  };
})();
