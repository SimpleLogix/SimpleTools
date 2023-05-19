const urls = [];
const usedIndexes = [];
const bg = document.getElementById('background-image');
// pick random image from url list
// remove from list
// repeat until list is empty
// if empty, fetch more
export async function refreshImage() {
    // if urls list empty, fetch more
    if (urls.length == 0) {
        console.log('fetching more');
        // select a random index not in usedIndexes
        let rng = Math.floor(Math.random() * 50);
        if (usedIndexes.length != 0) {
            while (!usedIndexes.includes(rng)) {
                rng = Math.floor(Math.random() * 50);
            }
        }
        // request images
        let response = await fetch(`https://picsum.photos/v2/list?page=${rng}&limit=20`);
        let data = await response.json();
        // parse response and add urls to list
        for (let i = 0; i < data.length; i++) {
            urls.push(data[i].download_url);
        }
    }
    const randomIdx = Math.floor(Math.random() * urls.length);
    const url = urls[randomIdx];
    console.log(url);
    urls.splice(randomIdx, 1);
    // Create new image object and wait for it to load before setting background
    let img = new Image();
    img.onload = function () {
        bg.style.setProperty('--bg-url', `url(${url})`);
    };
    img.src = url;
}
