import { Workbox } from "workbox-window";

let wb;

if ("serviceWorker" in navigator) {
    wb = new Workbox(`${process.env.BASE_URL}sw.js`);

    wb.addEventListener("controlling", () => {
        window.location.reload();
    });

    wb.register();
} else {
    wb = null;
}

export default wb;