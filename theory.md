Sensors are essential components in embedded systems and IoT applications. They allow the Arduino to detect environmental changes and convert physical parameters such as distance, motion, temperature, humidity, soil moisture, and air quality into electrical signals.

In this experiment, we simulate the interfacing of **five widely used sensors** with Arduino.  
The virtual lab environment helps in understanding sensor behavior, data acquisition, and digital/analog processing without physical hardware.

---

## Ultrasonic Sensor (HC-SR04)

An ultrasonic sensor measures distance using sound waves beyond the audible range.

### Working Principle

It has two main components:

- **Trigger Pin** → sends an ultrasonic pulse  
- **Echo Pin** → receives the reflected pulse  

Arduino measures the time taken for the echo to return.

**Distance formula:**  
Distance = (Time × Speed of Sound) / 2

### Simulation Use

- Users can adjust obstacle distance and view real-time measurements.

### Applications

- Obstacle detection  
- Robotics  
- Parking systems  
- Automation  

---

## PIR (Passive Infrared) Sensor

A PIR sensor detects movement by sensing changes in infrared radiation emitted by warm objects (like humans).

### Working Principle

- Contains pyroelectric sensors that detect IR variations  
- Gives a **digital output**:
  - HIGH → motion detected  
  - LOW → no motion  
- Sensitivity and delay settings (in real hardware) are simulated virtually  

### Simulation Use

- Users can toggle simulated motion events to see output changes.

### Applications

- Security systems  
- Motion-activated lighting  
- Occupancy sensing  

---

## DHT Sensor (DHT11 / DHT22)

A DHT sensor measures **temperature** and **humidity**.

### Working Principle

Uses:

- **NTC thermistor** for temperature  
- **Capacitive humidity sensor** for humidity  

Communication:

- Sends data to Arduino using a **single-wire digital protocol**  
- Arduino reads data using a **DHT library**

### Simulation Use

- Temperature and humidity sliders allow users to modify environmental conditions.

### Applications

- Weather monitoring  
- HVAC systems  
- Smart agriculture  
- Home automation  

---

## Soil Moisture Sensor

A soil moisture sensor measures the **water content** in soil.

### Working Principle

Works as a resistive sensor:

- Wet soil → **lower resistance** → higher analog value  
- Dry soil → **higher resistance** → lower analog value  

Outputs:

- **Analog signal** (moisture level)  
- **Digital output** (wet/dry threshold on some modules)

### Simulation Use

- Users can adjust moisture levels to observe analog output changes.

### Applications

- Smart irrigation  
- Plant monitoring  
- Agricultural automation  

---

## MQ135 Air Quality Sensor

The MQ135 sensor detects gases such as **CO₂, NH₃, benzene, smoke, and pollutants**.

### Working Principle

- Contains a chemical sensing layer  
- Resistance changes when exposed to gases  
- Produces an **analog voltage** proportional to gas concentration  
- Arduino reads this voltage via **analog pins**

### Simulation Use

- Users can adjust gas concentrations and observe sensor output variations.

### Applications

- Air quality monitoring  
- Pollution detection  
- Safety systems  
- IoT environmental stations  
