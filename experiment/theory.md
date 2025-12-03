Sensors are essential components in embedded systems and IoT applications. They allow the Arduino to detect environmental changes and convert physical parameters such as distance, motion, temperature, humidity, soil moisture, and air quality into electrical signals. In this experiment, we simulate the interfacing of five widely used sensors with Arduino. The virtual lab environment helps in understanding sensor behavior, data acquisition, and digital/analog processing without using physical hardware.

# Ultrasonic Sensor (HC-SR04)

An ultrasonic sensor measures distance using sound waves beyond the audible range.

## Working Principle

It has two main components:

Trigger Pin → sends an ultrasonic pulse.

Echo Pin → receives the reflected pulse.

Arduino measures the time taken for the echo to return.

Distance is calculated using the formula:
Distance = (Time × Speed of Sound) / 2

## Simulation Use

The virtual lab allows changing obstacle distance and viewing real-time measurements.

## Applications

Obstacle detection, robotics, parking systems, automation.

# PIR (Passive Infrared) Sensor

A PIR sensor detects movement by sensing changes in infrared radiation emitted by warm objects (like humans).

## Working Principle

Contains pyroelectric sensors that detect IR variations.

Gives a digital output:

HIGH when motion is detected

LOW when no motion is detected

Sensitivity and delay can be adjusted in real hardware (simulated virtually).

## Simulation Use

Users can toggle motion events to observe digital output changes.

## Applications

Security systems, motion-activated lighting, occupancy sensing.

# DHT Sensor (DHT11 / DHT22)

A DHT sensor measures both temperature and humidity.

## Working Principle

## Uses:

NTC thermistor for temperature measurement

Capacitive humidity sensor for humidity measurement

Sends data to Arduino via a single-wire digital communication protocol.

Arduino reads values using a dedicated DHT library.

## Simulation Use

In simulation, temperature and humidity sliders allow students to change environmental conditions.

## Applications

Weather monitoring, HVAC systems, smart agriculture, home automation.

# Soil Moisture Sensor

A soil moisture sensor measures the water content in soil.

## Working Principle

Works as a resistive sensor:

Wet soil → Lower resistance → Higher analog value

Dry soil → Higher resistance → Lower analog value

## Outputs:

Analog signal (moisture level)

Sometimes digital signal (wet/dry threshold)

## Simulation Use

The simulation lets users modify soil moisture level and observe analog changes.

## Applications

Smart irrigation, plant monitoring, agricultural automation.

# MQ135 Air Quality Sensor

The MQ135 sensor detects gases like CO₂, NH₃, benzene, smoke, and pollutants.

## Working Principle

Contains a sensitive chemical layer whose resistance changes when exposed to gases.

Produces an analog voltage proportional to pollutant concentration.

Arduino reads this voltage via analog pins to determine air quality level.

## Simulation Use

Virtual labs allow adjusting gas concentration to observe sensor output variations.

## Applications

Air quality monitoring, pollution detection, safety systems, IoT environment stations.