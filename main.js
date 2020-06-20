let image = null;
let resetImage = null;
const fileInputParent = document.querySelector('#inputParent');
const fileInput = document.querySelector('#input');
const canvas = document.querySelector('#Canvas');
const canvas2 = document.querySelector('#Canvas2');
const grayBtn = document.querySelector('#makeGray');
const medianFilter = document.querySelector('#medianFilter');
const redFilter = document.querySelector('#redFilter');
const zoomInBtn = document.querySelector('#zoomIn');
const zoomOutBtn = document.querySelector('#zoomOut');
const saveBtn = document.querySelector('#save');
const resetBtn = document.querySelector('#reset');
const binaryBtn = document.querySelector('#makeBinary');
const segmentationBtn = document.querySelector('#segmentation');
const edgeDetectionBtn = document.querySelector('#edgeDetection');
const historgramBtn = document.querySelector('#histogram');
const historgramEBtn = document.querySelector('#histogramE');

function upload() {
  image = new SimpleImage(fileInput);
  resetImage = new SimpleImage(fileInput);
  image.drawTo(canvas);
}

function edgeDetection() {
  // Đọc ảnh trong trong canvas.
  let src = cv.imread('Canvas');
  // Khởi tạo một ma trận.
  let absDst = new cv.Mat();
  // Chuyển sang ảnh xám
  cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);

  cv.Sobel(src, absDst, cv.CV_64F, 1, 0, 3, 1, 0, cv.BORDER_DEFAULT);
  cv.convertScaleAbs(absDst, absDst, 1, 0);
  // Hiển thị hình ảnh sau khi xử lý ra canvas
  cv.imshow('Canvas2', absDst);
  src.delete();
  absDst.delete();
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
  image.drawTo(canvas2);
}

function MakeGray() {
  for (pixel of image.values()) {
    const avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
    pixel.setRed(avg);
    pixel.setGreen(avg);
    pixel.setBlue(avg);
  }
  image.drawTo(canvas2);
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
  image.drawTo(canvas2);
}

function histogram() {
  let src = cv.imread('Canvas');
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
  let srcVec = new cv.MatVector();
  srcVec.push_back(src);
  let accumulate = false;
  let channels = [0];
  let histSize = [256];
  let ranges = [0, 255];
  let hist = new cv.Mat();
  let mask = new cv.Mat();
  let color = new cv.Scalar(255, 255, 255);
  let scale = 2;
  cv.calcHist(srcVec, channels, mask, hist, histSize, ranges, accumulate);
  let result = cv.minMaxLoc(hist, mask);
  let max = result.maxVal;
  let dst = new cv.Mat.zeros(src.rows, histSize[0] * scale, cv.CV_8UC3);
  // draw histogram
  for (let i = 0; i < histSize[0]; i++) {
    let binVal = (hist.data32F[i] * src.rows) / max;
    let point1 = new cv.Point(i * scale, src.rows - 1);
    let point2 = new cv.Point((i + 1) * scale - 1, src.rows - binVal);
    cv.rectangle(dst, point1, point2, color, cv.FILLED);
  }
  cv.imshow('Canvas2', dst);
  src.delete();
  dst.delete();
  srcVec.delete();
  mask.delete();
  hist.delete();
}

function histogramE() {
  let src = cv.imread('Canvas');
  let dst = new cv.Mat();
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
  cv.equalizeHist(src, dst);
  cv.imshow('Canvas2', src);
  cv.imshow('Canvas2', dst);
  src.delete();
  dst.delete();
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
  image.drawTo(canvas2);
}

function zoomIn() {
  let width = image.getWidth();
  let height = image.getHeight();
  image.setSize(width * 2, height * 2);
  image.drawTo(canvas);
}

function zoomOut() {
  let width = image.getWidth();
  let height = image.getHeight();
  image.setSize(width / 2, height / 2);
  image.drawTo(canvas);
}

function segmentation() {
  // Đọc ảnh từ canvas bên html và gán vào biến src
  let src = cv.imread('Canvas');
  // Tạo biến gray là một ma trận;
  let gray = new cv.Mat();
  // Chuyển ảnh màu sang ảnh xám
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
  //Otsu binarization
  cv.threshold(gray, gray, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);
  // Hiện ảnh ra màn hình
  cv.imshow('Canvas2', gray);
  src.delete();
  gray.delete();
}

function save() {
  saveBtn.href = canvas2.toDataURL();
  saveBtn.download = 'anh-sau-khi-xy-ly.png';
}

function reset() {
  image = resetImage;
  image.drawTo(canvas2);
  resetImage = new SimpleImage(canvas);
}

fileInput.addEventListener('change', upload);
edgeDetectionBtn.addEventListener('click', edgeDetection);
binaryBtn.addEventListener('click', makeBinary);
grayBtn.addEventListener('click', MakeGray);
medianFilter.addEventListener('click', median);
historgramBtn.addEventListener('click', histogram);
historgramEBtn.addEventListener('click', histogramE);
redFilter.addEventListener('click', red);
zoomInBtn.addEventListener('click', zoomIn);
zoomOutBtn.addEventListener('click', zoomOut);
segmentationBtn.addEventListener('click', segmentation);
saveBtn.addEventListener('click', save, false);
resetBtn.addEventListener('click', reset);
