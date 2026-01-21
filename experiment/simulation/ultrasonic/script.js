// ============================================
// STATE VARIABLES
// ============================================
let logs = [];
let isSimulationRunning = false;

// Elements
let serialOutput;
let startBtn;
let circuitImg;
let canvas;
let ctx;

// Sensor configuration (cone starting point)
const sensor = {
    x: 300,              // Left margin - sensor X position (increase for more left margin)
    y: 350,              // Top margin - sensor Y position (0 = auto center, or set fixed value)
};

// Cone configuration
const cone = {
    angle: 40,           // Total cone angle in degrees (40 = ±20 from center)
    maxDistance: 400,    // Maximum detection distance in pixels
    pulseOpacity: 0.15,  // Base opacity for animation
    pulseSpeed: 0.02   // Speed of pulse animation
};

// Object/Target configuration
const targetObject = {
    x: 400,              // Initial X position
    y: 0,                // Will be set to canvas center Y
    radius: 15,          // Ball size (decrease for smaller ball)
    color: '#ef4444',
    isDragging: false,
    dragOffsetX: 0,
    dragOffsetY: 0
};

// Animation state
let pulsePhase = 0;      // For cone pulsing animation
let animationFrame;      // For requestAnimationFrame
let currentDistance = null;  // Current measured distance
let lastLogTime = 0;     // For throttling logs

