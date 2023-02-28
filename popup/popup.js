function displayImage(element, image) {
    if (image) {
        element.style.backgroundImage = `url(${image})`;
    } else {
        element.style.backgroundImage = 'upload.png';
    }
}

function addFileUploadEvent(fileInput) {
    const id = fileInput.id;
    fileInput.addEventListener('change', (evt) => {
        const reader = new FileReader();
        reader.addEventListener('load', (e) => {
            const dataUrl = e.target.result || null;

            if (dataUrl !== null) {
                // save into storage
                chrome.storage.local.set({
                    [id]: dataUrl,
                });
            }

            displayImage(fileInput, dataUrl);
        })
        reader.readAsDataURL(fileInput.files[0]);
    });
}

const fileInputDefault = document.getElementById('upload_default');
const fileInputClick = document.getElementById('upload_click');
const fileInputLink = document.getElementById('upload_link');

addFileUploadEvent(fileInputDefault);
addFileUploadEvent(fileInputClick);
addFileUploadEvent(fileInputLink);

chrome.storage.local.get([
    'upload_default',
    'upload_click',
    'upload_link',
], (items) => {
    const { upload_default, upload_click, upload_link } = items;
    displayImage(fileInputDefault, upload_default);
    displayImage(fileInputClick, upload_click);
    displayImage(fileInputLink, upload_link);
});