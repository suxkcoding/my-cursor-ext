const cursor = document.createElement('div');
cursor.id = 'MyCursor';
const image = document.createElement('div');
image.className = 'image';
const caret = document.createElement('div');
caret.className = 'caret';

cursor.appendChild(image);
document.body.appendChild(cursor);

let images = {};

chrome.storage.local.get(['upload_default', 'upload_click', 'upload_link'], (items) => {
    images = { ...items };
    injectApplication();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local') {
        return;
    }
    for (const key in changes) {
        // key: upload_default
        // value: {newValue: ..., oldValue: ...}
        const { newValue } = changes[key];
        images[key] = newValue;
    }
});

function injectApplication() {
    let isMousePressed = false;

    window.addEventListener('mousemove', (evt) => {
        cursor.style.left = `${evt.clientX}px`;
        cursor.style.top = `${evt.clientY}px`;

        if (isMousePressed === true) {
            return;
        }
        
        const { upload_default, upload_link } = images;
        
        const target = evt.target;
        if (target.closest('a[href]') != null) {
            // 커서가 링크 위에 있을 때
            image.style.backgroundImage = `url(${upload_link})`;
        } else {
            // 커서가 링크가 아닌 곳에 있을 때
            image.style.backgroundImage = `url(${upload_default})`;
        }
    });

    window.addEventListener('mousedown', (evt) => {
        // 마우스 클릭 시
        const { upload_click } = images;
        image.style.backgroundImage = `url(${upload_click})`;
        isMousePressed = true;
    });
    window.addEventListener('mouseup', (evt) => {
        // 마우스 클릭 해제 시
        const { upload_default } = images;
        image.style.backgroundImage = `url(${upload_default})`;
        isMousePressed = false;
    });
}