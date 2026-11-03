document
.getElementById("uploadForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const file =
        document.getElementById("fileInput").files[0];

    if (!file) return;

    const progressContainer =
        document.getElementById("progress-container");

    const progressFill =
        document.getElementById("progress-fill");

    const progressText =
        document.getElementById("progress-text");

    progressContainer.style.display = "block";

    let progress = 0;

    const fakeProgress = setInterval(() => {

        progress += 25;

        if (progress > 100) {
            progress = 100;
        }

        progressFill.style.width =
            progress + "%";

        progressText.innerText =
            progress + "%";

        if (progress === 100) {
            clearInterval(fakeProgress);
        }

    }, 500);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/upload", {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    const sizeMB =
        (file.size / 1024 / 1024).toFixed(2);

    const uploadTime =
        new Date().toLocaleString();

    document.getElementById("result").innerHTML = `
        <div class="success-card">

            <h3>✅ Upload Successful</h3>

            <p><strong>📄 Filename:</strong>
            ${data.filename}</p>

            <p><strong>📦 File Size:</strong>
            ${sizeMB} MB</p>

            <p><strong>🕒 Upload Time:</strong>
            ${uploadTime}</p>

            <p><strong>🚀 Status:</strong>
            Ready for Processing</p>

        </div>
    `;
});
