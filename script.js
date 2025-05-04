// Slideshow functionality
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');

function showSlides() {
    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('fade');
    });
    
    // Move to next slide
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    
    // Show current slide
    slides[slideIndex-1].classList.add('fade');
    
    // Change image every 3 seconds
    setTimeout(showSlides, 3000);
}

// Start the slideshow when page loads
document.addEventListener('DOMContentLoaded', () => {
    showSlides();
    
    // Initialize first slide
    slides[0].classList.add('fade');
});
