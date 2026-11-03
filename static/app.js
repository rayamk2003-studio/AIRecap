document
.getElementById("uploadForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const file =
        document.getElementById("fileInput").files[0];

    if (!file) {
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/upload", {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    const sizeMB = (file.size / 1024 / 1024).toFixed(2);

    document.getElementById("result").innerHTML = `
        <div class="success-card">
            <h3>✅ Upload Successful</h3>

            <p><strong>File:</strong> ${data.filename}</p>

            <p><strong>Size:</strong> ${sizeMB} MB</p>

            <p><strong>Status:</strong> Ready for Processing</p>
        </div>
    `;
});
