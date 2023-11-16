let image_tracker = "off";
let image = document.getElementById("ifimg");

function changePower() {
  if (image_tracker == "off") {
    image.src = "./src/images/SM3.png";
    document.getElementById("pushbuttonPower").innerHTML = "Stop Simulation";
    document.getElementById("pushbuttonPower").style.backgroundColor = "red";
    image_tracker = "on";
  } else {
    image.src = "./src/images/SM1.png";
    document.getElementById("pushbuttonPower").innerHTML = "Start Simulation";
    document.getElementById("pushbuttonPower").style.backgroundColor =
      "#009C4E";
    image_tracker = "off";
  }
}

let img_array = [
  "./src/images/SM3.png",
  "./src/images/SM4.png",
  "./src/images/SM5.png",
  "./src/images/SM6.png",
  "./src/images/SM7.png",
  "./src/images/SM8.png",
  "./src/images/SM9.png",
  "./src/images/SM10.png",
  "./src/images/SM11.png",
  "./src/images/SM12.png",
  "./src/images/SM13.png",
  "./src/images/SM14.png",
  "./src/images/SM15.png",
];
function setImage(obj) {
  let value = obj.value;
  image.src = img_array[value];
}
