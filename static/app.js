document
.getElementById("uploadForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const file =
    document.getElementById("fileInput").files[0];

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/upload", {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    document.getElementById("result").innerHTML =
        `<p>✅ Uploaded: ${data.filename}</p>`;
});