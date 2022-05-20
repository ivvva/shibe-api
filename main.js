const BASE_URL = "http://shibe.online/api/";
const NUMBER_OF_IMAGES = 100;
const userChoiceShibe = document.getElementById("shibe-btn");
const userChoiceGato = document.getElementById("gato-btn");
const userChoiceBirb = document.getElementById("birb-btn");
const imgDisplay = document.getElementById("img-container");
let arrShibe = [];
let arrGato = [];
let arrBirb = [];
userChoiceShibe.addEventListener("click", display);
userChoiceGato.addEventListener("click", display);
userChoiceBirb.addEventListener("click", display);

async function fetchImg() {
  arrShibe = await fetch(BASE_URL + `shibes?count=${NUMBER_OF_IMAGES}`)
    .then((response) => response.json())
    .then((data) => data);

  arrGato = await fetch(BASE_URL + `cats?count=${NUMBER_OF_IMAGES}`)
    .then((response) => response.json())
    .then((data) => data);

  arrBirb = await fetch(BASE_URL + `birds?count=${NUMBER_OF_IMAGES}`)
    .then((response) => response.json())
    .then((data) => data);
}

async function main() {
  await fetchImg();
}

function display(event) {
  userChoice = event.srcElement.value;
  let img = document.getElementById("cute");
  img.style.width = "700px";
  img.style.height = "700px";
  img.style.objectFit = "cover";
  switch (userChoice) {
    case "shibe":
      if (arrShibe.length == 1) {
        fetchImg();
      }
      img.src = arrShibe.pop();
      break;
    case "gato":
      if (arrGato.length == 1) {
        fetchImg();
      }
      img.src = arrGato.pop();
      break;
    case "birb":
      if (arrBirb.length == 1) {
        fetchImg();
      }
      img.src = arrBirb.pop();
      break;
  }
}

main();
