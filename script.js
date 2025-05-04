// Slideshow functionality with 3 second interval
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
const slideInterval = 3000; // 3 seconds

function showSlides() {
    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('fade');
    });
    
    // Move to next slide
    slideIndex++;
    if (slideIndex >= slides.length) {
        slideIndex = 0;
    }
    
    // Show current slide
    slides[slideIndex].classList.add('fade');
}

// Initialize slideshow
document.addEventListener('DOMContentLoaded', () => {
    // Show first slide immediately
    slides[0].classList.add('fade');
    
    // Set up automatic rotation
    setInterval(showSlides, slide
