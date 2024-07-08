const shoppingList = [];
const shirts = [
    {
        name: 'Laptop',
        description: 'HP Pavillion',
        price: 35000
    },
    {
        name: 'Fridge',
        description: 'Samsung Extra Large',
        price: 3800
    },
    {
        name: 'Bread',
        description: 'Superloaf 150g',
        price: 6500
    },
    {
        name: 'Perfume',
        description: 'Rasasi Emotion',
        price: 7000
    },
];

// Adding card for every shirt in my inventory
const itemsContainer = document.querySelector('.items');
shirts.forEach((shirt, index) => {

    //Creating the card and connecting to .card in CSS
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-name', shirt.name.toLowerCase());

    const name = document.createElement('h3');
    name.textContent = shirt.name;
    card.appendChild(name);

    const description = document.createElement('p');
    description.textContent = shirt.description;
    card.appendChild(description);

    const price = document.createElement('p');
    price.classList.add('price');
    price.textContent = `Ksh ${shirt.price}`;
    card.appendChild(price);

    // Creating button in each 
    const addToCartButton = document.createElement('button');
    addToCartButton.classList.add('card-btn');
    addToCartButton.textContent = 'ADD TO CART';

    //Attribute is set during creating of the cards
    addToCartButton.setAttribute('data-index', index);
    addToCartButton.addEventListener('click', addToCart);
    card.appendChild(addToCartButton);

    itemsContainer.appendChild(card);
});

function getShirtFromEvent(event, selector) {
    let clickedButton = event.target.closest(selector);
    const index = clickedButton.getAttribute('data-index');
    const selectedShirt = shirts[index];

    if (!selectedShirt) return null;
    return selectedShirt;
}

// Pushing elements to shopping list
function addToCart(event) {
    const selectedShirt = getShirtFromEvent(event, '.card-btn');
    if (!selectedShirt) return;

    // Check if the item already exists in shoppingList
    const existingItem = shoppingList.find(item => item.name === selectedShirt.name);
    if (existingItem) {
        console.log(`${selectedShirt.name} is already in the cart.`);
        return;
    }

    // Add the item to shoppingList
    shoppingList.push({
        name: selectedShirt.name,
        price: selectedShirt.price
    });

    // Update the UI
    updateUI();
}

// Removing item from the cart
function removeCartItem(event) {
    const itemElement = event.target.closest('.delete-item');
    if (!itemElement) return;

    const itemName = itemElement.getAttribute('data-name');
    const itemPrice = itemElement.getAttribute('data-price');

    const itemIndex = shoppingList.findIndex(item => item.name === itemName && item.price == itemPrice);
    if (itemIndex > -1) {
        shoppingList.splice(itemIndex, 1);
    }

    updateUI(); // Update UI function

    console.log('Current shopping list:', shoppingList);
}

//Adding or removing placeholder
function togglePlaceholder() {
    const cartList = document.querySelector('.cart-list');
    let placeholder = document.querySelector('.cart-list-placeholder');

    if (!placeholder) {
        placeholder = document.createElement('div');
        placeholder.classList.add('cart-list-placeholder');

        const placeholderImage = document.createElement('img');
        placeholderImage.id = 'shopping-cart';
        placeholderImage.setAttribute('src', 'assets/shopping-cart.png');
        placeholder.appendChild(placeholderImage);

        const placeholderText = document.createElement('p');
        placeholderText.id = 'empty-cart-text';
        placeholderText.textContent = 'Your cart is empty!';
        placeholder.appendChild(placeholderText);
        
        cartList.appendChild(placeholder);
    }

    if (shoppingList.length === 0) {
        placeholder.style.display = 'block';
    } else {
        placeholder.style.display = 'none';
    }
}

