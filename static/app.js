let uploadHistory =
    JSON.parse(
        localStorage.getItem("uploadHistory")
    ) || [];

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

renderHistory();


// VIDEO PREVIEW

document
    .getElementById("fileInput")
    .addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        const video =
            document.getElementById("videoPreview");

        const previewContainer =
            document.getElementById("preview-container");

        video.src =
            URL.createObjectURL(file);

        previewContainer.style.display =
            "block";
    });


// UPLOAD

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

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {

            if (e.lengthComputable) {

                const percent =
                    Math.round(
                        (e.loaded / e.total) * 100
                    );

                progressFill.style.width =
                    percent + "%";

                progressText.innerText =
                    percent + "%";
            }

        });

        xhr.onload = function () {

            const data =
                JSON.parse(xhr.responseText);

            const sizeMB =
                (file.size / 1024 / 1024)
                .toFixed(2);

            const uploadTime =
                new Date().toLocaleString();

            document.getElementById("result").innerHTML = `
                <div class="success-card">

                    <h3>
                        ✅ Upload Successful
                    </h3>

                    <p>
                        📄 ${data.filename}
                    </p>

                    <p>
                        📦 ${sizeMB} MB
                    </p>

                    <p>
                        🕒 ${uploadTime}
                    </p>

                </div>
            `;

            uploadHistory.unshift({

                filename: data.filename,

                size: sizeMB,

                time: uploadTime

            });

            localStorage.setItem(
                "uploadHistory",
                JSON.stringify(uploadHistory)
            );

            renderHistory();
        };

        xhr.open(
            "POST",
            "/upload"
        );

        xhr.send(formData);

    });
