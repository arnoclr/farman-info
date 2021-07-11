import { Workbox } from "workbox-window";

let wb;

if ("serviceWorker" in navigator) {
    if(window.location.hostname == 'localhost') {
        navigator.serviceWorker.register('service-worker-dev.js');
    } else {
        wb = new Workbox(`${process.env.BASE_URL}sw.js`);

        wb.addEventListener("controlling", () => {
            window.location.reload();
        });

        wb.register();
    }
} else {
    wb = null;
}

export default wb;