let slideIndex = 0; 
const slides = document.querySelectorAll('.slide'); 
const slideInterval = 3000; 

function showSlides() { 
    slides.forEach(slide => { 
        slide.classList.remove('fade');
    });
    
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add('fade'); 
}

document.addEventListener('DOMContentLoaded', function () {
   
    if (slides.length > 0) {
        slides[0].classList.add('fade'); 
        setInterval(showSlides, slideInterval); 
    }

  
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

    if (currentUser) {
        document.body.classList.add('logged-in');
    } else {
        document.body.classList.remove('logged-in');
    }

    const gameData = [
        { id: '1', title: 'Stick Cart', price: 59.99, image: 'Stick-cart.png', description: 'Race with your friends in the ultimate stick cart championship' },
        { id: '2', title: 'Stick Warfare', price: 49.99, image: 'Stick-warfare.png', description: 'Fight against other stickpeople by yourself or with your friends in this modern deadly stick war.' },
        { id: '3', title: 'Stick Fest', price: 39.99, image: 'Stick-fest.png', description: 'Dance and have fun with other stickpeople in this musically driven dance filled stick fest.' },
        { id: '4', title: 'For Stick', price: 54.99, image: 'For-stick.png', description: 'Fight for your fiefdom in this medieval stick world using wide range of weapons such as sword, spear and axe.' },
        { id: '5', title: 'Warfare Total Stick', price: 54.99, image: 'Warfare-total-stick.png', description: 'Lead your armies made of thousands of stick-troops to battle other commanders and conquer the stick-world.'},
        { id: '6', title: 'Slap Stick', price: 54.99, image: 'Slap-stick.png', description: 'Slap your way to the top in this ultimate stick slapping contest.' },
        { id: '7', title: 'Shaolin Stick', price: 54.99, image: 'Shaolin-stick.png', description: 'Learn the way of stick-shaolin and fight against your fellow practioners to win the position of the stick-abbot.'},
    ];

    function syncCurrentUserToUsers() {
        if (!currentUser) return;
        const index = users.findIndex(user => user.email === currentUser.email);
        if (index !== -1) {
            users[index] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    function initializeUserCart() {
        if (currentUser && !currentUser.cart) {
            currentUser.cart = [];
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            syncCurrentUserToUsers();
        }
    }

    function updateAuthUI() {
        const userIcon = document.getElementById('user-icon');
        const loginLink = document.getElementById('login-link') || document.querySelector('a[href="Log.html"]');
        const signupLink = document.getElementById('signup-link') || document.querySelector('a[href="Sign.html"]');

        if (currentUser) {
            userIcon?.classList.remove('hidden');
            loginLink && (loginLink.style.display = 'none');
            signupLink && (signupLink.style.display = 'none');
        } else {
            userIcon?.classList.add('hidden');
            loginLink && (loginLink.style.display = 'block');
            signupLink && (signupLink.style.display = 'block');
        }
    }

    function updateCartCount() {
        const count = currentUser ? currentUser.cart.reduce((total, item) => total + item.quantity, 0) : 0;
        document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
    }
 
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
        syncCurrentUserToUsers();
        updateCartCount();

        const successMsg = document.createElement('div');
        successMsg.className = 'cart-success';
        successMsg.textContent = `${game.title} added to cart!`;
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 2000);
    }

    function removeFromCart(gameId) {
        if (!currentUser) return;

        const item = currentUser.cart.find(item => item.id === gameId);
        if (item) { 
            if (item.quantity > 1){
                item.quantity -= 1;
            }else{ 
                currentUser.cart = currentUser.cart.filter(item => item.id !== gameId);
            }
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        syncCurrentUserToUsers();
        updateCartCount();
        renderCart();
    }

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

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                removeFromCart(button.getAttribute('data-id'));
            });
        });

        const tax = subtotal * 0.2;
        const total = subtotal + tax;

        subtotalEl.textContent = `€${subtotal.toFixed(2)}`;
        taxEl.textContent = `€${tax.toFixed(2)}`;
        totalEl.textContent = `€${total.toFixed(2)}`;
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', e => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            if (users.some(user => user.email === email)) {
                alert('User with this email already exists!');
                return;
            }

            const newUser = { id: Date.now().toString(), username, email, password, cart: [] };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            currentUser = newUser;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            alert('Account created successfully!');
            window.location.href = 'index.html';
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const user = users.find(u => u.email === email && u.password === password);
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


    const dropdownBtn = document.getElementById('user-dropdown-btn');
    const dropdownContent = document.getElementById('user-dropdown');
    const logoutBtn = document.getElementById('logout');

    if (currentUser && currentUser.username) {
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) usernameDisplay.textContent = currentUser.username;
    }

    if (dropdownBtn) {
        dropdownBtn.addEventListener('click', e => {
            e.stopPropagation();
            dropdownContent?.classList.toggle('show');
        });
    }
 
    document.addEventListener('click', () => {
        dropdownContent?.classList.remove('show');
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', e => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

   
    document.querySelectorAll('.game-card .btn').forEach((btn, index) => {
        btn.addEventListener('click', () => addToCart(gameData[index]));
    });


    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (!currentUser) {
                alert('Please log in to proceed to checkout!');
                window.location.href = 'Log.html';
                return;
            }
            if (!currentUser.cart.length) {
                alert('Your cart is empty!');
                return;
            }
            alert('Checkout functionality would go here in a real application!');
        });
    }

   
    const descriptionBox = document.createElement('div');
descriptionBox.classList.add('game-description-box');
document.body.appendChild(descriptionBox);

document.querySelectorAll('.game-card').forEach(card => {
    const index = card.getAttribute('data-index');
    const game = gameData[index];

    card.addEventListener('mouseenter', (e) => {
        descriptionBox.textContent = game.description;
        descriptionBox.style.display = 'block';
    });

    card.addEventListener('mousemove', (e) => {
        descriptionBox.style.left = `${e.pageX + 20}px`;
        descriptionBox.style.top = `${e.pageY}px`;
    });

    card.addEventListener('mouseleave', () => {
        descriptionBox.style.display = 'none';
    });
});



    initializeUserCart();
    updateAuthUI();
    updateCartCount();
    renderCart();
});