// Function to update the entire UI
function updateUI() {
    var totalPrice = 0;

    const cartItem = document.querySelector('.cart-list');
    const total = document.querySelector('#total-text');

    // Clear existing content
    cartItem.innerHTML = '';

    // Iterate through shoppingList
    shoppingList.forEach((item) => {
        const details = document.createElement('div');
        details.classList.add('details');

        const itemName = document.createElement('p');
        itemName.classList.add('name');
        itemName.textContent = item.name;
        details.appendChild(itemName);

        const itemPrice = document.createElement('p');
        itemPrice.classList.add('price');
        itemPrice.textContent = `Ksh ${item.price}`;
        details.appendChild(itemPrice);

        const deleteItem = document.createElement('div');
        deleteItem.classList.add('delete-item');
        deleteItem.setAttribute('data-name', item.name);
        deleteItem.setAttribute('data-price', item.price);
        deleteItem.addEventListener('click', removeCartItem);  // Add event listener here

        const deleteImage = document.createElement('img');
        deleteImage.src = 'assets/delete.png';
        deleteImage.classList.add('img');
        deleteItem.appendChild(deleteImage);

        cartItem.appendChild(details);
        cartItem.appendChild(deleteItem);

        totalPrice += parseInt(item.price); // Accumulate total price

        // Reset the button style and text for the added item
        const index = shirts.findIndex(shirt => shirt.name === item.name);
        if (index !== -1) {
            const addToCartButton = document.querySelectorAll('.card-btn')[index];
            addToCartButton.textContent = 'ADDED TO CART';
            addToCartButton.style.backgroundColor = 'grey';
            addToCartButton.disabled = true;
        }
    });

    // Reset buttons in the card view for items not in the shoppingList
    shirts.forEach((shirt, index) => {
        const addToCartButton = document.querySelectorAll('.card-btn')[index];
        const isInCart = shoppingList.some(item => item.name === shirt.name);
        if (!isInCart) {
            addToCartButton.textContent = 'ADD TO CART';
            addToCartButton.style.backgroundColor = '';
            addToCartButton.disabled = false;
        }
    });

    togglePlaceholder();
    total.textContent = `TOTAL: KSH. ${totalPrice}`;
    return totalPrice;
}

// Function to mark purchased items
function purchase() {
    const body = document.querySelector('body');

    // Creating the background overlay
    const dialogBackground = document.createElement('div');
    dialogBackground.classList.add('purchase-background');

    // Creating the purchase dialog container
    const dialog = document.createElement('div');
    dialog.classList.add('purchase-dialog');

    // Creating the close button container
    const removeDialog = document.createElement('div');
    removeDialog.classList.add('remove-dialog');

    // Creating the close button image
    const cancel = document.createElement('img');
    cancel.classList.add('cancel');
    cancel.setAttribute('src', 'assets/cancel.png');
    (cancel || removeDialog).addEventListener('click', () => {
        clearCart()
        body.removeChild(dialogBackground);
    });

    // Adding the success animation (if needed)
    const loaderBase = document.createElement('span');
    const loaderFoot = document.createElement('span');
    const loader = document.createElement('div');
    loader.classList.add('loader');
    loaderBase.classList.add('line-long');
    loaderFoot.classList.add('line-short');
    loader.appendChild(loaderBase);
    loader.appendChild(loaderFoot);
    loader.style.animation = 'pop 1.2s ease-in-out'; // Apply animation

    // Adding purchase text with dynamic content
    const totalPrice = updateUI(); // Update the UI to get current total price
    const itemCount = shoppingList.length === 1 ? 'item' : 'items';
    const purchaseText = document.createElement('p');
    purchaseText.id = 'purchase-dialog-text';
    purchaseText.textContent = `You have purchased ${shoppingList.length} ${itemCount} for KSH. ${totalPrice}`;

    // Appending elements to the dialog
    removeDialog.appendChild(cancel);
    dialog.appendChild(removeDialog);
    dialog.appendChild(loader); // Include loader animation if desired
    dialog.appendChild(purchaseText);
    dialogBackground.appendChild(dialog);
    body.appendChild(dialogBackground);
}

// Clear the cart
function clearCart() {
    shoppingList.length = 0;
    updateUI();
}

