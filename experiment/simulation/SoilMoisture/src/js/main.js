let image_tracker = "off";
let circuitImg = document.getElementById("circuitImg");
let startBtn = document.getElementById("startBtn");
let sliderContainer = document.getElementById("sliderContainer");
let moistureSlider = document.getElementById("moistureSlider");
let moistureValue = document.getElementById("moistureValue");

// Image array for different moisture levels
const imageMap = [
  "./src/images/SM3.png",   // 0% - Dry (Blue LED)
  "./src/images/SM4.png",   // 8%
  "./src/images/SM5.png",   // 16%
  "./src/images/SM6.png",   // 24% - Start Yellow
  "./src/images/SM7.png",   // 32%
  "./src/images/SM8.png",   // 40%
  "./src/images/SM9.png",   // 48%
  "./src/images/SM10.png",  // 56%
  "./src/images/SM11.png",  // 64% - Start Red
  "./src/images/SM12.png",  // 72%
  "./src/images/SM13.png",  // 80%
  "./src/images/SM14.png",  // 88%
  "./src/images/SM15.png"   // 100% - Wet (Red LED)
];

// Initialize CodeMirror
const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  mode: "text/x-csrc",
  theme: "monokai",
  lineNumbers: true,
  readOnly: true,
  lineWrapping: true,
  scrollbarStyle: "native"
});

function changePower() {
  if (image_tracker == "off") {
    circuitImg.src = imageMap[0];
    startBtn.innerHTML = '<span class="play-icon">■</span> Stop Simulation';
    startBtn.className = "control-btn stop-btn";
    sliderContainer.style.display = "block";
    
    // Reset slider
    moistureSlider.value = 0;
    moistureValue.textContent = "0";
    
    image_tracker = "on";
  } else {
    circuitImg.src = "./src/images/SM1.png";
    startBtn.innerHTML = '<span class="play-icon">▶</span> Start Simulation';
    startBtn.className = "control-btn start-btn";
    sliderContainer.style.display = "none";
    image_tracker = "off";
  }
}

function updateMoisture(sliderValue) {
  if (image_tracker == "off") return;
  
  // Display the actual slider value (0-100)
  moistureValue.textContent = sliderValue;
  
  // Map slider value (0-100) to image index (0-12)
  // 0-7 -> image 0 (Blue LED)
  // 8-15 -> image 1
  // 16-23 -> image 2
  // 24-31 -> image 3 (Yellow starts)
  // 32-39 -> image 4
  // 40-47 -> image 5
  // 48-55 -> image 6
  // 56-63 -> image 7
  // 64-71 -> image 8 (Red starts)
  // 72-79 -> image 9
  // 80-87 -> image 10
  // 88-95 -> image 11
  // 96-100 -> image 12 (Red LED)
  
  const imageIndex = Math.floor(sliderValue / 8);
  const finalIndex = Math.min(imageIndex, 12); // Cap at 12 (last image)
  
  // Update circuit image based on calculated index
  circuitImg.src = imageMap[finalIndex];
}
