import * as UC from
  "https://cdn.jsdelivr.net/npm/@uploadcare/file-uploader@v1/web/file-uploader.min.js";

UC.defineComponents(UC);

const config = document.querySelector("#uploadcare-config");
const uploadContext = document.querySelector("#upload-context");
const statusMessage = document.querySelector("#upload-status");

function updateStatus(message, type = "") {
  statusMessage.textContent = message;
  statusMessage.className = `upload-status ${type}`.trim();
}

function uploadcareKeyIsReady() {
  const publicKey = config.getAttribute("pubkey") || "";

  return (
    publicKey.length > 0 &&
    publicKey !== "YOUR_UPLOADCARE_PUBLIC_KEY"
  );
}

if (!uploadcareKeyIsReady()) {
  updateStatus(
    "Setup is not complete yet. Add your Uploadcare public key to index.html.",
    "error"
  );
} else {
  await customElements.whenDefined("uc-upload-ctx-provider");

  const uploaderApi = uploadContext.getAPI();

  let completedUploads = 0;

  uploaderApi.on(UC.EventType.FILE_ADDED, () => {
    updateStatus(
      "Your photo has been selected. Follow the uploader instructions to continue."
    );
  });

  uploaderApi.on(UC.EventType.FILE_UPLOAD_START, () => {
    updateStatus(
      "Uploading your photo. Please keep this page open until it finishes."
    );
  });

  uploaderApi.on(UC.EventType.FILE_UPLOAD_SUCCESS, () => {
    completedUploads += 1;

    const photoWord =
      completedUploads === 1
        ? "photo"
        : "photos";

    updateStatus(
      `${completedUploads} ${photoWord} uploaded successfully. Thank you!`,
      "success"
    );
  });

  uploaderApi.on(UC.EventType.FILE_UPLOAD_FAILED, () => {
    updateStatus(
      "A photo did not upload. Check your internet connection and try again.",
      "error"
    );
  });
}
