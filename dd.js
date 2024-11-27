const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const chackout = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const adressWarrn = document.getElementById("address-warn");
const successMessage = document.getElementById("success-message"); // Div de sucesso
const contato = document.getElementById("whats");

let cart = [];

contato.addEventListener("click", function() {
	const message = `Olá, estou entrando em contato!`;

    // URL do WhatsApp para enviar o pedido
    const phoneNumber = '5511945798872'; 
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Abre o WhatsApp com o pedido formatado
    window.open(whatsappUrl, "_blank");
})

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex";
    cartBtn.style.display = "none";
    
});

// Fechar o modal do carrinho quando clicar fora
cartModal.addEventListener("click", function(event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
    cartBtn.style.display = "flex";
});

closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none";
    cartBtn.style.display = "flex";
});

document.addEventListener("click", function(event) {
    let parentButton = event.target.closest(".add-to-cart-btn");
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
    }
});


// Função para adicionar no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantidade += 1;
    } else {
        cart.push({
            name,
            price,
            quantidade: 1
        });
    }

    updateCartModal();
}

// Atualiza carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "flex-col");

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="medium">${item.name}</p>
                    <p>Qtd: ${item.quantidade}</p>
                    <p class="font-medium">R$ ${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `;
        total += item.price * item.quantidade;
        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

// Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantidade > 1) {
            item.quantidade -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        adressWarrn.classList.add("hidden");
    }
});

// Finalizar pedido
// Finalizar pedido
chackout.addEventListener("click", function(event) {
    event.preventDefault();
    const isOpen = checkRestauranteOpen();
    if (!isOpen) {
        Toastify({
            text: "Ops... o restaurante está fechado",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: {
                background: "#fa1b48",
            },
        }).showToast();
        return;
    }

    if (cart.length === 0) return;

    if (addressInput.value === "") {
        adressWarrn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    const cartDescription = cart.map((item) => {
        return ` ${item.name} Quantidade: (${item.quantidade}) Preço: R$${item.price} |`;
    }).join(" ");

    const address = addressInput.value;
    const deliveryMethod = document.getElementById("delivery-method").value;
    const paymentMethod = document.getElementById("payment-method").value;

    // Criação do texto a ser enviado para o WhatsApp
    const message = `*Pedido Mega Smasher*\n\n` +
                    `Itens:\n${cartDescription}\n\n` +
                    `| Endereço: ${address}\n` +
                    `| Método de Entrega: ${deliveryMethod}\n` +
                    `| Método de Pagamento: ${paymentMethod}\n\n` +
                    `| Total: R$ ${cartTotal.textContent.replace('R$', '').trim()}`;

    // URL do WhatsApp para enviar o pedido
    const phoneNumber = '5511945798872'; 
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Abre o WhatsApp com o pedido formatado
    window.open(whatsappUrl, "_blank");

    // Limpa o carrinho
    cart.length = 0;
    updateCartModal();
});


// Função que verifica se o restaurante está aberto
function checkRestauranteOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 10 && hora < 23;
}
