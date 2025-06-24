document.addEventListener('DOMContentLoaded', () => {
    const cars = [
        { id: 'avanza', name: 'Toyota Avanza', pricePerDay: 500000, image: 'https://www.toyota.astra.co.id/sites/default/files/2023-09/exterior3_0.jpg' },
        { id: 'innova', name: 'Toyota Kijang Innova', pricePerDay: 700000, image: 'https://www.toyota.astra.co.id//sites/default/files/2020-10/1_innova-super-white-2_0.png' },
        { id: 'hrv', name: 'Honda HRV', pricePerDay: 600000, image: 'https://dealermobilhondabanjarmasin.com/wp-content/uploads/2018/09/hr-v-banjarmasin.jpg' },
        { id: 'sigra', name: 'Daihatsu Sigra', pricePerDay: 450000, image: 'https://www.seva.id/_next/image?url=https%3A%2F%2Fimages.seva.id%2Fcolor_gallery%2FDaihatsu_Sigra_%25235c524d.jpg&w=2048&q=80' },
    ];

    const carListSection = document.getElementById('car-list');
    const customerNameInput = document.getElementById('customer-name');
    const calculateTotalBtn = document.getElementById('calculate-total');
    const saveOrderBtn = document.getElementById('save-order');
    const summaryDiv = document.getElementById('summary');
    const orderListDiv = document.getElementById('order-list');

    function renderCars() {
        let carsHtml = '<h2>Daftar Mobil Tersedia</h2>';
        cars.forEach(car => {
            carsHtml += `
                <div class="car-item">
                    <img src="${car.image}" alt="${car.name}">
                    <div class="car-details">
                        <h3>${car.name}</h3>
                        <p>Harga: Rp ${car.pricePerDay.toLocaleString('id-ID')}/hari</p>
                    </div>
                    <div class="car-controls">
                        <input type="checkbox" id="car-${car.id}" data-car-id="${car.id}">
                        <label for="car-${car.id}">Pilih</label>
                        <label for="start-date-${car.id}">Mulai Sewa:</label>
                        <input type="date" id="start-date-${car.id}" class="start-date" disabled>
                        <label for="duration-${car.id}">Durasi (hari):</label>
                        <input type="number" id="duration-${car.id}" class="duration" min="1" value="1" disabled>
                    </div>
                </div>
            `;
        });
        carListSection.innerHTML = carsHtml;

        // Tambahkan event listener untuk checkbox
        document.querySelectorAll('.car-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (event) => {
                const carId = event.target.dataset.carId;
                const startDateInput = document.getElementById(`start-date-${carId}`);
                const durationInput = document.getElementById(`duration-${carId}`);
                startDateInput.disabled = !event.target.checked;
                durationInput.disabled = !event.target.checked;
                if (!event.target.checked) {
                    startDateInput.value = '';
                    durationInput.value = 1; 
                }
            });
        });
    }

    calculateTotalBtn.addEventListener('click', () => {
        const selectedCars = [];
        let totalOverallPrice = 0;
        let summaryHtml = '<h3>Ringkasan Pemesanan</h3>';

        const customerName = customerNameInput.value.trim();
        if (!customerName) {
            alert('Nama pelanggan harus diisi!');
            return;
        }

        summaryHtml += `<p><strong>Nama Pelanggan:</strong> ${customerName}</p>`;
        summaryHtml += '<ul>';

        cars.forEach(car => {
            const checkbox = document.getElementById(`car-${car.id}`);
            if (checkbox && checkbox.checked) {
                const startDateInput = document.getElementById(`start-date-${car.id}`);
                const durationInput = document.getElementById(`duration-${car.id}`);

                const startDate = startDateInput.value;
                const duration = parseInt(durationInput.value);

                if (!startDate || isNaN(duration) || duration <= 0) {
                    alert(`Harap lengkapi tanggal mulai sewa dan durasi untuk ${car.name}.`);
                    selectedCars.length = 0;  
                    return;  
                }

                const subtotal = car.pricePerDay * duration;
                totalOverallPrice += subtotal;

                selectedCars.push({
                    name: car.name,
                    startDate: startDate,
                    duration: duration,
                    subtotal: subtotal
                });

                summaryHtml += `<li>${car.name} (Tanggal: ${startDate}, Durasi: ${duration} hari) - Subtotal: Rp ${subtotal.toLocaleString('id-ID')}</li>`;
            }
        });

        if (selectedCars.length === 0 && customerName) {
            summaryDiv.innerHTML = '<p style="color: red;">Pilih setidaknya satu mobil untuk dihitung.</p>';
            return;
        } else if (selectedCars.length === 0 && !customerName) {
             summaryDiv.innerHTML = '';
             return;
        }


        summaryHtml += '</ul>';
        summaryHtml += `<h4>Total Keseluruhan Harga: Rp ${totalOverallPrice.toLocaleString('id-ID')}</h4>`;
        summaryDiv.innerHTML = summaryHtml;
    });

    saveOrderBtn.addEventListener('click', () => {
        const customerName = customerNameInput.value.trim();
        const selectedCars = [];
        let totalOverallPrice = 0;

        if (!customerName) {
            alert('Nama pelanggan harus diisi sebelum menyimpan pemesanan!');
            return;
        }

        let isValid = true;
        cars.forEach(car => {
            const checkbox = document.getElementById(`car-${car.id}`);
            if (checkbox && checkbox.checked) {
                const startDateInput = document.getElementById(`start-date-${car.id}`);
                const durationInput = document.getElementById(`duration-${car.id}`);

                const startDate = startDateInput.value;
                const duration = parseInt(durationInput.value);

                if (!startDate || isNaN(duration) || duration <= 0) {
                    alert(`Harap lengkapi tanggal mulai sewa dan durasi untuk ${car.name} sebelum menyimpan.`);
                    isValid = false;
                    return;
                }

                const subtotal = car.pricePerDay * duration;
                totalOverallPrice += subtotal;

                selectedCars.push({
                    id: car.id,  
                    name: car.name,
                    startDate: startDate,
                    duration: duration,
                    subtotal: subtotal
                });
            }
        });

        if (!isValid) {
            return;
        }

        if (selectedCars.length === 0) {
            alert('Pilih setidaknya satu mobil untuk disimpan!');
            return;
        }

        const timestamp = new Date().toLocaleString('id-ID');  

        const newOrder = {
            id: Date.now(), // Unique ID for each order
            customerName: customerName,
            cars: selectedCars,
            totalPrice: totalOverallPrice,
            timestamp: timestamp
        };

        let orders = JSON.parse(localStorage.getItem('carRentals')) || [];
        orders.push(newOrder);
        localStorage.setItem('carRentals', JSON.stringify(orders));

        alert('Pemesanan berhasil disimpan!');
        renderOrderHistory();  
        resetForm();  
    });

     
    function resetForm() {
        customerNameInput.value = '';
        document.querySelectorAll('.car-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
            const carId = checkbox.dataset.carId;
            document.getElementById(`start-date-${carId}`).value = '';
            document.getElementById(`start-date-${carId}`).disabled = true;
            document.getElementById(`duration-${carId}`).value = 1;
            document.getElementById(`duration-${carId}`).disabled = true;
        });
        summaryDiv.innerHTML = '';
    }

   
    function renderOrderHistory() {
        let orders = JSON.parse(localStorage.getItem('carRentals')) || [];
        if (orders.length === 0) {
            orderListDiv.innerHTML = '<p>Belum ada pemesanan yang disimpan.</p>';
            return;
        }

        let historyHtml = '';
        orders.forEach(order => {
            historyHtml += `
                <div class="order-item" data-order-id="${order.id}">
                    <h4>Pemesanan oleh: ${order.customerName}</h4>
                    <p>Waktu Pemesanan: ${order.timestamp}</p>
                    <ul>
            `;
            order.cars.forEach(car => {
                historyHtml += `<li>${car.name} (Tanggal: ${car.startDate}, Durasi: ${car.duration} hari) - Subtotal: Rp ${car.subtotal.toLocaleString('id-ID')}</li>`;
            });
            historyHtml += `
                    </ul>
                    <p><strong>Total Harga: Rp ${order.totalPrice.toLocaleString('id-ID')}</strong></p>
                    <button class="delete-order-btn">Hapus</button>
                </div>
            `;
        });
        orderListDiv.innerHTML = historyHtml;

        
        document.querySelectorAll('.delete-order-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const orderItem = event.target.closest('.order-item');
                const orderIdToDelete = parseInt(orderItem.dataset.orderId);
                deleteOrder(orderIdToDelete);
            });
        });
    }

    
    function deleteOrder(id) {
        let orders = JSON.parse(localStorage.getItem('carRentals')) || [];
        orders = orders.filter(order => order.id !== id);
        localStorage.setItem('carRentals', JSON.stringify(orders));
        alert('Pemesanan berhasil dihapus!');
        renderOrderHistory();
    }

     
    renderCars();
    renderOrderHistory();
});