// ============================================
// TOGGLE SIMULATION
// ============================================
window.toggleSimulation = function() {
    if (!isSimulationRunning) {
        // Start simulation
        isSimulationRunning = true;
        if (startBtn) {
            startBtn.innerHTML = '<span class="play-icon">⏹</span> Stop Simulation';
            startBtn.classList.remove('start-btn');
            startBtn.classList.add('stop-btn');
        }
        if (serialOutput) {
            serialOutput.innerHTML = '<span style="opacity: 0.7">Serial Monitor Connected...</span><br>';
        }
        // Change image to ON
        if (circuitImg) {
            circuitImg.src = 'ultrasonic_on.png';
        }
        // Start animation
        animate();
    } else {
        // Stop simulation
        isSimulationRunning = false;
        if (startBtn) {
            startBtn.innerHTML = '<span class="play-icon">▶</span> Start Simulation';
            startBtn.classList.remove('stop-btn');
            startBtn.classList.add('start-btn');
        }
        if (serialOutput) {
            serialOutput.innerHTML = '<span class="serial-empty">Waiting for simulation to start...</span>';
        }
        // Change image to OFF
        if (circuitImg) {
            circuitImg.src = 'ultrasonic_off.png';
        }
        // Stop animation
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
        // Clear canvas
        if (ctx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
    // Initialize element references
    serialOutput = document.getElementById('serial-output');
    startBtn = document.getElementById('startBtn');
    circuitImg = document.getElementById('circuitImg');
    canvas = document.getElementById('sensorCanvas');
    
    if (canvas) {
        ctx = canvas.getContext('2d');
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Setup mouse/touch event listeners for dragging
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchmove', handleTouchMove);
        canvas.addEventListener('touchend', handleTouchEnd);
    }
}

// ============================================
// CANVAS RESIZE
// ============================================
function resizeCanvas() {
    if (!canvas) return;
    
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Only set sensor.y to center if it was 0 (not manually set)
    // If you set a fixed value in config, it won't be overridden
    // sensor.y is already set in config above
    
    // Update target Y position if not set
    if (targetObject.y === 0) {
        targetObject.y = canvas.height / 2;
    }
}

// ============================================
// LOGGING
// ============================================
// Logging is now done directly from calculateDistance function
// No separate interval needed

// ============================================
// CONE DRAWING
// ============================================
function drawCone() {
    if (!ctx || !canvas) return;
    
    const startX = sensor.x;
    const startY = sensor.y;
    const angleRad = (cone.angle / 2) * (Math.PI / 180);
    
    // Calculate cone end points
    const topEndX = startX + cone.maxDistance * Math.cos(-angleRad);
    const topEndY = startY + cone.maxDistance * Math.sin(-angleRad);
    const bottomEndX = startX + cone.maxDistance * Math.cos(angleRad);
    const bottomEndY = startY + cone.maxDistance * Math.sin(angleRad);
    
    // Draw filled cone with pulsing opacity
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(topEndX, topEndY);
    ctx.lineTo(bottomEndX, bottomEndY);
    ctx.closePath();
    
    // Apply pulsing effect
    let opacity = cone.pulseOpacity;
    if (isSimulationRunning) {
        opacity = cone.pulseOpacity + Math.sin(pulsePhase) * 0.1;
    }
    
    ctx.fillStyle = `rgba(34, 197, 94, ${opacity})`;
    ctx.fill();
    
    // Draw dashed boundary lines
    ctx.setLineDash([10, 5]);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    
    // Top boundary
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(topEndX, topEndY);
    ctx.stroke();
    
    // Bottom boundary
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(bottomEndX, bottomEndY);
    ctx.stroke();
    
    // Arc at the end
    ctx.beginPath();
    ctx.arc(startX, startY, cone.maxDistance, -angleRad, angleRad);
    ctx.stroke();
    
    // Reset line dash
    ctx.setLineDash([]);
    
    // Draw detection zone label
    ctx.fillStyle = 'rgba(34, 197, 94, 0.8)';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
        '',
        startX + cone.maxDistance / 2,
        startY - 80
    );
    ctx.font = '10px Arial';
    ctx.fillText(
        ``,
        startX + cone.maxDistance / 2,
        startY - 65
    );
}

// Draw the target object
function drawTarget() {
    // Shadow
    ctx.beginPath();
    ctx.arc(
        targetObject.x + 2,
        targetObject.y + 2,
        targetObject.radius,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fill();
    
    // Main circle
    ctx.beginPath();
    ctx.arc(
        targetObject.x,
        targetObject.y,
        targetObject.radius,
        0,
        Math.PI * 2
    );
    
    // Gradient fill
    const gradient = ctx.createRadialGradient(
        targetObject.x - 5,
        targetObject.y - 5,
        2,
        targetObject.x,
        targetObject.y,
        targetObject.radius
    );
    gradient.addColorStop(0, '#fca5a5');
    gradient.addColorStop(1, targetObject.color);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Border
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Label
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Target', targetObject.x, targetObject.y - targetObject.radius - 8);
    
    // Crosshair
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(targetObject.x - 6, targetObject.y);
    ctx.lineTo(targetObject.x + 6, targetObject.y);
    ctx.moveTo(targetObject.x, targetObject.y - 6);
    ctx.lineTo(targetObject.x, targetObject.y + 6);
    ctx.stroke();
}

// ============================================
// DISTANCE CALCULATION
// ============================================
function calculateDistance() {
    // Check if object is within cone
    const isInCone = isPointInCone(
        targetObject.x,
        targetObject.y,
        sensor.x,
        sensor.y,
        cone.angle,
        cone.maxDistance
    );
    
    if (isInCone) {
        // Calculate distance in pixels
        const dx = targetObject.x - sensor.x;
        const dy = targetObject.y - sensor.y;
        const distancePixels = Math.sqrt(dx * dx + dy * dy);
        
        // Convert to cm - scale so max distance (400px) = 100cm
        let distanceCm = Math.round((distancePixels / cone.maxDistance) * 100);
        
        // Clamp between 0-100 cm
        distanceCm = Math.max(0, Math.min(100, distanceCm));
        
        // Store current distance
        currentDistance = distanceCm;
        
        // Display distance
        displayDistance(distanceCm);
        
        // Log to serial monitor (throttled to 1 second)
        if (isSimulationRunning) {
            const now = Date.now();
            if (now - lastLogTime >= 1000) {
                const timestamp = new Date().toLocaleTimeString();
                const message = `[${timestamp}] Distance: ${distanceCm} cm`;
                addLog(message);
                lastLogTime = now;
            }
        }
    } else {
        // Object outside cone
        currentDistance = null;
        displayNoObject();
        
        // Log "No Object Detected" (throttled)
        if (isSimulationRunning) {
            const now = Date.now();
            if (now - lastLogTime >= 1000) {
                const timestamp = new Date().toLocaleTimeString();
                const message = `[${timestamp}] No Object Detected`;
                addLog(message);
                lastLogTime = now;
            }
        }
    }
}

// Check if point is within cone
function isPointInCone(px, py, sensorX, sensorY, coneAngle, maxDist) {
    const dx = px - sensorX;
    const dy = py - sensorY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Check distance
    if (distance > maxDist || dx < 0) return false;
    
    // Check angle
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const halfAngle = coneAngle / 2;
    
    return Math.abs(angle) <= halfAngle;
}

// Display distance near sensor
function displayDistance(distanceCm) {
    const displayX = sensor.x+100;
    const displayY = sensor.y +100;
    
    // Background box
    ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
    ctx.fillRect(displayX - 60, displayY - 15, 120, 30);
    
    // Border
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(displayX - 60, displayY - 15, 120, 30);
    
    // Text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Distance: ${distanceCm} cm`, displayX, displayY + 5);
}

// Display "No Object Detected" message
function displayNoObject() {
    const displayX = sensor.x+100;
    const displayY = sensor.y + 100;
    
    // Background box
    ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
    ctx.fillRect(displayX - 70, displayY - 15, 140, 30);
    
    // Border
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.strokeRect(displayX - 70, displayY - 15, 140, 30);
    
    // Text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('No Object Detected', displayX, displayY + 5);
}

// ============================================
// ANIMATION LOOP
// ============================================
function animate() {
    if (!isSimulationRunning) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update pulse phase
    pulsePhase += cone.pulseSpeed;
    
    // Draw cone
    drawCone();
    
    // Draw target
    drawTarget();
    
    // Calculate and display distance
    calculateDistance();
    
    // Continue animation
    animationFrame = requestAnimationFrame(animate);
}

// ============================================
// MOUSE/TOUCH EVENT HANDLERS
// ============================================
function handleMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Check if clicking on target
    const dx = mouseX - targetObject.x;
    const dy = mouseY - targetObject.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance <= targetObject.radius) {
        targetObject.isDragging = true;
        targetObject.dragOffsetX = dx;
        targetObject.dragOffsetY = dy;
        canvas.style.cursor = 'grabbing';
    }
}

