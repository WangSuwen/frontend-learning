function smear(img) {
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    var context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
    var pixels = context.getImageData(0, 0, img.width, img.height);

    var worker = new Worker('SmearWorker.js');
    worker.postMessage(pixels);

    worker.onmessage = function(event) {
        pixels = event.data;
        context.putImageData(pixels, 0, 0);
        img.src = canvas.toDataURL();
        worker.terminate();
        canvas.width = canvas.height = 0;
    }
}

function sieve (n) {
    // var a = new Int8Array(n + 1);
    var a = new Array(n + 1);
    var max = Math.floor(Math.sqrt(n));
    var p = 2;
    while (p <= max) {
        for (var i = 2 *p; i <= n; i += p) {
            a[i] = 1;
        }
        while (a[++p]);
    }
    while(a[n]) n--;
    return n;
}
var a = Date.now();
console.log(sieve(100000000), '\n', Date.now() - a);