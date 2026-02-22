// Arduino Code
const arduinoCode = `/*
  PIR Motion Sensor
  Detects motion and blinks LED
*/

int ledPin = 13;                // choose the pin for the LED
int inputPin = 2;               // choose the input pin (for PIR sensor)
int pirState = LOW;             // we start, assuming no motion detected
int val = 0;                    // variable for reading the pin status

void setup() {
  pinMode(ledPin, OUTPUT);      // declare LED as output
  pinMode(inputPin, INPUT);     // declare sensor as input
  
  Serial.begin(9600);
}

void loop() {
  val = digitalRead(inputPin);  // read input value
  
  if (val == HIGH) {            // check if the input is HIGH
    digitalWrite(ledPin, HIGH); // turn LED ON
    
    if (pirState == LOW) {
      // we have just turned on
      Serial.println("Motion detected!");
      // We only want to print on the output change, not state
      pirState = HIGH;
    }
  } else {
    digitalWrite(ledPin, LOW); // turn LED OFF
    
    if (pirState == HIGH){
      // we have just turned off
      Serial.println("Motion ended!");
      // We only want to print on the output change, not state
      pirState = LOW;
    }
  }
}`;

// State
let isMotionDetected = false;
let logs = [];
let personPos = { x: 0, y: 0 };
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let isSimulationRunning = false;

// Elements
let draggablePerson;
let pirSensor;
let detectionZone;
let serialOutput;
let workbench;
let startBtn;
let circuitImg;

// Toggle Simulation Function
function toggleSimulation() {
    if (!isSimulationRunning) {
        isSimulationRunning = true;
        startBtn.innerHTML = '<span class="play-icon">⏹</span> Stop Simulation';
        startBtn.classList.remove('start-btn');
        startBtn.classList.add('stop-btn');
        serialOutput.innerHTML = '<span style="opacity: 0.7">Serial Monitor Connected...</span><br>';

        // Change image to sim_on
        if (circuitImg) {
            circuitImg.src = 'sim_on.png';
        }
    } else {
        isSimulationRunning = false;
        startBtn.innerHTML = '<span class="play-icon">▶</span> Start Simulation';
        startBtn.classList.remove('stop-btn');
        startBtn.classList.add('start-btn');
        serialOutput.innerHTML = '<span class="serial-empty">Waiting for simulation to start...</span>';
        isMotionDetected = false;

        // Change image to sim_off
        if (circuitImg) {
            circuitImg.src = 'sim_off.png';
        }

        // Hide detection zone
        if (detectionZone) {
            detectionZone.classList.remove('active');
        }
    }
}

// Initialize
function init() {
    // Initialize element references
    draggablePerson = document.getElementById('draggable-person');
    pirSensor = document.getElementById('pir-sensor');
    detectionZone = document.getElementById('detection-zone');
    serialOutput = document.getElementById('serial-output');
    workbench = document.getElementById('workbench');
    startBtn = document.getElementById('startBtn');
    circuitImg = document.getElementById('circuitImg');

    // Set up dragging
    setupDragging();

    // Center person initially
    centerPerson();

    // Start motion detection loop
    setInterval(checkMotionDetection, 100);
}

// Setup Code Editor
function setupCodeEditor() {
    const codeContent = document.getElementById('code-content');
    const lineNumbers = document.getElementById('line-numbers');

    // Apply syntax highlighting
    const highlighted = syntaxHighlight(arduinoCode);
    codeContent.innerHTML = highlighted;

    // Generate line numbers
    const lines = arduinoCode.split('\n');
    lineNumbers.innerHTML = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
}

// Syntax Highlighting
function syntaxHighlight(code) {
    return code
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>')
        .replace(/\/\/.*/g, '<span class="comment">$&</span>')
        .replace(/\b(void|int|if|else)\b/g, '<span class="keyword">$&</span>')
        .replace(/\b(setup|loop|pinMode|digitalWrite|digitalRead|Serial|begin|println)\b/g, '<span class="function">$&</span>')
        .replace(/\b(HIGH|LOW|OUTPUT|INPUT)\b/g, '<span class="constant">$&</span>')
        .replace(/"[^"]*"/g, '<span class="string">$&</span>');
}

