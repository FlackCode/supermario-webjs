export function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener("load", () => {
            resolve(image);
        });
        image.addEventListener("error", (e) => {
            reject(e);
        });
        image.src = url;
    });
}

export function loadJSON(url) {
    return fetch(url).then(r => r.json());
}