function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    if (targetObject.isDragging) {
        // Update target position
        targetObject.x = mouseX - targetObject.dragOffsetX;
        targetObject.y = mouseY - targetObject.dragOffsetY;
        
        // Keep within canvas bounds
        targetObject.x = Math.max(targetObject.radius, Math.min(canvas.width - targetObject.radius, targetObject.x));
        targetObject.y = Math.max(targetObject.radius, Math.min(canvas.height - targetObject.radius, targetObject.y));
        
        // Redraw if simulation is running, otherwise just update once
        if (!isSimulationRunning) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawCone();
            drawTarget();
            calculateDistance();
        }
    } else {
        // Check if hovering over target
        const dx = mouseX - targetObject.x;
        const dy = mouseY - targetObject.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        canvas.style.cursor = distance <= targetObject.radius ? 'grab' : 'default';
    }
}

function handleMouseUp() {
    targetObject.isDragging = false;
    canvas.style.cursor = 'default';
}

function handleTouchStart(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    
    const dx = touchX - targetObject.x;
    const dy = touchY - targetObject.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance <= targetObject.radius) {
        targetObject.isDragging = true;
        targetObject.dragOffsetX = dx;
        targetObject.dragOffsetY = dy;
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!targetObject.isDragging) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    
    targetObject.x = touchX - targetObject.dragOffsetX;
    targetObject.y = touchY - targetObject.dragOffsetY;
    
    // Keep within canvas bounds
    targetObject.x = Math.max(targetObject.radius, Math.min(canvas.width - targetObject.radius, targetObject.x));
    targetObject.y = Math.max(targetObject.radius, Math.min(canvas.height - targetObject.radius, targetObject.y));
    
    // Redraw if simulation is running, otherwise just update once
    if (!isSimulationRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCone();
        drawTarget();
        calculateDistance();
    }
}

function handleTouchEnd() {
    targetObject.isDragging = false;
}

// ============================================
// SERIAL MONITOR
// ============================================
function addLog(message) {
    if (!isSimulationRunning || !serialOutput) return;
    
    logs.push(message);
    
    const serialEmpty = serialOutput.querySelector('.serial-empty');
    if (serialEmpty) {
        serialEmpty.remove();
    }
    
    const logDiv = document.createElement('div');
    logDiv.className = 'serial-log';
    logDiv.textContent = message;
    serialOutput.appendChild(logDiv);
    
    // Limit logs to prevent memory issues
    const logElements = serialOutput.querySelectorAll('.serial-log');
    if (logElements.length > 100) {
        logElements[0].remove();
    }
    
    // Autoscroll
    serialOutput.scrollTop = serialOutput.scrollHeight;
}

// ============================================
// INITIALIZE ON LOAD
// ============================================
window.addEventListener('load', init);
