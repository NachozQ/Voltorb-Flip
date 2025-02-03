const bodyEl = document.querySelector("body")
const boardEl = document.querySelector(".board")
const outputEl = document.querySelector(".output");
const resetEl = document.querySelector(".reset");

let TileImg = "url(\"Img/Tile.png\")"
let VltImg = "url(\"Img/voltorbTile.png\")"
let Pnt1Img = "url(\"Img/1point.png\")"
let Pnt2Img = "url(\"Img/2point.png\")"
let Pnt3Img = "url(\"Img/3point.png\")"
let SafeImg = "url(\"Img/Safe.png\")"
let DeadImg = "url(\"Img/Dead.png\")"

let FoMBoard = []
let Totalpoints = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0]
];
let MemoBoard = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""]
]

// Makes Tiles in board
const colors = ["Red", "Green", "Yellow", "Blue", "Purple"]
const numRows = 5
const numColumns = 5
for (let i = 0; i < numRows; i++) {
  for (let j = 0; j < numColumns; j++) {
    let divTile = document.createElement("div")
    divTile.className = `Row${i} Column${j} Tile` 
    boardEl.appendChild(divTile)
  };
  const color = colors[i];
  const divInfo = document.createElement("div");
  divInfo.className = `${color} Hor Info`
  boardEl.appendChild(divInfo)
};
for (let i = 0; i < 5; i++) {
  const color = colors[i];
  const divInfo = document.createElement("div");
  divInfo.className = `${color} Ver Info`
  boardEl.appendChild(divInfo)
};
let buttonReset = document.createElement("button")
buttonReset.addEventListener("click", () => { resetBoard() }); 
buttonReset.textContent = "Reset Board"
buttonReset.className = "reset"
boardEl.appendChild(buttonReset)

// Creates Info Cards
const tileInfos = document.querySelectorAll(".Info") 
const tiles = document.querySelectorAll(".Tile");
tileInfos.forEach((element, index) => {
  element.style = "display: grid; grid-template-rows: repeat(2, 1fr); direction: rtl;"
  const Both = ["Points", "Voltorbs"]
  for (let i = 0; i < Both.length; i++) {
    let divEl = document.createElement("div")
    divEl.className = Both[i]
    element.appendChild(divEl)
    let labelEl = document.createElement("label")
    labelEl.for = Both[i]
    let inputEl = document.createElement("input")
    inputEl.tabIndex = "0"
    inputEl.type = "number"
    inputEl.name = Both[i]
    inputEl.className = "inp" + Both[i] + index
    inputEl.addEventListener("click", () => {  inputEl.select() });
    if (Both[i] == "Points") {
      inputEl.placeholder = "00"
      divEl.append(inputEl, labelEl);
    } else {
      inputEl.placeholder = "0"
      let imgEl = document.createElement("img")
      imgEl.src = "Img/Voltorb.png"
      imgEl.alt = Both[i]
      imgEl.style.height = "1.8em"
      divEl.append(inputEl, labelEl, imgEl);
    }
  };
});
const inputs = document.querySelectorAll("input");
const inpPoints = document.querySelectorAll("input[class^='inpPoints']");
const inpVoltorbs = document.querySelectorAll("input[class^='inpVoltorbs']");
document.addEventListener("DOMContentLoaded", () => {
  inpVoltorbs.forEach((element, index) => {
    element.addEventListener("input", () => { formatInput([element]) });
    element.addEventListener("keydown", (event) => {
      if (event.key == "Enter" && index != 9) {
        let nextTab = inpPoints[index+1]
        nextTab.focus()
      }
    });
  });
  inpPoints.forEach((element, index) => {
    element.addEventListener("input", () => { formatInput([element]) });
    element.addEventListener("keydown", (event) => {
      if (event.key == "Enter") {
        let nextTab = inpVoltorbs[index]
        nextTab.focus()
      }
    });
  });
  tiles.forEach(element => {
    for (let i = 0; i < 9; i++) {
      let divEl = document.createElement("div");  
      divEl.className = "section" + i
      divEl.style.backgroundSize = "cover"
      element.appendChild(divEl)
    };
    element.style = `background-image: ${TileImg}; display: grid; grid-template-rows: repeat(3, 1fr); grid-template-columns: repeat(3, 1fr);`
    element.setAttribute("tabindex", -1)
    // Found points
    element.addEventListener("keydown", (eve) => {
      let row = element.classList[0].slice(-1)
      let column = element.classList[1].slice(-1)
      if (eve.key == "1") {
        element.style.backgroundImage = Pnt1Img
        Totalpoints[row][column] = 1
      } else if (eve.key == "2") {
        element.style.backgroundImage = Pnt2Img
        Totalpoints[row][column] = 2
      } else if (eve.key == "3") {
        element.style.backgroundImage = Pnt3Img
        Totalpoints[row][column] = 3
      } else if (eve.key == "x") {
        element.style.backgroundImage = VltImg
        Totalpoints[row][column] = "x"
      } else if (eve.key == "Backspace") {
        element.style.backgroundImage = TileImg
        Totalpoints[row][column] = 0
      }
      removeMemos(element);
      countPoints()
    });
  });
});

document.addEventListener("input", () => {
  const areArraysValid = (inp) => {
    for (const input of inp) {
      if (input.value === '') {
        return false;
      }
    }
    return true;
  };
  if (areArraysValid(inpVoltorbs) && areArraysValid(inpPoints)) countPoints();
});

document.addEventListener("paste", (ev) => {
  ev.preventDefault();
  let paste = (ev.clipboardData || window.clipboardData).getData("text");
  paste = paste.split("\n").map(Number);
  let inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    input.focus();
    input.value = paste[index];
  });
  formatInput(inputs)
  countPoints();
});

footerEl = document.createElement("footer")
bodyEl.appendChild(footerEl)
labelEl = document.createElement("label")
labelEl.for = "level"
labelEl.textContent = "Level: "
footerEl.appendChild(labelEl)
inputEl = document.createElement("input")
inputEl.id = "level"
inputEl.type = "number"
inputEl.max = "8"
inputEl.min = "1"
inputEl.placeholder = "0"
labelEl.appendChild(inputEl)

function formatInput(elements) {
  elements.forEach(el => {
    inputValue = el.value
    if (el.name == "Points") {
      const sanitizedValue = inputValue.replace(/\D/g, "");
      const clampedValue = Math.min(parseInt(sanitizedValue) || 0, 15);
      el.value = clampedValue.toString().padStart(2, "0");
    } else if (el.name == "Voltorbs") {
      if (inputValue > 5)  {
        el.value = "5";
      } else {
        el.value = inputValue.slice(0, 1);
      }
    }
  });
}