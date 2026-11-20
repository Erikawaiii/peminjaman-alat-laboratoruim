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
    btnAll.className = "px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100";
    btnAll.textContent = "Semua";
    btnAll.addEventListener("click", () => filterkategori_alat("all"));
    container.appendChild(btnAll);
    // 2. Buat tombol untuk masing-masing kategori dari database
    kategori_alatData.forEach((kategori) => {
        const btn = document.createElement("button");
        btn.className = "px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100";
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
        isipilihanalat(allalat);

        renderalat(allalat);
    } catch (error) {
        console.error("Gagal mengambil data alat:", error);
    }
}
loadalat();

function isipilihanalat(alatdata) {
    const select = document.getElementById("alat");
    select.innerHTML = '<option value ="">Pilih Alat</option>';

    alatdata.forEach((alat) => {
        const option = document.createElement("option");
        option.value = alat.id_alat;
        option.textContent = alat.nama_alat;
        select.appendChild(option);
    });
}


function renderalat(alatData) {
    const container = document.getElementById("alat-container");
    container.innerHTML = "";

    alatData.forEach((alat) => {
        container.innerHTML += `
            <div class="border border-gray-300 rounded-xl bg-white p-5 shadow-sm hover:shadow-md">
                <h5 class="text-lg font-semibold text-gray-800 mb-3">
                    ${alat.nama_alat}
                </h5>

                <p class="text-gray-600 mb-1">
                    Stok: ${alat.stok}
                </p>

                <p class="text-gray-600 mb-4">
                    Kondisi: ${alat.kondisi}
                </p>

                <button class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                    Pinjam
                </button>
            </div>
        `;
    });
}

async function loadPeminjaman() {
    try {
        const response = await fetch("http://localhost:5000/api/peminjaman");
        const data = await response.json();
        console.log("data peminjaman:",data)
        
            const container = document.getElementById("peminjaman-container");
            container.innerHTML="";
            data.forEach((peminjaman) => {
            container.innerHTML += ` 

                <div class="border border-gray-300 rounded-xl bg-white p-5 shadow-sm hover:shadow-md mb-4">
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">
                    ${peminjaman.nama_alat}
                    </h3>
                    <p class="text-gray-600 mb-1">
                        Nama Peminjam: ${peminjaman.nama_peminjam}
                    </p>
                    <p class="text-gray-600 mb-1">
                        Kelas: ${peminjaman.kelas}
                    </p>
                    <p class="text-gray-600 mb-1">
                        Tanggal Pinjam: ${peminjaman.tanggal_pinjam}
                    </p>
                    <p class="text-gray-600 mb-1">
                        Tanggal Kembali: ${peminjaman.tanggal_kembali}
                    </p>
                    <p class="text-gray-600 mb-1">
                        Jumlah: ${peminjaman.jumlah}
                  </p>
                    <button  onclick="kembalikanalat(${peminjaman.id_peminjaman})"
                    style="display:block;
                    background-color:green;
                    color:white;
                    padding:10px;
                    margin-top:10px; ">
                    Kembalikan
                    </button>

                <button onclick=hapusPeminjaman(${peminjaman.id_id_peminjaman})"
                style="display:block;
                background-color:red;
                color:white;
                padding:10px;
                margin-top:10px;">
                Hapus
                </button>
                </div>
            `;
        });
    } catch (error) {
        console.error("Gagal mengambil data peminjaman:", error);
    }
}
loadPeminjaman();

async function kembalikanalat(id){
    try{
        const response = await fetch(
            `http://localhost:5000/api/peminjaman/${id}/kembalikan`,
            {method:"PUT"}
        );
        const data =await response.json();
        if(!response.ok){
            alert(data.error);
            return
        }
        alert("Alat berhasil dikembalikan");
        loadPeminjaman();
        loadalat();
    }catch (error){
        console.error("gagal mengembalikan alat",error);
    }
}

async function hapuspeminjaman(id){
    try{
        const response = await fetch(
            `http://`
        )
    }
}

//fungsi submit form
const form = document.getElementById("peminjaman-form");
form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Mencegah form melakukan submit default

    const id_alat = document.getElementById("alat").value;
    const nama_peminjam = document.getElementById("nama_peminjam").value;
    const tanggal_pinjam = document.getElementById("tanggal_pinjam").value;
    const tanggal_kembali = document.getElementById("tanggal_kembali").value;
    const jumlah = document.getElementById("jumlah").value;

    try {
        const response = await fetch("http://localhost:5000/api/peminjaman", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_alat: id_alat,
                nama_peminjam: nama_peminjam,
                kelas: "XI RPL A",
                tanggal_pinjam: tanggal_pinjam,
                tanggal_kembali: tanggal_kembali,
                jumlah: jumlah
            })
        });

        const data = await response.json();
        if (!response.ok) {
            console.error(data);
            alert("peminjaman gagal");
            return;
        }

        form.reset();
        loadalat();
        loadPeminjaman();
    } catch (error) {
        console.error("gagal melakukan peminjaman:", error);
    }
});