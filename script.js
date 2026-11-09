// Ketentuan 1: Minimal 6 Produk dalam Array of Object
const products = [
    { id: 1, nama: "Laptop Asus Vivobook", harga: 8500000, stok: 3 },
    { id: 2, nama: "Mouse Wireless Logitech", harga: 250000, stok: 5 },
    { id: 3, nama: "Keyboard Mechanical", harga: 450000, stok: 2 },
    { id: 4, nama: "Headset Gaming HyperX", harga: 750000, stok: 4 },
    { id: 5, nama: "Monitor 24 Inch LG", harga: 1800000, stok: 1 },
    { id: 6, nama: "Webcam Full HD 1080p", harga: 350000, stok: 0 } // Contoh : stok habis
];

// Array menampung item di keranjang
let cart = [];

// Render Produk (Ketentuan 1)
function renderProducts() {
    const productListContainer = document.getElementById("product-list");
    productListContainer.innerHTML = "";

    products.forEach(function(product) {
        // Create element container card
        const cardDiv = document.createElement("div");
        cardDiv.className = "product-card";
        cardDiv.setAttribute("data-name", product.nama.toLowerCase());

        // Nama Produk
        const titleH3 = document.createElement("h3");
        const titleText = document.createTextNode(product.nama);
        titleH3.appendChild(titleText);

        // Harga Produk
        const priceP = document.createElement("p");
        const priceText = document.createTextNode("Harga: Rp " + product.harga.toLocaleString("id-ID"));
        priceP.appendChild(priceText);

        // Stok Produk
        const stockP = document.createElement("p");
        const stockText = document.createTextNode("Stok: " + product.stok);
        stockP.appendChild(stockText);

        // Tombol Tambah ke Keranjang
        const addBtn = document.createElement("button");
        const btnText = document.createTextNode("Tambah ke Keranjang");
        addBtn.appendChild(btnText);
        
        // Listener Klik Tombol Tambah
        addBtn.onclick = function() {
            addToCart(product.id);
        };

        // Append semua child ke cardDiv
        cardDiv.appendChild(titleH3);
        cardDiv.appendChild(priceP);
        cardDiv.appendChild(stockP);
        cardDiv.appendChild(addBtn);

        // Append cardDiv ke kontainer utama
        productListContainer.appendChild(cardDiv);
    });
}

// Logika Tambah ke Keranjang
function addToCart(productId) {
    const product = products.find(p => p.id === productId);

    // Ketentuan 4: Alert jika stok habis
    if (product.stok <= 0) {
        alert("Maaf, stok produk '" + product.nama + "' sudah habis!");
        return;
    }

    // Kurangi stok & masukkan ke keranjang
    product.stok--;
    cart.push(product);

    // Rerender daftar produk untuk memperbarui sisa stok
    renderProducts();

    // Render ulang elemen keranjang jQuery
    updateCartUI(product);
}

// Logika Update UI Keranjang (Ketentuan 2 & 3)
function updateCartUI(newItem) {
    if (newItem) {
        // Ketentuan 2 & 3: append() dan fadeIn()
        const li = $(`
            <li data-id="${newItem.id}" style="display:none;">
                <span>${newItem.nama} - Rp ${newItem.harga.toLocaleString("id-ID")}</span>
                <button class="btn-delete-item">x</button>
            </li>
        `);
        $("#cart-list").append(li);
        li.fadeIn(300);
    }

    calculateTotal();
}

// Hitung Total Harga & Jumlah Item (Ketentuan 2: text())
function calculateTotal() {
    let totalHarga = cart.reduce((sum, item) => sum + item.harga, 0);
    $("#total-items").text(cart.length);
    $("#cart-count").text(cart.length);
    $("#total-price").text(totalHarga.toLocaleString("id-ID"));
}

// Ketentuan 6: $(document).ready()
$(document).ready(function() {
    // Render awal produk
    renderProducts();

    // Ketentuan 3: fadeToggle() / animate() untuk buka/tutup panel keranjang
    $("#toggle-cart-btn").click(function() {
        $("#cart-panel").fadeToggle(300);
    });

    // Ketentuan 2 & 3: Hapus 1 item pake remove() & fadeOut()
    $("#cart-list").on("click", ".btn-delete-item", function() {
        const itemLi = $(this).parent();
        const itemId = itemLi.data("id");

        // Ketentuan 4: confirm() sebelum hapus
        if (confirm("Apakah Anda yakin ingin menghapus produk ini dari keranjang?")) {
            itemLi.fadeOut(300, function() {
                $(this).remove();
            });

            // Kembalikan stok produk
            const index = cart.findIndex(p => p.id === itemId);
            if (index !== -1) {
                const restoredProduct = products.find(p => p.id === itemId);
                if (restoredProduct) restoredProduct.stok++;
                cart.splice(index, 1);
            }

            renderProducts();
            calculateTotal();
        }
    });

    // Ketentuan 2 & 4: empty() dan confirm() untuk Kosongkan Keranjang
    $("#btn-clear").click(function() {
        if (cart.length === 0) return;

        if (confirm("Apakah Anda yakin ingin mengosongkan seluruh keranjang?")) {
            $("#cart-list").empty();
            
            // Kembalikan stok semua barang di keranjang
            cart.forEach(item => {
                const prod = products.find(p => p.id === item.id);
                if (prod) prod.stok++;
            });

            cart = [];
            renderProducts();
            calculateTotal();
        }
    });

    // Ketentuan 4: prompt() saat Checkout & Tampilkan Ringkasan
    $("#btn-checkout").click(function() {
        if (cart.length === 0) {
            alert("Keranjang belanja masih kosong!");
            return;
        }

        const namaPembeli = prompt("Masukkan nama lengkap pembeli untuk Checkout:", "");
        if (namaPembeli !== null && namaPembeli.trim() !== "") {
            let itemSummaryHtml = "<ul>";
            let total = 0;
            cart.forEach(item => {
                itemSummaryHtml += `<li>${item.nama} - Rp ${item.harga.toLocaleString("id-ID")}</li>`;
                total += item.harga;
            });
            itemSummaryHtml += "</ul>";

            const summaryContent = `
                <p><strong>Nama Pembeli:</strong> ${namaPembeli}</p>
                <p><strong>Daftar Item:</strong></p>
                ${itemSummaryHtml}
                <p><strong>Total Pembayaran:</strong> Rp ${total.toLocaleString("id-ID")}</p>
            `;

            $("#summary-details").html(summaryContent);
            $("#checkout-summary").fadeIn(400);

            // Resets setelah checkout berhasil
            $("#cart-list").empty();
            cart = [];
            calculateTotal();
            alert("Terima kasih " + namaPembeli + ", pesanan Anda berhasil diproses!");
        }
    });

    // Ketentuan 5: Fitur Pencarian dengan val() dan toggle()
    $("#input-search").on("keyup", function() {
        const keyword = $(this).val().toLowerCase().trim();
        $(".product-card").each(function() {
            const productName = $(this).attr("data-name");
            // Sembunyiin elemen yang gak cocok
            $(this).toggle(productName.indexOf(keyword) > -1);
        });
    });
});