const URL = "https://teachablemachine.withgoogle.com/models/JReNpiX5z/";
let model, webcam, labelContainer;

// Fungsi async untuk inisialisasi webcam dan model
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        // Load model Teachable Machine
        model = await tmImage.load(modelURL, metadataURL);
        console.log("Model dimuat dengan sukses!");

        // Inisialisasi webcam
        webcam = new tmImage.Webcam(640, 480, true); // width, height, flip
        await webcam.setup(); // Meminta izin akses kamera
        await webcam.play(); // Memulai aliran video
        console.log("Webcam dimulai!");

        // Menampilkan canvas webcam
        document.getElementById("webcam").appendChild(webcam.canvas);

        // Menyiapkan kontainer untuk output
        labelContainer = document.getElementById("output");

        // Mulai loop prediksi
        window.requestAnimationFrame(loop);
    } catch (err) {
        console.error("Gagal memuat model atau mengakses webcam:", err);
        alert("Pastikan Anda memberikan izin akses ke kamera dan model berhasil dimuat.");
    }
}

// Fungsi loop untuk terus memperbarui gambar webcam
async function loop() {
    webcam.update(); // Update webcam
    await predict(); // Prediksi gestur
    window.requestAnimationFrame(loop); // Lanjutkan loop
}

// Fungsi untuk membuat prediksi berdasarkan gambar dari webcam
async function predict() {
    const prediction = await model.predict(webcam.canvas); // Prediksi
    console.log("Prediksi: ", prediction); // Menampilkan prediksi di console

    if (prediction && prediction.length > 0) {
        labelContainer.innerHTML = `${prediction[0].className}: ${Math.round(prediction[0].probability * 100)}%`;
    } else {
        labelContainer.innerHTML = "Tidak ada prediksi yang berhasil.";
    }
}

// Memulai aplikasi dengan memanggil init()
init();