// Create Arduino Board SVG
function createArduinoBoard() {
    const container = document.getElementById('arduino');
    const ledOn = isMotionDetected;

    container.innerHTML = `
        <div style="position: relative; width: 280px; height: 200px;">
            <div style="position: absolute; inset: 0; border-radius: 8px; background: rgba(0,0,0,0.4); filter: blur(4px); transform: translateY(2px) translateX(1px);"></div>
            <svg viewBox="0 0 280 200" style="position: relative; width: 100%; height: 100%; filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));">
                <defs>
                    <linearGradient id="usb-metal" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#9ca3af" />
                        <stop offset="50%" stop-color="#d1d5db" />
                        <stop offset="100%" stop-color="#9ca3af" />
                    </linearGradient>
                    <linearGradient id="chip-black" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#374151" />
                        <stop offset="50%" stop-color="#1f2937" />
                        <stop offset="100%" stop-color="#111827" />
                    </linearGradient>
                </defs>

                <!-- Main PCB Shape -->
                <path d="M10,0 H270 A10,10 0 0,1 280,10 V140 A10,10 0 0,1 270,150 H260 V190 A10,10 0 0,1 250,200 H10 A10,10 0 0,1 0,190 V10 A10,10 0 0,1 10,0 Z" fill="#008B8B" stroke="#006666" stroke-width="2" />

                <!-- Mounting Holes -->
                <circle cx="15" cy="15" r="6" fill="#e5e7eb" stroke="#d1d5db" stroke-width="2" />
                <circle cx="265" cy="140" r="6" fill="#e5e7eb" stroke="#d1d5db" stroke-width="2" />
                <circle cx="15" cy="185" r="6" fill="#e5e7eb" stroke="#d1d5db" stroke-width="2" />
                <circle cx="265" cy="25" r="6" fill="#e5e7eb" stroke="#d1d5db" stroke-width="2" />

                <!-- USB Connector -->
                <rect x="-5" y="30" width="40" height="40" fill="url(#usb-metal)" stroke="#6b7280" rx="2" />

                <!-- DC Power Jack -->
                <rect x="-5" y="150" width="45" height="35" fill="#111827" stroke="#000" rx="2" />

                <!-- Headers Top -->
                <g transform="translate(60, 10)">
                    <rect x="0" y="0" width="200" height="15" fill="#111827" />
                    ${Array.from({ length: 14 }).map((_, i) =>
        `<rect x="${10 + i * 13.5}" y="3" width="8" height="8" fill="#fbbf24" rx="1" />`
    ).join('')}
                    <text x="190" y="28" font-size="8" fill="white" font-family="monospace" text-anchor="end">DIGITAL (PWM~)</text>
                </g>

                <!-- Headers Bottom -->
                <g transform="translate(60, 175)">
                    <rect x="0" y="0" width="160" height="15" fill="#111827" />
                    ${Array.from({ length: 12 }).map((_, i) =>
        `<rect x="${10 + i * 13}" y="4" width="8" height="8" fill="#fbbf24" rx="1" />`
    ).join('')}
                    <text x="10" y="-5" font-size="8" fill="white" font-family="monospace">POWER</text>
                    <text x="100" y="-5" font-size="8" fill="white" font-family="monospace">ANALOG IN</text>
                </g>

                <!-- Microcontroller -->
                <rect x="120" y="100" width="100" height="30" fill="url(#chip-black)" rx="2" />
                <text x="170" y="118" font-size="8" fill="#9ca3af" text-anchor="middle" font-family="monospace">ATMEGA328P</text>
                ${Array.from({ length: 14 }).map((_, i) =>
        `<rect x="${125 + i * 6.5}" y="96" width="3" height="4" fill="#d1d5db" />`
    ).join('')}
                ${Array.from({ length: 14 }).map((_, i) =>
        `<rect x="${125 + i * 6.5}" y="130" width="3" height="4" fill="#d1d5db" />`
    ).join('')}

                <!-- Reset Button -->
                <circle cx="45" cy="25" r="8" fill="#ef4444" stroke="#b91c1c" stroke-width="2" />
                <circle cx="45" cy="25" r="4" fill="#b91c1c" />

                <!-- Crystal -->
                <rect x="50" y="80" width="30" height="12" rx="4" fill="#d1d5db" stroke="#9ca3af" />

                <!-- Logo -->
                <text x="150" y="60" font-size="18" font-weight="bold" fill="white" font-family="sans-serif" style="letter-spacing: 1px;">ARDUINO</text>
                <text x="190" y="80" font-size="14" font-style="italic" fill="white" font-family="serif">UNO</text>

                <!-- RX/TX LEDs -->
                <rect x="100" y="80" width="6" height="4" fill="#fbbf24" opacity="0.5" />
                <text x="90" y="84" font-size="6" fill="white">TX</text>
                <rect x="100" y="88" width="6" height="4" fill="#fbbf24" opacity="0.5" />
                <text x="90" y="92" font-size="6" fill="white">RX</text>

                <!-- Pin 13 LED -->
                <g id="led-indicator" transform="translate(100, 65)">
                    <rect x="0" y="0" width="8" height="5" fill="${ledOn ? '#ef4444' : '#7f1d1d'}" style="transition: fill 0.1s;" />
                    <text x="-10" y="5" font-size="6" fill="white">L</text>
                    ${ledOn ? '<circle cx="4" cy="2.5" r="6" fill="#ef4444" opacity="0.6" style="filter: blur(4px);" />' : ''}
                </g>
            </svg>
        </div>
    `;
}

