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
    setInterval(showSlides, slideInterval);
});

// Handle sign-up
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Save user to localStorage
        localStorage.setItem('user', JSON.stringify({ username, email, password }));
        alert('Account created successfully!');
        window.location.href = 'Log.html';
    });
}

// Handle login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const savedUser = JSON.parse(localStorage.getItem('user'));
        if (savedUser && savedUser.email === email && savedUser.password === password) {
            alert(`Welcome, ${savedUser.username}!`);
            window.location.href = 'index.html';
        } else {
            alert('Invalid credentials.');
        }
    });
}

    // Show user icon if logged in
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const userIcon = document.getElementById('user-icon');
    const loginLink = document.querySelector('a[href="Log.html"]');
    const signupLink = document.querySelector('a[href="Sign.html"]');

    if (savedUser && userIcon) {
        userIcon.classList.remove('hidden');
        if (loginLink) loginLink.style.display = 'none';
        if (signupLink) signupLink.style.display = 'none';
    }

    // Toggle dropdown menu on user icon click
    if (userIcon) {
        userIcon.addEventListener('click', () => {
            const dropdown = document.getElementById('user-dropdown');
            dropdown.classList.toggle('hidden');
        });
    }

    // Handle logout
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('user');
            alert('Logged out successfully.');
            window.location.reload();
        });
    }


// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in header
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = count;
    });
}

// Add to cart function (call when "Add to Cart" is clicked)
function addToCart(game) {
    const existingItem = cart.find(item => item.id === game.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...game, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Remove from cart
function removeFromCart(gameId) {
    cart = cart.filter(item => item.id !== gameId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

// Render cart page
function renderCart() {
    const cartItemsEl = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    if (!cartItemsEl) return;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        subtotalEl.textContent = '€0.00';
        taxEl.textContent = '€0.00';
        totalEl.textContent = '€0.00';
        return;
    }

    let subtotal = 0;
    cartItemsEl.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">€${item.price.toFixed(2)}</div>
                    <div>Quantity: ${item.quantity}</div>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')">Remove</button>
                </div>
            </div>
        `;
    }).join('');

    const tax = subtotal * 0.5; // 50% tax
    const total = subtotal + tax;

    subtotalEl.textContent = `€${subtotal.toFixed(2)}`;
    taxEl.textContent = `€${tax.toFixed(2)}`;
    totalEl.textContent = `€${total.toFixed(2)}`;
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // If on cart page, render cart
    if (document.getElementById('cart-items')) {
        renderCart();
    }
    
    
    window.gameData = [
        { id: '1', title: 'Stick Cart', price: 59.99, image: 'Stick-cart.png' },
        { id: '2', title: 'Stick Warfare', price: 49.99, image: 'Stick-warfare.png' },
        { id: '3', title: 'Stick Fest', price: 39.99, image: 'Stick-fest.png'},
        { id: '4', title: 'For Stick', price: 54.99, image: 'For-stick.png'},
        { id: '5', title: 'Warfare Total Stick', price: 54.99, image: 'Warfare-total-stick.png'},
        { id: '6', title: 'Slap Stick', price: 54.99, image: 'Slap-stick.png'},
        { id: '7', title: 'Shaolin Stick', price: 54.99, image: 'Shaolin-stick.png'},
    ];
    
    // Add click handlers for "Add to Cart" buttons
    document.querySelectorAll('.game-card .btn').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            addToCart(window.gameData[index]);
        });
    });
});
