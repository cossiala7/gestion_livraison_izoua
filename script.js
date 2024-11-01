// JavaScript (script.js)
const deliveryList = document.getElementById('delivery-list');
const deliveries = [];

// Bilan Journalier Variables
let foodIzouaTotal = 0;
let foodMoiTotal = 0;
let deliveryIzouaTotal = 0;
let deliveryMoiTotal = 0;

document.getElementById('delivery-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const clientName = document.getElementById('client-name').value;
    const clientPhone = document.getElementById('client-phone').value;
    const deliveryZone = document.getElementById('delivery-zone').value;
    const foodAmount = parseInt(document.getElementById('food-amount').value, 10);
    const quantity = parseInt(document.getElementById('quantity').value, 10);
    const foodPayment = document.getElementById('food-payment').value;
    const startTime = new Date();

    const deliveryCost = getDeliveryCost(deliveryZone);
    const totalFoodAmount = foodAmount * quantity;
    
    const delivery = {
        clientName,
        clientPhone,
        deliveryZone,
        totalFoodAmount,
        foodPayment,
        deliveryCost,
        startTime,
        endTime: null,
        duration: null,
        deliveryPayment: null
    };

    deliveries.push(delivery);
    addDeliveryToList(delivery);
    updateFoodSummary(delivery);
    document.getElementById('delivery-form').reset();
});

function getDeliveryCost(zone) {
    switch(zone) {
        case "zone1": return 1000;
        case "zone2": return 1500;
        case "zone3": return 2000;
        default: return 0;
    }
}

function addDeliveryToList(delivery) {
    const deliveryItem = document.createElement('li');
    deliveryItem.classList.add('delivery-item');
    deliveryItem.innerHTML = `
        <strong>Client:</strong> ${delivery.clientName} (${delivery.clientPhone})<br>
        <strong>Zone:</strong> ${delivery.deliveryZone}<br>
        <strong>Montant Nourriture:</strong> ${delivery.totalFoodAmount} FCFA<br>
        <strong>Paiement Nourriture:</strong> ${delivery.foodPayment}<br>
        <strong>Coût Livraison:</strong> ${delivery.deliveryCost} FCFA<br>
        <span class="delivery-time">Heure de départ: ${delivery.startTime.toLocaleTimeString()}</span><br>
        <button onclick="markAsDelivered(this, ${deliveries.indexOf(delivery)})">Marquer Livrée</button>
        <div class="duration" style="display:none;">Durée: <span class="delivery-duration"></span></div>
    `;
    deliveryList.appendChild(deliveryItem);
}

function markAsDelivered(button, index) {
    const endTime = new Date();
    deliveries[index].endTime = endTime;

    const duration = Math.round((endTime - deliveries[index].startTime) / 1000 / 60);
    deliveries[index].duration = duration;

    const deliveryItem = button.parentElement;
    deliveryItem.querySelector('.duration').style.display = "block";
    deliveryItem.querySelector('.delivery-duration').textContent = `${duration} min`;
    button.disabled = true;

    selectedDeliveryIndex = index;
    document.getElementById('payment-modal').style.display = 'flex';
}

function confirmPaymentMethod() {
    const paymentMethod = document.getElementById('payment-method').value;
    const delivery = deliveries[selectedDeliveryIndex];

    delivery.deliveryPayment = paymentMethod;
    updateDeliverySummary(delivery);

    document.getElementById('payment-modal').style.display = 'none';
    selectedDeliveryIndex = null;
}

function updateFoodSummary(delivery) {
    if (delivery.foodPayment === "izoua") {
        foodIzouaTotal += delivery.totalFoodAmount;
    } else {
        foodMoiTotal += delivery.totalFoodAmount;
    }

    document.getElementById('food-izoua-total').textContent = `${foodIzouaTotal} FCFA`;
    document.getElementById('food-moi-total').textContent = `${foodMoiTotal} FCFA`;
}

function updateDeliverySummary(delivery) {
    if (delivery.deliveryPayment === "izoua") {
        deliveryIzouaTotal += delivery.deliveryCost;
    } else {
        deliveryMoiTotal += delivery.deliveryCost;
    }

    document.getElementById('delivery-izoua-total').textContent = `${deliveryIzouaTotal} FCFA`;
    document.getElementById('delivery-moi-total').textContent = `${deliveryMoiTotal} FCFA`;
}
