let image_tracker = "off";
let image = document.getElementById("ifimg");
let radar = "off";

function changePower() {
  if (image_tracker == "off") {
    image.src = "./src/images/PIR2.png";
    document.getElementById("pushbuttonPower").innerHTML = "Stop Simulation";
    document.getElementById("pushbuttonPower").style.backgroundColor = "red";
    document.getElementById("pushbuttonRadar").style.display = "inline";
    image_tracker = "on";
  } else {
    image.src = "./src/images/PIR1.png";
    document.getElementById("pushbuttonPower").innerHTML = "Start Simulation";
    document.getElementById("pushbuttonPower").style.backgroundColor =
      "#009C4E";
    document.getElementById("pushbuttonRadar").style.display = "none";
    image_tracker = "off";
  }
}

function showRadar() {
  if ((image.src = "./src/images/PIR2.png")) {
    image.src = "./src/images/PIR3.png";
    document.getElementById("pushbuttonRadar").style.display = "none";
    radar = "on";
  }
}

function changeImageIn() {
  if (
    image_tracker == "on" &&
    (radar == "on" ||
      radar == "out1" ||
      radar == "out2" ||
      radar == "out3" ||
      radar == "out4" ||
      radar == "out5" ||
      radar == "out6")
  ) {
    image.src = "./src/images/PIR4.png";
    radar = "in1";
  } else if (radar == "in1") {
    image.src = "./src/images/PIR10.png";
    radar = "in2";
  } else if (radar == "in2") {
    image.src = "./src/images/PIR8.png";
    radar = "in3";
  } else if (radar == "in3") {
    image.src = "./src/images/PIR13.png";
    radar = "in4";
  } else if (radar == "in4") {
    image.src = "./src/images/PIR16.png";
    radar = "in5";
  } else if (radar == "in5") {
    image.src = "./src/images/PIR4.png";
    radar = "on";
  }
  // } else if (radar == "in5") {
  //   image.src = "./src/images/PIR9.png";
  //   radar = "in6";
  // } else if (radar == "in6") {
  //   image.src = "./src/images/PIR10.png";
  //   radar = "in7";
  // } else if (radar == "in7") {
  //   image.src = "./src/images/PIR11.png";
  //   radar = "in8";
  // } else if (radar == "in8") {
  //   image.src = "./src/images/PIR12.png";
  //   radar = "in9";
  // } else if (radar == "in9") {
  //   image.src = "./src/images/PIR13.png";
  //   radar = "in10";
  // } else if (radar == "in10") {
  //   image.src = "./src/images/PIR14.png";
  //   radar = "in11";
  // } else if (radar == "in11") {
  //   image.src = "./src/images/PIR15.png";
  //   radar = "in12";
  // } else if (radar == "in12") {
  //   image.src = "./src/images/PIR16.png";
  //   radar = "in13";
  // } else if (radar == "in13") {
  //   image.src = "./src/images/PIR17.png";
  //   radar = "in14";
  // } else if (radar == "in14") {
  //   image.src = "./src/images/PIR18.png";
  //   radar = "in15";
  // }
}

function changeImageOutLeft() {
  if (
    image_tracker == "on" &&
    (radar == "on" ||
      radar == "in1" ||
      radar == "in2" ||
      radar == "in3" ||
      radar == "in4" ||
      radar == "in5" ||
      radar == "out4" ||
      radar == "out5" ||
      radar == "out6")
  ) {
    image.src = "./src/images/PIR27.png";
    radar = "out1";
  } else if (radar == "out1") {
    image.src = "./src/images/PIR22.png";
    radar = "out2";
  } else if (radar == "out2") {
    image.src = "./src/images/PIR20.png";
    radar = "out3";
  } else if (radar == "out3") {
    image.src = "./src/images/PIR30.png";
    radar = "on";
  }
}

function changeImageOutRight() {
  if (
    image_tracker == "on" &&
    (radar == "on" ||
      radar == "in1" ||
      radar == "in2" ||
      radar == "in3" ||
      radar == "in4" ||
      radar == "in5" ||
      radar == "out1" ||
      radar == "out2" ||
      radar == "out3")
  ) {
    image.src = "./src/images/PIR35.png";
    radar = "out4";
  } else if (radar == "out4") {
    image.src = "./src/images/PIR26.png";
    radar = "out5";
  } else if (radar == "out5") {
    image.src = "./src/images/PIR24.png";
    radar = "out6";
  } else if (radar == "out6") {
    image.src = "./src/images/PIR32.png";
    radar = "on";
  }
}
