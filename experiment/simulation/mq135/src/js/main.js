let isPowerOn = false;
let isSmokeOn = false;
let audioCtx = null;
let oscillator = null;
let gainNode = null;
let isBeeping = false;

const smokeLayer = document.getElementById("smoke-layer");
const startBtn = document.getElementById("startBtn");
const smokeBtn = document.getElementById("smokeBtn");
const sliderWrapper = document.getElementById("sliderWrapper");

// Render ONLY the Smoke Effect Overlay
function renderSmokeEffect() {
  if (!smokeLayer) return;
  smokeLayer.innerHTML = `
        <svg viewBox="0 0 800 500" style="width:100%; height:100%; shape-rendering: crispEdges;">
            <defs>
                <filter id="smokeBlur">
                    <!-- Reduced deviation for better performance -->
                    <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
                </filter>
                <radialGradient id="smokeGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="rgba(40,40,40,0.95)" />
                    <stop offset="60%" stop-color="rgba(60,60,60,0.7)" />
                    <stop offset="100%" stop-color="rgba(100,100,100,0)" />
                </radialGradient>
            </defs>
            <!-- REMOVED transition for instant slider response -->
            <circle id="smokeEffect" cx="700" cy="240" r="0" fill="url(#smokeGradient)" opacity="0" filter="url(#smokeBlur)" />
        </svg>
    `;
}

function changePower() {
  isPowerOn = !isPowerOn;
  const circuitImg = document.getElementById("ifimg");

  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } else if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (isPowerOn) {
    if (circuitImg) circuitImg.src = "./src/images/mq_on.png";
    startBtn.innerHTML = '<span class="play-icon">■</span> Stop Simulation';
    startBtn.className = "control-btn stop-btn";
    smokeBtn.style.display = "inline-block";
  } else {
    if (circuitImg) circuitImg.src = "./src/images/mq_off.png";
    startBtn.innerHTML = '<span class="play-icon">▶</span> Start Simulation';
    startBtn.className = "control-btn start-btn";
    smokeBtn.style.display = "none";
    sliderWrapper.style.display = "none";
    isSmokeOn = false;

    const smoke = document.getElementById("smokeEffect");
    if (smoke) {
      smoke.setAttribute("opacity", "0");
      smoke.setAttribute("r", "0");
    }
    stopBeep();
  }
}

function toggleSmoke() {
  isSmokeOn = true;
  smokeBtn.style.display = "none";
  sliderWrapper.style.display = "flex";
  const smoke = document.getElementById("smokeEffect");
  if (smoke) smoke.setAttribute("opacity", "0.8");
}

function updatePollution(val) {
  if (!isPowerOn) return;

  const pollutionVal = document.getElementById("pollutionVal");
  if (pollutionVal && pollutionVal.textContent != val) {
    pollutionVal.textContent = val;
  }

  const smoke = document.getElementById("smokeEffect");
  if (smoke) {
    // Fast attribute update without CSS transition
    smoke.setAttribute("r", 30 + (val * 1.5));
  }

  const warning = document.getElementById("buzzerWarning");
  if (!warning) return;

  // Efficient Toggle Logic
  if (val > 66) {
    if (!isBeeping) startBeep(); // Only start if not already beeping
    if (warning.textContent !== "⚠ Buzzer ON!") {
      warning.textContent = "⚠ Buzzer ON!";
      warning.classList.add("danger");
    }
  } else if (val > 40) {
    if (isBeeping) stopBeep(); // Only stop if it's currently beeping
    if (warning.textContent !== "Near Threshold") {
      warning.textContent = "Near Threshold";
      warning.classList.add("danger");
    }
  } else {
    if (isBeeping) stopBeep(); // Only stop if it's currently beeping
    if (warning.textContent !== "Threshold: 66%") {
      warning.textContent = "Threshold: 66%";
      warning.classList.remove("danger");
    }
  }
}

// Sound Logic
function startBeep() {
  if (isBeeping || !audioCtx) return;
  oscillator = audioCtx.createOscillator();
  gainNode = audioCtx.createGain();
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
  const now = audioCtx.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  for (let i = 0; i < 500; i++) {
    gainNode.gain.setValueAtTime(0.1, now + (i * 0.4));
    gainNode.gain.setValueAtTime(0, now + (i * 0.4) + 0.2);
  }
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.start();
  isBeeping = true;
}

function stopBeep() {
  if (!isBeeping) return;
  if (oscillator) {
    try { oscillator.stop(); oscillator.disconnect(); } catch (e) { }
  }
  isBeeping = false;
}

// Initial Setup
renderSmokeEffect();