// Add a shirt
function addItem() {
    const body = document.querySelector('body');

    // Creating the background overlay
    const dialogBackground = document.createElement('div');
    dialogBackground.classList.add('add-item-background');

    // Creating the purchase dialog container
    const dialog = document.createElement('div');
    dialog.classList.add('add-item-dialog');

    // Creating input fields for name, description, and price
    const nameLabel = document.createElement('label');
    nameLabel.textContent = '';
    const nameInput = document.createElement('input');
    nameInput.id = 'add-input-name'
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('placeholder', 'Enter name');
    nameInput.setAttribute('required', true);

    const descriptionLabel = document.createElement('label');
    descriptionLabel.textContent = '';
    const descriptionInput = document.createElement('input');
    descriptionInput.id = 'add-input-description'
    descriptionInput.setAttribute('type', 'text');
    descriptionInput.setAttribute('placeholder', 'Enter description');
    descriptionInput.setAttribute('required', true)

    const priceLabel = document.createElement('label');
    priceLabel.textContent = '';
    const priceInput = document.createElement('input');
    priceInput.id = 'add-input-price'
    priceInput.setAttribute('placeholder', 'Enter price as a number');
    priceInput.setAttribute('type', 'number');
    priceInput.setAttribute('required', true)

    // Creating the add button
    const addButton = document.createElement('button');
    addButton.id = 'add-input-submit'
    addButton.textContent = 'Submit';
    addButton.addEventListener('click', () => {
        const newItem = {
            name: nameInput.value,
            description: descriptionInput.value,
            price: parseInt(priceInput.value)
        };

        shirts.push(newItem);

        // Create a new card for the added shirt
        const newCard = document.createElement('div');
        newCard.classList.add('add-input')
        newCard.classList.add('card');

        const name = document.createElement('h3');
        name.textContent = newItem.name;
        newCard.appendChild(name);

        const description = document.createElement('p');
        description.textContent = newItem.description;
        newCard.appendChild(description);

        const price = document.createElement('p');
        price.classList.add('price');
        price.textContent = `Ksh ${newItem.price}`;
        newCard.appendChild(price);

        const addToCartButton = document.createElement('button');
        addToCartButton.classList.add('card-btn');
        addToCartButton.textContent = 'ADD TO CART';
        addToCartButton.setAttribute('data-index', shirts.length - 1); // Adjust index dynamically
        addToCartButton.addEventListener('click', addToCart);
        newCard.appendChild(addToCartButton);

        itemsContainer.appendChild(newCard);

        // Close the dialog
        body.removeChild(dialogBackground);
    });

    // Creating the close button container
    const removeDialog = document.createElement('div');
    removeDialog.classList.add('remove-dialog');

    // Creating the close button image
    const cancel = document.createElement('img');
    cancel.classList.add('cancel');
    cancel.setAttribute('src', 'assets/cancel.png');
    cancel.addEventListener('click', () => {
        body.removeChild(dialogBackground);
    });

    // Appending elements to the dialog
    nameLabel.appendChild(nameInput);
    descriptionLabel.appendChild(descriptionInput);
    priceLabel.appendChild(priceInput);
    dialog.appendChild(nameLabel);
    dialog.appendChild(descriptionLabel);
    dialog.appendChild(priceLabel);
    dialog.appendChild(addButton);
    removeDialog.appendChild(cancel);
    dialog.appendChild(removeDialog);
    dialogBackground.appendChild(dialog);
    body.appendChild(dialogBackground);
}

// Delete a shirt
function deleteItem() {
    const body = document.querySelector('body');

    // Creating the background overlay
    const dialogBackground = document.createElement('div');
    dialogBackground.classList.add('remove-item-background');

    // Creating the purchase dialog container
    const dialog = document.createElement('div');
    dialog.classList.add('remove-item-dialog');

    // Creating input fields for name, description, and price
    const nameLabel = document.createElement('label');
    nameLabel.textContent = '';
    const nameInput = document.createElement('input');
    nameInput.id = 'remove-input-name'
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('placeholder', 'Enter name');
    nameInput.setAttribute('required', true);

    // Creating the submit button
    const submitButton = document.createElement('button');
    submitButton.id = 'remove-input-submit'
    submitButton.textContent = 'Submit';
    submitButton.addEventListener('click', () => {
        const name = nameInput.value.trim();
        if (name) {
            const index = shirts.findIndex(shirt => shirt.name.toLowerCase() === name.toLowerCase());
            if (index !== -1) {
                shirts.splice(index, 1);

                // Manually remove the card element from the DOM
                const cardToRemove = document.querySelector(`.card[data-name="${name.toLowerCase()}"]`);
                if (cardToRemove) {
                    cardToRemove.parentElement.removeChild(cardToRemove);
                }
            } else {
                alert('Item not found');
            }
            body.removeChild(dialogBackground); // Close the dialog
        } else {
            alert('Please enter a valid name');
        }
    });

    // Creating the close button container
    const removeDialog = document.createElement('div');
    removeDialog.classList.add('remove-dialog');

    // Creating the close button image
    const cancel = document.createElement('img');
    cancel.classList.add('cancel');
    cancel.setAttribute('src', 'assets/cancel.png');
    cancel.addEventListener('click', () => {
        body.removeChild(dialogBackground);
    });

    nameLabel.appendChild(nameInput);
    dialog.appendChild(nameLabel);
    dialog.appendChild(submitButton);
    removeDialog.appendChild(cancel);
    dialog.appendChild(removeDialog);
    dialogBackground.appendChild(dialog);
    body.appendChild(dialogBackground);
}

// Add event listeners to buttons
document.getElementById('add-item').addEventListener('click', addItem)
document.getElementById('delete-item').addEventListener('click', deleteItem)
document.getElementById('clear-list-btn').addEventListener('click', clearCart);
document.getElementById('purchase-btn').addEventListener('click', purchase);