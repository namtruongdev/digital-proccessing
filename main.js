let image = null;
let resetImage = null;
const fileInput = document.querySelector('#input');
const canvas = document.querySelector('#Canvas');
const grayBtn = document.querySelector('#makeGray');
const medianFilter = document.querySelector('#medianFilter');
const redFilter = document.querySelector('#redFilter');
const zoomInBtn = document.querySelector('#zoomIn');
const zoomOutBtn = document.querySelector('#zoomOut');
const saveBtn = document.querySelector('#save');
const resetBtn = document.querySelector('#reset');
const binaryBtn = document.querySelector('#makeBinary');

function upload() {
  image = new SimpleImage(fileInput);
  resetImage = new SimpleImage(fileInput);
  image.drawTo(canvas);
}

function makeBinary() {
  const t = 128;
  for (pixel of image.values()) {
    const color = pixel.getRed();
    let bin = color <= t ? 0 : 255;
    pixel.setRed(bin);
    pixel.setGreen(bin);
    pixel.setBlue(bin);
  }
  image.drawTo(canvas);
}

function MakeGray() {
  for (pixel of image.values()) {
    const avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;

    pixel.setRed(avg);
    pixel.setGreen(avg);
    pixel.setBlue(avg);
  }
  image.drawTo(canvas);
}

function median() {
  let width = image.getWidth();
  let height = image.getHeight();
  let lists = [];
  let mask = [];
  for (i = 0; i <= width - 3; i++) {
    for (j = 0; j <= height - 3; j++) {
      for (x = i; x <= i + 2; x++) {
        for (y = j; y <= j + 2; y++) {
          lists.push(image.getPixel(x, y).getRed());
        }
      }
      mask = lists;
      lists = [];
      mask.sort((a, b) => a - b);
      const color = mask[4];
      let pixel = image.getPixel(i + 1, j + 1);
      pixel.setRed(color);
      pixel.setGreen(color);
      pixel.setBlue(color);
    }
  }
  image.drawTo(canvas);
}

function red() {
  for (var pixel of image.values()) {
    var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
    if (avg < 128) {
      pixel.setRed(2 * avg);
      pixel.setGreen(0);
      pixel.setBlue(0);
    } else {
      pixel.setRed(255);
      pixel.setGreen(2 * avg - 255);
      pixel.setBlue(2 * avg - 255);
    }
  }
  image.drawTo(canvas);
}

function zoomIn() {
  let width = image.getWidth();
  let height = image.getHeight();
  image.setSize(width + 200, height + 200);
  image.drawTo(canvas);
}

function zoomOut() {
  let width = image.getWidth();
  let height = image.getHeight();
  image.setSize(width - 200, height - 200);
  image.drawTo(canvas);
}

function save() {
  saveBtn.href = canvas.toDataURL();
  saveBtn.download = 'anh-sau-khi-xy-ly.png';
}

function reset() {
  resetImage.drawTo(canvas);
}

fileInput.addEventListener('change', upload);
binaryBtn.addEventListener('click', makeBinary);
grayBtn.addEventListener('click', MakeGray);
medianFilter.addEventListener('click', median);
redFilter.addEventListener('click', red);
zoomInBtn.addEventListener('click', zoomIn);
zoomOutBtn.addEventListener('click', zoomOut);
saveBtn.addEventListener('click', save, false);
resetBtn.addEventListener('click', reset);