// Create Breadboard
function createBreadboard() {
    const container = document.getElementById('breadboard');

    container.innerHTML = `
        <div style="position: relative; width: 140px; height: 240px;">
            <div style="position: absolute; inset: 0; border-radius: 4px; background: rgba(0,0,0,0.2); filter: blur(4px); transform: translateY(1px);"></div>
            <div style="position: relative; width: 100%; height: 100%; background: #fdf6e3; border-radius: 4px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border-bottom: 4px solid #e6dcc3; border-right: 4px solid #e6dcc3;">
                <!-- Center Divider -->
                <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 8px; height: 100%; background: #eee8d5; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);"></div>

                <!-- Power Rails Left -->
                <div style="position: absolute; top: 0; left: 8px; width: 16px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 8px 0; border-right: 1px solid #eee8d5;">
                    <div style="height: 100%; width: 1px; background: #ef4444; position: absolute; left: 0; top: 0; opacity: 0.5;"></div>
                    <div style="height: 100%; width: 1px; background: #3b82f6; position: absolute; right: 0; top: 0; opacity: 0.5;"></div>
                    ${Array.from({ length: 20 }).map(() =>
        '<div style="width: 6px; height: 6px; background: #d1c4a9; border-radius: 2px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06); margin: 0 auto;"></div>'
    ).join('')}
                </div>

                <!-- Power Rails Right -->
                <div style="position: absolute; top: 0; right: 8px; width: 16px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 8px 0; border-left: 1px solid #eee8d5;">
                    <div style="height: 100%; width: 1px; background: #ef4444; position: absolute; left: 0; top: 0; opacity: 0.5;"></div>
                    <div style="height: 100%; width: 1px; background: #3b82f6; position: absolute; right: 0; top: 0; opacity: 0.5;"></div>
                    ${Array.from({ length: 20 }).map(() =>
        '<div style="width: 6px; height: 6px; background: #d1c4a9; border-radius: 2px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06); margin: 0 auto;"></div>'
    ).join('')}
                </div>

                <!-- Main Grid -->
                <div style="position: absolute; top: 8px; left: 32px; width: 48px; height: calc(100% - 16px); display: flex; flex-direction: column; gap: 6px;">
                    ${Array.from({ length: 25 }).map(() => `
                        <div style="display: flex; justify-content: space-between; padding: 0 4px;">
                            ${Array.from({ length: 5 }).map(() =>
        '<div style="width: 6px; height: 6px; background: #d1c4a9; border-radius: 2px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);"></div>'
    ).join('')}
                        </div>
                    `).join('')}
                </div>

                <div style="position: absolute; top: 8px; right: 32px; width: 48px; height: calc(100% - 16px); display: flex; flex-direction: column; gap: 6px;">
                    ${Array.from({ length: 25 }).map(() => `
                        <div style="display: flex; justify-content: space-between; padding: 0 4px;">
                            ${Array.from({ length: 5 }).map(() =>
        '<div style="width: 6px; height: 6px; background: #d1c4a9; border-radius: 2px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);"></div>'
    ).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Create PIR Sensor
function createPIRSensor() {
    const container = document.getElementById('pir-sensor');

    const sensorHTML = `
        <div style="position: relative; width: 100px; height: 100px;">
            <div style="position: absolute; inset: 0; border-radius: 50%; background: rgba(0,0,0,0.3); filter: blur(4px); transform: translateY(2px) scale(0.9);"></div>
            <div style="position: absolute; inset: 0; background: #1d4ed8; border-radius: 8px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06); border: 1px solid #1e40af; display: flex; align-items: center; justify-content: center;">
                <!-- Mounting Holes -->
                <div style="position: absolute; top: 4px; left: 4px; width: 8px; height: 8px; background: #ca8a04; border-radius: 50%; border: 1px solid #a16207;"></div>
                <div style="position: absolute; top: 4px; right: 4px; width: 8px; height: 8px; background: #ca8a04; border-radius: 50%; border: 1px solid #a16207;"></div>

                <!-- Dome -->
                <div style="position: relative; width: 64px; height: 64px; background: white; border-radius: 50%; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 1px solid #e5e7eb; overflow: hidden;">
                    <div style="position: absolute; inset: 0; background: radial-gradient(circle at 30% 30%, rgba(255,255,255,1), rgba(240,240,240,0.8), rgba(200,200,200,0.5));"></div>
                    <div style="position: absolute; inset: 0; opacity: 0.2; background-image: repeating-linear-gradient(0deg, transparent, transparent 9px, #ccc 10px), repeating-linear-gradient(90deg, transparent, transparent 9px, #ccc 10px);"></div>
                </div>

                <!-- Potentiometers -->
                <div style="position: absolute; bottom: 8px; left: 16px; width: 16px; height: 16px; border-radius: 50%; background: #eab308; border: 1px solid #ca8a04; box-shadow: 0 1px 2px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center;">
                    <div style="width: 8px; height: 2px; background: #a16207; transform: rotate(45deg);"></div>
                </div>
                <div style="position: absolute; bottom: 8px; right: 16px; width: 16px; height: 16px; border-radius: 50%; background: #eab308; border: 1px solid #ca8a04; box-shadow: 0 1px 2px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center;">
                    <div style="width: 8px; height: 2px; background: #a16207; transform: rotate(-12deg);"></div>
                </div>

                <!-- Pins -->
                <div style="position: absolute; bottom: -12px; left: 50%; transform: translateX(-50%); display: flex; gap: 4px;">
                    <div style="width: 6px; height: 16px; background: #fbbf24; border: 1px solid #ca8a04; border-radius: 2px;"></div>
                    <div style="width: 6px; height: 16px; background: #fbbf24; border: 1px solid #ca8a04; border-radius: 2px;"></div>
                    <div style="width: 6px; height: 16px; background: #fbbf24; border: 1px solid #ca8a04; border-radius: 2px;"></div>
                </div>

                <!-- Labels -->
                <div style="position: absolute; bottom: 32px; width: 100%; font-size: 6px; color: white; font-family: monospace; text-align: center; display: flex; justify-content: space-between; padding: 0 12px; opacity: 0.8;">
                    <span>Sx</span>
                    <span>Tx</span>
                </div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('afterbegin', sensorHTML);
}

// Center Person
function centerPerson() {
    const rect = workbench.getBoundingClientRect();
    personPos = {
        x: rect.width / 2,
        y: rect.height / 2
    };
    updatePersonPosition();
}

// Setup Dragging
function setupDragging() {
    if (!draggablePerson || !workbench) {
        console.error('Draggable elements not found');
        return;
    }

    draggablePerson.addEventListener('mousedown', startDrag);
    draggablePerson.addEventListener('touchstart', startDrag);

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);

    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
}

function startDrag(e) {
    isDragging = true;
    const touch = e.touches ? e.touches[0] : e;
    const rect = draggablePerson.getBoundingClientRect();
    dragOffset = {
        x: touch.clientX - rect.left - rect.width / 2,
        y: touch.clientY - rect.top - rect.height / 2
    };
}

function drag(e) {
    if (!isDragging || !workbench) return;
    e.preventDefault();

    const touch = e.touches ? e.touches[0] : e;
    const workbenchRect = workbench.getBoundingClientRect();
    const personRect = draggablePerson.getBoundingClientRect();

    // Calculate new position
    let newX = touch.clientX - workbenchRect.left - dragOffset.x;
    let newY = touch.clientY - workbenchRect.top - dragOffset.y;

    // Get person dimensions
    const personWidth = personRect.width;
    const personHeight = personRect.height;

    // Apply boundaries - keep person within workbench
    newX = Math.max(0, Math.min(newX, workbenchRect.width - personWidth));
    newY = Math.max(0, Math.min(newY, workbenchRect.height - personHeight));

    personPos = {
        x: newX,
        y: newY
    };

    updatePersonPosition();
}

function stopDrag() {
    isDragging = false;
}

function updatePersonPosition() {
    if (!draggablePerson) return;
    draggablePerson.style.left = personPos.x + 'px';
    draggablePerson.style.top = personPos.y + 'px';
}

// Motion Detection
function checkMotionDetection() {
    if (!pirSensor || !isSimulationRunning) return;

    const sensorRect = pirSensor.getBoundingClientRect();
    const workbenchRect = workbench.getBoundingClientRect();

    const sensorCenter = {
        x: sensorRect.left + sensorRect.width / 2 - workbenchRect.left,
        y: sensorRect.top + sensorRect.height / 2 - workbenchRect.top
    };

    const distance = Math.sqrt(
        Math.pow(personPos.x - sensorCenter.x, 2) +
        Math.pow(personPos.y - sensorCenter.y, 2)
    );

    // Detection zone radius is 150px (half of 300px diameter)
    // Person icon width is ~64px, so detect when person center is within circle
    const threshold = 150;
    const detected = distance < threshold;

    if (detected !== isMotionDetected) {
        isMotionDetected = detected;

        // Update image based on detection
        if (circuitImg && isSimulationRunning) {
            if (detected) {
                circuitImg.src = 'led_on.png';
            } else {
                circuitImg.src = 'sim_on.png';
            }
        }

        // Update detection zone
        if (detectionZone) {
            if (detected) {
                detectionZone.classList.add('active');
            } else {
                detectionZone.classList.remove('active');
            }
        }

        // Add log
        const timestamp = new Date().toLocaleTimeString();
        const message = detected ?
            `[${timestamp}] Motion detected!` :
            `[${timestamp}] Motion ended!`;

        addLog(message);
    }
}

// Add Log to Serial Monitor
function addLog(message) {
    if (!isSimulationRunning) return;

    logs.push(message);

    const serialEmpty = serialOutput.querySelector('.serial-empty');
    if (serialEmpty) {
        serialEmpty.remove();
    }

    const logDiv = document.createElement('div');
    logDiv.className = 'serial-log';
    logDiv.textContent = message;
    serialOutput.appendChild(logDiv);

    // Autoscroll
    serialOutput.scrollTop = serialOutput.scrollHeight;
}

// Initialize on load
window.addEventListener('load', init);
