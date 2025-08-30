// Carrusel de galería para nosotros.html

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.indicator');
  let currentSlide = 0;
  let autoSlideInterval;

  function updateIndicators() {
    indicators.forEach((indicator, i) => {
      if (i === currentSlide) {
        indicator.style.backgroundColor = 'var(--color-amarillo)';
        indicator.classList.add('active');
      } else {
        indicator.style.backgroundColor = '#D1D5DB';
        indicator.classList.remove('active');
      }
    });
  }

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.opacity = i === index ? '1' : '0';
    });
    updateIndicators();
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
    resetAutoSlide();
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 3000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSlide(index));
    indicator.addEventListener('mouseenter', () => {
      if (!indicator.classList.contains('active')) {
        indicator.style.backgroundColor = '#F59E0B';
      }
    });
    indicator.addEventListener('mouseleave', () => {
      if (!indicator.classList.contains('active')) {
        indicator.style.backgroundColor = '#D1D5DB';
      }
    });
  });

  if (slides.length > 0 && indicators.length > 0) {
    showSlide(0);
    startAutoSlide();
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
      });
      carouselContainer.addEventListener('mouseleave', () => {
        startAutoSlide();
      });
    }
  }
});
