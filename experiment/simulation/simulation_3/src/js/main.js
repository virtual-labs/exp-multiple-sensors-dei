let image_tracker = "off";
function changePower() {
  let image = document.getElementById("ifimg");
  if (image_tracker == "off") {
    image.src = "./src/images/servo_on.gif";
    image_tracker = "On";
  } else {
    image.src = "./src/images/servo_off.png";
    image_tracker = "off";
  }
}
