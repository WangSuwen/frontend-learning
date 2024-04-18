onmessage = function(e) {
    if (typeof e.data !== 'number') {
        console.error('Expected number of iterations');
        return;
    }
    postMessage(smear(e.data));
}

function smear(pixels) {
    var data = pixels.data, width = pixels.width, height = pixels.height;
    var n = 0, m = n - 1;
    for (var row = 0; row < height; row++) {
        var i = row * width * 4 + 4;
        for (var col = 0; col < width; col++, i += 4) {
            data[i] = (data[i] + data[i - 4] * m) / n;
            data[i + 1] = (data[i + 1] + data[i - 3] * m) / n;
            data[i + 2] = (data[i + 2] + data[i - 2] * m) / n;
            data[i + 3] = (data[i + 3] + data[i - 1] * m) / n;
        }
    }
    return pixels;
}