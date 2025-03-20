document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.carousel-item img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        const smallSrc = src.replace(/(\.[a-z]+)$/, '-small$1');
        if (window.innerWidth < 992) {
            img.setAttribute('src', smallSrc);
        }
    });
});
