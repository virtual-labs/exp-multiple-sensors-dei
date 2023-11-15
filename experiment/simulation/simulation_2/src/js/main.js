let image_tracker = "off";
let image = document.getElementById("ifimg");

function changePower() {
  if (image_tracker == "off") {
    image.src = "./src/images/US2.png";
    document.getElementById("pushbuttonPower").innerHTML = "Stop Simulation";
    document.getElementById("pushbuttonPower").style.backgroundColor = "red";
    document.getElementById("pushbuttonRadar").style.display = "inline";
    image_tracker = "on";
  } else {
    image.src = "./src/images/US1.png";
    document.getElementById("pushbuttonPower").innerHTML = "Start Simulation";
    document.getElementById("pushbuttonPower").style.backgroundColor =
      "#009C4E";
    document.getElementById("pushbuttonRadar").style.display = "none";
    image_tracker = "off";
  }
}

function showRadar() {
  if ((image.src = "./src/images/US2.png")) {
    image.src = "./src/images/US8.png";
    document.getElementById("pushbuttonRadar").style.display = "none";
    radar = "on";
  }
}

function changeImageIn() {
  if (image_tracker == "on" && radar == "on") {
    image.src = "./src/images/US4.png";
    radar = "in1";
  } else if (radar == "in1") {
    image.src = "./src/images/US15.png";
    radar = "in2";
  } else if (radar == "in2") {
    image.src = "./src/images/US7.png";
    radar = "in3";
  } else if (radar == "in3") {
    image.src = "./src/images/US11.png";
    radar = "in4";
  } else if (radar == "in4") {
    image.src = "./src/images/US14.png";
    radar = "in5";
  } else if (radar == "in5") {
    image.src = "./src/images/US3.png";
    radar = "in6";
  } else if (radar == "in6") {
    image.src = "./src/images/US12.png";
    radar = "in7";
  } else if (radar == "in7") {
    image.src = "./src/images/US5.png";
    radar = "in8";
  } else if (radar == "in8") {
    image.src = "./src/images/US6.png";
    radar = "in9";
  } else if (radar == "in9") {
    image.src = "./src/images/US16.png";
    radar = "in10";
  } else if (radar == "in10") {
    image.src = "./src/images/US9.png";
    radar = "in11";
  } else if (radar == "in11") {
    image.src = "./src/images/US10.png";
    radar = "in12";
  } else if (radar == "in12") {
    image.src = "./src/images/US13.png";
    radar = "on";
  }
}
