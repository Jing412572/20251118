let char1, char2;
let spriteSheet1, spriteSheet2; // 分別儲存兩張圖片精靈
const scaleFactor = 4; // 全域角色放大倍率
const spacing = 50; // 角色間距
let isAnimating = false; // 控制動畫是否播放，預設為關閉

// 角色動畫的類別
class AnimatedCharacter {
  constructor(spriteSheet, config, animationSpeed = 0.2) {
    this.spriteSheet = spriteSheet;
    this.config = config;
    this.animationSpeed = animationSpeed;
    this.currentFrame = 0;
  }

  // 更新動畫影格
  update() {
    this.currentFrame = (this.currentFrame + this.animationSpeed) % this.config.numFrames;
  }

  // 計算呼吸動畫的垂直位移
  getBobbing() {
    const bobbingSpeed = 0.05; // 浮動速度
    const bobbingAmount = 2;   // 浮動幅度 (像素)
    return sin(frameCount * bobbingSpeed) * bobbingAmount;
  }

  // 繪製角色
  draw(x, y) {
    // 計算放大後的寬高
    let scaledWidth = this.config.frameWidth * scaleFactor;
    let scaledHeight = this.config.height * scaleFactor;

    // --- 繪製柔和的輝光效果以消除邊框 ---
    // 透過繪製一個模糊的、顏色接近背景的濾鏡，讓角色邊緣與背景自然融合
    drawingContext.filter = 'blur(10px)'; // 增強模糊效果
    // 讓輝光顏色更亮一點
    fill('#ebe4dd');
    noStroke();
    // 將輝光在水平方向上稍微拉伸，讓光從左右兩側溢出更多
    const glowPadding = 8; // 輝光向兩側擴展的像素
    image(this.spriteSheet, x - glowPadding / 2, y + this.getBobbing(), scaledWidth + glowPadding, scaledHeight, floor(this.currentFrame) * this.config.frameWidth, 0, this.config.frameWidth, this.config.height);
    drawingContext.filter = 'none'; // 移除濾鏡，以免影響後續繪圖

    // 計算來源影像在圖片精靈中的 x 座標
    let sx = floor(this.currentFrame) * this.config.frameWidth;

    // 繪製目前的影格，並套用呼吸動畫的垂直位移
    // 仍然呼叫 getBobbing() 來保持呼吸動畫
    image(this.spriteSheet, x, y + this.getBobbing(), scaledWidth, scaledHeight, sx, 0, this.config.frameWidth, this.config.height);
  }

  // 取得放大後的寬度
  getScaledWidth() {
    return this.config.frameWidth * scaleFactor;
  }
}

function preload() {
  // 載入兩張圖片精靈
  spriteSheet1 = loadImage('1/all.png');
  spriteSheet2 = loadImage('2/all.png');
}

function setup() {
  // 建立一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);

  // 啟用平滑渲染，讓放大後的圖片邊緣更柔和，減少鋸齒感
  smooth();

  // 角色1的設定
  const config1 = {
    width: 1264,
    height: 42,
    numFrames: 26,
    frameWidth: 48 // 1264 / 26 ≈ 48.6
  };
  char1 = new AnimatedCharacter(spriteSheet1, config1);

  // 角色2的設定
  const config2 = {
    width: 1021,
    height: 56,
    numFrames: 18,
    frameWidth: 56 // 1021 / 18 ≈ 56.7
  };
  char2 = new AnimatedCharacter(spriteSheet2, config2);
}

function draw() {
  // 設定背景顏色
  background('#d6ccc2');

  // 更新兩個角色的動畫狀態
  // 只有在 isAnimating 為 true 時才更新影格
  if (isAnimating) {
    char1.update();
    char2.update();
  }

  // 計算繪製位置，讓兩個角色整體置中
  const totalWidth = char1.getScaledWidth() + spacing + char2.getScaledWidth();
  const startX = (width - totalWidth) / 2;
  const char1X = startX;
  const char2X = startX + char1.getScaledWidth() + spacing;

  // 計算基礎Y座標，讓角色們的底部大致對齊在畫面垂直中心
  const baseY = (height - char1.config.height * scaleFactor) / 2;
  
  // 繪製兩個角色
  char1.draw(char1X, baseY);
  // 根據角色2自己的高度調整其Y座標，使它們底部對齊
  char2.draw(char2X, baseY + (char1.config.height - char2.config.height) * scaleFactor);
}

// 當滑鼠被點擊時，這個函式會被 p5.js 自動呼叫
function mousePressed() {
  isAnimating = !isAnimating; // 將 isAnimating 的值反轉 (true -> false, false -> true)
}
