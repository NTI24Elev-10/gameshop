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

// User Authentication and Cart System
document.addEventListener('DOMContentLoaded', function() {
    // Initialize data storage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    
    // Game data
    const gameData = [
        { id: '1', title: 'Stick Cart', price: 59.99, image: 'Stick-cart.png' },
        { id: '2', title: 'Stick Warfare', price: 49.99, image: 'Stick-warfare.png' },
        { id: '3', title: 'Stick Fest', price: 39.99, image: 'Stick-fest.png'},
        { id: '4', title: 'For Stick', price: 54.99, image: 'For-stick.png'},
        { id: '5', title: 'Warfare Total Stick', price: 54.99, image: 'Warfare-total-stick.png'},
        { id: '6', title: 'Slap Stick', price: 54.99, image: 'Slap-stick.png'},
        { id: '7', title: 'Shaolin Stick', price: 54.99, image: 'Shaolin-stick.png'},
    ];

    // Initialize user's cart if doesn't exist
    function initializeUserCart() {
        if (currentUser && !currentUser.cart) {
            currentUser.cart = [];
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    }

    // Update UI based on authentication state
    function updateAuthUI() {
        const userIcon = document.getElementById('user-icon');
        const loginLink = document.getElementById('login-link') || document.querySelector('a[href="Log.html"]');
        const signupLink = document.getElementById('signup-link') || document.querySelector('a[href="Sign.html"]');
        
        if (currentUser) {
            if (userIcon) userIcon.classList.remove('hidden');
            if (loginLink) loginLink.style.display = 'none';
            if (signupLink) signupLink.style.display = 'none';
        } else {
            if (userIcon) userIcon.classList.add('hidden');
            if (loginLink) loginLink.style.display = 'block';
            if (signupLink) signupLink.style.display = 'block';
        }
    }

    // Update cart count in header
    function updateCartCount() {
        const count = currentUser ? currentUser.cart.reduce((total, item) => total + item.quantity, 0) : 0;
        document.querySelectorAll('#cart-count').forEach(el => {
            el.textContent = count;
        });
    }

    // Sign up form handler
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Validate email format
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Check if user already exists
            if (users.some(user => user.email === email)) {
                alert('User with this email already exists!');
                return;
            }

            // Create new user
            const newUser = {
                id: Date.now().toString(),
                username,
                email,
                password,
                cart: []
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Log in the new user
            currentUser = newUser;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            alert('Account created successfully!');
            window.location.href = 'index.html';
        });
    }

    // Login form handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const user = users.find(user => user.email === email && user.password === password);
            if (user) {
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                alert(`Welcome back, ${user.username}!`);
                window.location.href = 'index.html';
            } else {
                alert('Invalid email or password.');
            }
        });
    }

    // User dropdown functionality
    const userIcon = document.getElementById('user-icon');
    if (userIcon) {
        userIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = document.getElementById('user-dropdown');
            dropdown.classList.toggle('hidden');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown && !dropdown.classList.contains('hidden')) {
            dropdown.classList.add('hidden');
        }
    });

    // Logout handler
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            currentUser = null;
            alert('Logged out successfully.');
            window.location.href = 'index.html';
        });
    }

    // Add to cart function
    function addToCart(game) {
        if (!currentUser) {
            alert('Please log in to add items to your cart!');
            window.location.href = 'Log.html';
            return;
        }
        
        const existingItem = currentUser.cart.find(item => item.id === game.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            currentUser.cart.push({ ...game, quantity: 1 });
        }
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateCartCount();
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'cart-success';
        successMsg.textContent = `${game.title} added to cart!`;
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
            successMsg.remove();
        }, 2000);
    }

    // Remove from cart function
    function removeFromCart(gameId) {
        if (!currentUser) return;
        
        currentUser.cart = currentUser.cart.filter(item => item.id !== gameId);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
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

        if (!currentUser || currentUser.cart.length === 0) {
            cartItemsEl.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            subtotalEl.textContent = '€0.00';
            taxEl.textContent = '€0.00';
            totalEl.textContent = '€0.00';
            return;
        }

        let subtotal = 0;
        cartItemsEl.innerHTML = currentUser.cart.map(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">€${item.price.toFixed(2)}</div>
                        <div>Quantity: ${item.quantity}</div>
                        <button class="remove-item" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            `;
        }).join('');

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                removeFromCart(this.getAttribute('data-id'));
            });
        });

        const tax = subtotal * 0.2; // 20% tax
        const total = subtotal + tax;

        subtotalEl.textContent = `€${subtotal.toFixed(2)}`;
        taxEl.textContent = `€${tax.toFixed(2)}`;
        totalEl.textContent = `€${total.toFixed(2)}`;
    }

    // Initialize everything
    initializeUserCart();
    updateAuthUI();
    updateCartCount();
    renderCart();
    
    // Add click handlers for "Add to Cart" buttons
    document.querySelectorAll('.game-card .btn').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            addToCart(gameData[index]);
        });
    });

    // Checkout button handler
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (!currentUser) {
                alert('Please log in to proceed to checkout!');
                window.location.href = 'Log.html';
                return;
            }
            
            if (!currentUser.cart || currentUser.cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            alert('Checkout functionality would go here in a real application!');
        });
    }
});
