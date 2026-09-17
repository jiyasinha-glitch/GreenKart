let products = [];
let cart = [];
let discount = false;


fetch("products.json")
    .then(response => response.json())
    .then(data => {
        products = data;
        show();
        updateCart();
    });


function show(category = "All") {

    let list = category === "All"
        ? products
        : products.filter(product => product.category === category);

    productsBox.innerHTML = list.map(product => `

        <div class="card">

            <div class="pic">
                <img src="${product.image}" alt="${product.name}">
            </div>

            <h3>${product.name}</h3>

            <div class="price">
                ₹${product.price}
            </div>

            <small>
                ${product.stock} available
            </small>

            <button onclick="add(${product.id})">
                Add to Cart
            </button>

        </div>

    `).join("");
}


function add(id) {

    let item = cart.find(product => product.id === id);
    let product = products.find(p => p.id === id);

    if (item) {

        if (item.quantity < product.stock) {
            item.quantity++;
        } else {
            alert("No more stock available!");
        }

    } else {

        cart.push({
            id: id,
            quantity: 1
        });

    }

    updateCart();
}


function updateCart() {

    count.innerText = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    if (cart.length === 0) {

        cartBox.innerHTML = "Cart is empty 🌱";

    } else {

        cartBox.innerHTML = cart.map(item => {

            let product = products.find(
                p => p.id === item.id
            );

            return `
                <div class="cartItem">

                    <span>
                        <img src="${product.image}"
                             alt="${product.name}">
                        ${product.name}
                        × ${item.quantity}
                    </span>

                    <span>
                        <button onclick="change(${item.id}, -1)">-</button>
                        <button onclick="change(${item.id}, 1)">+</button>
                        <button onclick="removeItem(${item.id})">❌</button>
                    </span>

                </div>
            `;

        }).join("");
    }

    calculateTotal();
}


function change(id, amount) {

    let item = cart.find(
        product => product.id === id
    );

    let product = products.find(
        p => p.id === id
    );

    if (amount === 1 && item.quantity >= product.stock) {
        alert("No more stock available!");
        return;
    }

    item.quantity += amount;

    if (item.quantity <= 0) {
        removeItem(id);
        return;
    }

    updateCart();
}


function removeItem(id) {

    cart = cart.filter(
        item => item.id !== id
    );

    updateCart();
}


function calculateTotal() {

    let subtotal = cart.reduce(
        (total, item) => {

            let product = products.find(
                p => p.id === item.id
            );

            return total + product.price * item.quantity;

        },
        0
    );

    let discountAmount =
        discount ? subtotal * 0.20 : 0;

    let taxAmount =
        (subtotal - discountAmount) * 0.05;

    let finalTotal =
        subtotal - discountAmount + taxAmount;

    sub.innerText = Math.round(subtotal);
    disc.innerText = Math.round(discountAmount);
    tax.innerText = Math.round(taxAmount);
    total.innerText = Math.round(finalTotal);
}


function promoCode() {

    if (promo.value.toUpperCase() === "SAVE20") {

        discount = true;
        alert("20% discount applied! 🎉");

    } else {

        discount = false;
        alert("Invalid promo code.");

    }

    calculateTotal();
}


function checkout() {

    if (cart.length === 0) {

        alert("Please add a plant first 🌱");
        return;
    }

    check.classList.remove("hide");

    check.scrollIntoView({
        behavior: "smooth"
    });
}


function next(step) {

    if (step === 2) {

        if (
            !name.value ||
            !email.value.includes("@") ||
            !address.value
        ) {

            msg.innerText =
                "Please enter valid details.";

            return;
        }
    }

    if (step === 3) {

        if (
            card.value.length !== 16 ||
            expiry.value.length !== 5 ||
            cvv.value.length !== 3
        ) {

            msg.innerText =
                "Enter valid card details.";

            return;
        }
    }

    one.classList.add("hide");
    two.classList.add("hide");
    three.classList.add("hide");

    document.getElementById(
        ["", "one", "two", "three"][step]
    ).classList.remove("hide");

    msg.innerText = "";
}


function order() {

    three.innerHTML = `
        <h3>🎉 Order Placed!</h3>
        <p>Thank you for choosing GreenKart 🌿</p>
    `;

    cart = [];
    updateCart();
}