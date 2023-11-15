let image_tracker = "off";
let image = document.getElementById("ifimg");
let smoke = "off";

function changePower() {
  if (image_tracker == "off") {
    image.src = "./src/images/MQ2.png";
    document.getElementById("pushbuttonPower").innerHTML = "Stop Simulation";
    document.getElementById("pushbuttonPower").style.backgroundColor = "red";
    document.getElementById("smoke").style.display = "inline";
    image_tracker = "on";
  } else {
    image.src = "./src/images/MQ1.png";
    document.getElementById("pushbuttonPower").innerHTML = "Start Simulation";
    document.getElementById("pushbuttonPower").style.backgroundColor =
      "#009C4E";
    image_tracker = "off";
  }
}

function includeSmoke() {
  if ((image.src = "./src/images/MQ2.png")) {
    image.src = "./src/images/MQ6.png";
    document.getElementById("smoke").style.display = "none";
    document.getElementById("imageSlider").style.display = "inline";
    document.getElementById("sliderComment").style.display = "block";
    smoke = "on";
  }
}

let img_array = [
  "./src/images/MQ6.png",
  "./src/images/MQ7.png",
  "./src/images/MQ8.png",
  "./src/images/MQ9.png",
  "./src/images/MQ10.png",
  "./src/images/MQ11.png",
  "./src/images/MQ12.png",
  "./src/images/MQ13.png",
  "./src/images/MQ14.png",
  "./src/images/MQ15.png",
  "./src/images/MQ16.png",
  "./src/images/MQ17.png",
  "./src/images/MQ18.png",
  "./src/images/MQ19.png",
  "./src/images/MQ20.png",
  "./src/images/MQ21.png",
  "./src/images/MQ22.png",
  "./src/images/MQ23.png",
  "./src/images/MQ24.png",
  "./src/images/MQ25.png",
  "./src/images/MQ26.png",
  "./src/images/MQ27.png",
  "./src/images/MQ28.png",
  "./src/images/MQ29.png",
  "./src/images/MQ30.png",
];
function setImage(obj) {
  let value = obj.value;
  image.src = img_array[value];
}
