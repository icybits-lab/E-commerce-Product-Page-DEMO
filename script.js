// E-commerce Product Page
document.addEventListener('DOMContentLoaded', function() {
    // State
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    let currentProduct = {
        id: 'TG-PRO-2024',
        name: 'TechGear Pro Wireless Headphones',
        basePrice: 249.99,
        color: 'black',
        colorName: 'Matte Black',
        model: 'standard',
        modelPrice: 249.99,
        accessories: [],
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    };

    // DOM Elements
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.querySelector('.close-cart');
    const continueShopping = document.getElementById('continueShopping');
    const cartCount = document.getElementById('cartCount');
    const wishlistBtn = document.getElementById('wishlistBtn');
    const wishlistCount = document.getElementById('wishlistCount');
    const addToWishlistBtn = document.getElementById('addToWishlist');
    const addToCartBtn = document.getElementById('addToCart');
    const addToCartMobile = document.getElementById('addToCartMobile');
    const buyNowBtn = document.getElementById('buyNow');
    const buyNowMobile = document.getElementById('buyNowMobile');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckout = document.getElementById('closeCheckout');
    const viewCart = document.getElementById('viewCart');
    const zoomBtn = document.getElementById('zoomBtn');
    const zoomModal = document.getElementById('zoomModal');
    const quantityInput = document.getElementById('quantity');
    const quantityMinus = document.getElementById('quantityMinus');
    const quantityPlus = document.getElementById('quantityPlus');
    
    // Price elements
    const subtotalPrice = document.getElementById('subtotalPrice');
    const totalPrice = document.getElementById('totalPrice');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');

    // Initialize
    function init() {
        updateCartCount();
        updateWishlistCount();
        updatePrice();
        loadProductImages();
        setupEventListeners();
        loadCartItems();
        setupTabNavigation();
        setupFAQ();
        setupReviewRating();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Mobile menu toggle
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        // Cart sidebar
        cartBtn.addEventListener('click', () => cartSidebar.classList.add('active'));
        closeCart.addEventListener('click', () => cartSidebar.classList.remove('active'));
        continueShopping.addEventListener('click', () => cartSidebar.classList.remove('active'));

        // Wishlist
        wishlistBtn.addEventListener('click', () => {
            alert('Wishlist feature would open here');
        });

        addToWishlistBtn.addEventListener('click', addToWishlist);

        // Add to cart
        addToCartBtn.addEventListener('click', () => addToCart(false));
        addToCartMobile.addEventListener('click', () => addToCart(false));

        // Buy now
        buyNowBtn.addEventListener('click', () => addToCart(true));
        buyNowMobile.addEventListener('click', () => addToCart(true));

        // Checkout
        checkoutBtn.addEventListener('click', showCheckoutModal);
        closeCheckout.addEventListener('click', () => checkoutModal.classList.remove('active'));
        viewCart.addEventListener('click', () => {
            checkoutModal.classList.remove('active');
            cartSidebar.classList.add('active');
        });

        // Close modals on outside click
        [checkoutModal, zoomModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });

        // Image zoom
        zoomBtn.addEventListener('click', zoomImage);
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.addEventListener('click', changeProductImage);
        });

        // Quantity controls
        quantityMinus.addEventListener('click', () => {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
                currentProduct.quantity = value - 1;
                updatePrice();
            }
        });

        quantityPlus.addEventListener('click', () => {
            let value = parseInt(quantityInput.value);
            if (value < 10) {
                quantityInput.value = value + 1;
                currentProduct.quantity = value + 1;
                updatePrice();
            }
        });

        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
                currentProduct.quantity = 1;
            } else if (value > 10) {
                this.value = 10;
                currentProduct.quantity = 10;
            } else {
                currentProduct.quantity = value;
            }
            updatePrice();
        });

        // Color selection
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                const color = this.dataset.color;
                const colorName = this.dataset.colorName;
                
                currentProduct.color = color;
                currentProduct.colorName = colorName;
                
                // Update main image based on color (in a real app)
                updateProductImageForColor(color);
            });
        });

        // Model selection
        document.querySelectorAll('.model-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.model-option').forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                const model = this.dataset.model;
                const price = parseFloat(this.dataset.price);
                
                currentProduct.model = model;
                currentProduct.modelPrice = price;
                currentProduct.basePrice = price;
                
                updatePrice();
            });
        });

        // Accessory selection
        document.querySelectorAll('.accessory-option input').forEach(input => {
            input.addEventListener('change', function() {
                const accessory = this.value;
                const price = parseFloat(this.dataset.price);
                
                if (this.checked) {
                    if (!currentProduct.accessories.includes(accessory)) {
                        currentProduct.accessories.push(accessory);
                    }
                } else {
                    currentProduct.accessories = currentProduct.accessories.filter(a => a !== accessory);
                }
                
                updatePrice();
            });
        });

        // Close modal buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.modal').classList.remove('active');
            });
        });

        // Load more reviews
        document.getElementById('loadMoreReviews').addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check"></i> No more reviews to load';
                this.disabled = true;
            }, 1500);
        });

        // Related products add to cart
        document.querySelectorAll('.products-grid .btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                const price = parseFloat(productCard.querySelector('.price').textContent.replace('$', ''));
                
                // Add to cart
                cart.push({
                    id: 'REL-' + Date.now(),
                    name: productName,
                    price: price,
                    quantity: 1,
                    image: productCard.querySelector('img').src
                });
                
                saveCart();
                updateCartCount();
                loadCartItems();
                
                // Show success message
                showNotification(`Added ${productName} to cart!`);
            });
        });

        // Wishlist buttons in related products
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const icon = this.querySelector('i');
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.style.color = '#e74c3c';
                    wishlist.push('product-' + Date.now());
                    updateWishlistCount();
                    showNotification('Added to wishlist!');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    icon.style.color = '';
                    wishlist.pop();
                    updateWishlistCount();
                    showNotification('Removed from wishlist!');
                }
                
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
            });
        });
    }

    // Setup tab navigation
    function setupTabNavigation() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Show active tab pane
                tabPanes.forEach(pane => pane.classList.remove('active'));
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // Setup FAQ accordion
    function setupFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const faqItem = this.closest('.faq-item');
                faqItem.classList.toggle('active');
            });
        });
    }

    // Setup review rating stars
    function setupReviewRating() {
        const stars = document.querySelectorAll('.rating-input i');
        
        stars.forEach(star => {
            star.addEventListener('mouseenter', function() {
                const rating = parseInt(this.dataset.rating);
                highlightStars(rating);
            });
            
            star.addEventListener('click', function() {
                const rating = parseInt(this.dataset.rating);
                // In a real app, this would submit the rating
                showNotification(`Thank you for your ${rating} star rating!`);
            });
        });
        
        document.querySelector('.rating-input').addEventListener('mouseleave', function() {
            // Clear highlighting when mouse leaves
            stars.forEach(star => star.classList.remove('active'));
        });
    }

    function highlightStars(rating) {
        const stars = document.querySelectorAll('.rating-input i');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    // Load product images
    function loadProductImages() {
        const mainImage = document.getElementById('mainProductImage');
        const thumbnails = document.querySelectorAll('.thumbnail');
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Update active thumbnail
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Check if it's a video thumbnail
                if (this.classList.contains('video-thumbnail')) {
                    const videoUrl = this.dataset.video;
                    // In a real app, you would embed the video
                    showNotification('Product video would play here');
                } else {
                    // Update main image
                    const newImage = this.dataset.image;
                    mainImage.src = newImage;
                    currentProduct.image = newImage;
                    
                    // Update zoom modal image
                    document.getElementById('zoomedImage').src = newImage;
                }
            });
        });
    }

    // Update product image based on color (simulated)
    function updateProductImageForColor(color) {
        const mainImage = document.getElementById('mainProductImage');
        const colorImages = {
            black: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            white: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            blue: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            red: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        };
        
        if (colorImages[color]) {
            mainImage.src = colorImages[color];
            currentProduct.image = colorImages[color];
            document.getElementById('zoomedImage').src = colorImages[color];
            
            // Update active thumbnail
            const thumbnails = document.querySelectorAll('.thumbnail');
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            thumbnails[0].classList.add('active'); // Default to first thumbnail
        }
    }

    // Change product image
    function changeProductImage(e) {
        const thumbnail = e.currentTarget;
        const mainImage = document.getElementById('mainProductImage');
        
        // Check if it's a video thumbnail
        if (thumbnail.classList.contains('video-thumbnail')) {
            const videoUrl = thumbnail.dataset.video;
            // In a real app, you would embed the video
            showNotification('Product video would play here');
            return;
        }
        
        const newImage = thumbnail.dataset.image;
        mainImage.src = newImage;
        currentProduct.image = newImage;
        
        // Update zoom modal image
        document.getElementById('zoomedImage').src = newImage;
        
        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
    }

    // Zoom image
    function zoomImage() {
        const mainImage = document.getElementById('mainProductImage');
        document.getElementById('zoomedImage').src = mainImage.src;
        zoomModal.classList.add('active');
    }

    // Update price calculation
    function updatePrice() {
        // Calculate accessories total
        const accessoryPrices = {
            case: 29.99,
            cable: 19.99,
            stand: 49.99,
            insurance: 39.99
        };
        
        let accessoriesTotal = 0;
        currentProduct.accessories.forEach(accessory => {
            accessoriesTotal += accessoryPrices[accessory] || 0;
        });
        
        // Calculate subtotal
        const subtotal = (currentProduct.basePrice + accessoriesTotal) * currentProduct.quantity;
        const tax = subtotal * 0.08; // 8% tax
        const shipping = subtotal >= 50 ? 0 : 9.99;
        const total = subtotal + tax + shipping;
        
        // Update display
        subtotalPrice.textContent = `$${subtotal.toFixed(2)}`;
        totalPrice.textContent = `$${total.toFixed(2)}`;
        
        // Update shipping and tax displays
        document.getElementById('shippingPrice').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        document.getElementById('taxPrice').textContent = `$${tax.toFixed(2)}`;
    }

    // Add to wishlist
    function addToWishlist() {
        // Check if already in wishlist
        const productId = `${currentProduct.id}-${currentProduct.color}-${currentProduct.model}`;
        
        if (!wishlist.includes(productId)) {
            wishlist.push(productId);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateWishlistCount();
            showNotification('Added to wishlist!');
            
            // Update button text
            addToWishlistBtn.innerHTML = '<i class="fas fa-heart"></i> In Wishlist';
            setTimeout(() => {
                addToWishlistBtn.innerHTML = '<i class="fas fa-heart"></i> Add to Wishlist';
            }, 2000);
        } else {
            showNotification('Already in wishlist!');
        }
    }

    // Add to cart
    function addToCart(goToCheckout) {
        // Create cart item
        const cartItem = {
            id: `${currentProduct.id}-${currentProduct.color}-${currentProduct.model}-${Date.now()}`,
            name: currentProduct.name,
            color: currentProduct.colorName,
            model: currentProduct.model.charAt(0).toUpperCase() + currentProduct.model.slice(1) + ' Edition',
            price: currentProduct.basePrice,
            accessories: [...currentProduct.accessories],
            quantity: currentProduct.quantity,
            image: currentProduct.image,
            subtotal: (currentProduct.basePrice + calculateAccessoriesTotal()) * currentProduct.quantity
        };
        
        // Add to cart
        cart.push(cartItem);
        saveCart();
        updateCartCount();
        loadCartItems();
        
        // Show success message
        showNotification(`Added ${currentProduct.quantity} × ${currentProduct.name} to cart!`);
        
        // If Buy Now, open cart sidebar
        if (goToCheckout) {
            cartSidebar.classList.add('active');
        }
    }

    // Calculate accessories total
    function calculateAccessoriesTotal() {
        const accessoryPrices = {
            case: 29.99,
            cable: 19.99,
            stand: 49.99,
            insurance: 39.99
        };
        
        return currentProduct.accessories.reduce((total, accessory) => {
            return total + (accessoryPrices[accessory] || 0);
        }, 0);
    }

    // Load cart items
    function loadCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyCart = document.querySelector('.empty-cart');
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <button class="btn btn-outline" id="continueShoppingBtn">Continue Shopping</button>
                </div>
            `;
            
            // Add event listener to continue shopping button
            document.getElementById('continueShoppingBtn')?.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
            });
            
            // Update cart summary
            updateCartSummary();
            return;
        }
        
        // Clear container
        cartItemsContainer.innerHTML = '';
        
        // Add cart items
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.dataset.index = index;
            
            // Calculate accessories text
            let accessoriesText = '';
            if (item.accessories && item.accessories.length > 0) {
                accessoriesText = ` + ${item.accessories.length} accessory${item.accessories.length > 1 ? 's' : ''}`;
            }
            
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-variant">${item.color} • ${item.model}${accessoriesText}</div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="cart-item-actions">
                        <div class="cart-item-quantity">
                            <button class="decrease">-</button>
                            <input type="number" value="${item.quantity}" min="1" max="10">
                            <button class="increase">+</button>
                        </div>
                        <button class="remove-item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
            
            // Add event listeners for this cart item
            const decreaseBtn = cartItem.querySelector('.decrease');
            const increaseBtn = cartItem.querySelector('.increase');
            const quantityInput = cartItem.querySelector('input');
            const removeBtn = cartItem.querySelector('.remove-item');
            
            decreaseBtn.addEventListener('click', () => updateCartItemQuantity(index, -1));
            increaseBtn.addEventListener('click', () => updateCartItemQuantity(index, 1));
            quantityInput.addEventListener('change', (e) => updateCartItemQuantity(index, 0, parseInt(e.target.value)));
            removeBtn.addEventListener('click', () => removeCartItem(index));
        });
        
        // Update cart summary
        updateCartSummary();
    }

    // Update cart item quantity
    function updateCartItemQuantity(index, change, newQuantity) {
        if (newQuantity !== undefined) {
            if (newQuantity < 1) newQuantity = 1;
            if (newQuantity > 10) newQuantity = 10;
            cart[index].quantity = newQuantity;
        } else {
            cart[index].quantity += change;
            if (cart[index].quantity < 1) cart[index].quantity = 1;
            if (cart[index].quantity > 10) cart[index].quantity = 10;
        }
        
        // Recalculate subtotal
        cart[index].subtotal = cart[index].price * cart[index].quantity;
        
        saveCart();
        updateCartCount();
        loadCartItems();
    }

    // Remove cart item
    function removeCartItem(index) {
        if (confirm('Remove this item from cart?')) {
            cart.splice(index, 1);
            saveCart();
            updateCartCount();
            loadCartItems();
            showNotification('Item removed from cart');
        }
    }

    // Update cart summary
    function updateCartSummary() {
        if (cart.length === 0) {
            cartSubtotal.textContent = '$0.00';
            cartTotal.textContent = '$0.00';
            document.getElementById('cartShipping').textContent = '$0.00';
            document.getElementById('cartTax').textContent = '$0.00';
            return;
        }
        
        // Calculate totals
        const subtotal = cart.reduce((total, item) => total + item.subtotal, 0);
        const tax = subtotal * 0.08; // 8% tax
        const shipping = subtotal >= 50 ? 0 : 9.99;
        const total = subtotal + tax + shipping;
        
        // Update display
        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('cartTax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('cartShipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    // Show checkout modal
    function showCheckoutModal() {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        
        checkoutModal.classList.add('active');
        cartSidebar.classList.remove('active');
    }

    // Update cart count
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    // Update wishlist count
    function updateWishlistCount() {
        wishlistCount.textContent = wishlist.length;
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Show notification
    function showNotification(message) {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--secondary-color);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 4000;
            animation: slideIn 0.3s ease;
        `;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            
            const slideOutStyle = document.createElement('style');
            slideOutStyle.textContent = `
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(slideOutStyle);
            
            setTimeout(() => {
                notification.remove();
                document.head.removeChild(slideOutStyle);
            }, 300);
        }, 3000);
    }

    // Initialize the application
    init();
});