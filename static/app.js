// Load saved history from localStorage
let uploadHistory =
    JSON.parse(
        localStorage.getItem("uploadHistory")
    ) || [];


// Render upload history
function renderHistory() {

    let historyHTML = "";

    uploadHistory.forEach((item, index) => {

        historyHTML += `
            <div class="history-card">

                <strong>
                    ${index + 1}. ${item.filename}
                </strong>

                <p>📦 ${item.size} MB</p>

                <p>🕒 ${item.time}</p>

            </div>
        `;
    });

    document.getElementById("history").innerHTML =
        historyHTML;
}


// Load history when page opens
renderHistory();


// Upload handler
document
    .getElementById("uploadForm")
    .addEventListener("submit", (e) => {

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

        progressFill.style.width = "0%";
        progressText.innerText = "0%";

        const formData = new FormData();
        formData.append("file", file);

        // Real Upload Progress
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {

            if (e.lengthComputable) {

                const percent = Math.round(
                    (e.loaded / e.total) * 100
                );

                progressFill.style.width =
                    percent + "%";

                progressText.innerText =
                    percent + "%";
            }
        });

        xhr.onload = function () {

            if (xhr.status !== 200) {

                alert("Upload failed.");

                return;
            }

            const data =
                JSON.parse(xhr.responseText);

            const sizeMB =
                (file.size / 1024 / 1024).toFixed(2);

            const uploadTime =
                new Date().toLocaleString();

            // Success Card
            document.getElementById("result").innerHTML = `
                <div class="success-card">

                    <h3>✅ Upload Successful</h3>

                    <p>
                        <strong>📄 Filename:</strong>
                        ${data.filename}
                    </p>

                    <p>
                        <strong>📦 File Size:</strong>
                        ${sizeMB} MB
                    </p>

                    <p>
                        <strong>🕒 Upload Time:</strong>
                        ${uploadTime}
                    </p>

                    <p>
                        <strong>🚀 Status:</strong>
                        Ready for Processing
                    </p>

                </div>
            `;

            // Save upload history
            uploadHistory.unshift({
                filename: data.filename,
                size: sizeMB,
                time: uploadTime
            });

            // Keep latest 10 items
            if (uploadHistory.length > 10) {

                uploadHistory =
                    uploadHistory.slice(0, 10);
            }

            // Save to localStorage
            localStorage.setItem(
                "uploadHistory",
                JSON.stringify(uploadHistory)
            );

            // Refresh history UI
            renderHistory();
        };

        xhr.onerror = function () {

            alert("Upload error.");
        };

        xhr.open("POST", "/upload");

        xhr.send(formData);
    });
