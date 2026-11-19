let allalat = []; // Variabel global untuk menyimpan semua data produk
async function loadkategori_alat() {
    try {
        // 1. Memanggil API Backend
        const response = await fetch("http://localhost:5000/api/kategori_alat");

        // 2. Mengubah respons menjadi JSON
        const kategori_alat = await response.json();

        // 3. Menampilkan data di Console Browser
        console.log("Data Kategori dari Server:", kategori_alat);

        // 4. Mengirim data ke fungsi perakit HTML (DOM)
        renderkategori_alat(kategori_alat);
    } catch (error) {
        console.error("Gagal mengambil data kategori:", error);
    }
}

// Jalankan fungsinya
loadkategori_alat();

function renderkategori_alat(kategori_alatData) {
    const container = document.getElementById("kategori_alat-container");
    container.innerHTML = "";
    // 1. Buat tombol khusus untuk "Semua Produk"
    const btnAll = document.createElement("button");
    btnAll.className = "btn btn-outline-primary "; // Class Bootstrap
    btnAll.textContent = "Semua";
    btnAll.addEventListener("click ", () => filterkategori_alat("all"));
    container.appendChild(btnAll);
    // 2. Buat tombol untuk masing-masing kategori dari database
    kategori_alatData.forEach((kategori) => {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline-primary";
        btn.textContent = kategori.nama_kategori;
        // Pasang Event Listener! Saat diklik, panggilfilterProducts dan kirim ID kategorinya
        btn.addEventListener("click", () => filterkategori_alat(kategori.id_kategori));

        container.appendChild(btn);
    });
}

function filterkategori_alat(id_kategori) {
    console.log("Kategori yang diklik:", id_kategori);
    console.log("Data semua alat:", allalat);
    // Jika pengguna mengklik tombol "Semua"
    if (id_kategori === "all") {
        renderalat(allalat);
        return; // Hentikan fungsi sampai di sini
    }

    // Jika pengguna mengklik kategori spesifik (contoh ID 1 atau 2)
    // Gunakan metode array.filter() untuk menyaring data
    const filteredData = allalat.filter((produk) => {
        // Hanya kembalikan produk yang category_id-nya sama dengan ID yang diklik
        return Number(produk.id_kategori) === Number(id_kategori);
    });
console.log("Hasil filter:", filteredData);

    // Cetak hasil saringan ke HTML (Layar)
    renderalat(filteredData);
}

async function loadalat() {
    try {
        const response = await
            fetch("http://localhost:5000/api/alat");

        // Simpan ke variabel global, BUKAN variabel lokal const
        allalat = await response.json();

        renderalat(allalat);
    } catch (error) {
        console.error("Gagal mengambil data alat:", error);
    }
}
loadalat();


function renderalat(alatData) {
    const container = document.getElementById("alat-container");

    container.innerHTML = "";

    alatData.forEach((alat) => {
        container.innerHTML += `
            <div class="col-md-4 mb-3 ">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title ">${alat.nama_alat}</h5>
                        <p class="card-text ">Stok: ${alat.stok}</p>
                        <p class="card-text ">Kondisi: ${alat.kondisi}</p>
                        <button class="btn btn-primary bg-dark">
                            Pinjam
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

