function countPoints() { // TODO BG only 2's and 3's
  tiles.forEach(el => {
    let rowIndex = parseInt(el.classList[0].slice(-1))
    let columnIndex = parseInt(el.classList[1].slice(-1))
    let rV = parseInt(inpVoltorbs[rowIndex].value)
    let rP = parseInt(inpPoints[rowIndex].value)
    let cV = parseInt(inpVoltorbs[columnIndex+5].value)
    let cP = parseInt(inpPoints[columnIndex+5].value)
    let BG = el.style.backgroundImage
    // Counts
    const rPF = Totalpoints[rowIndex].filter((val) => typeof val === "number" && val !== 0).length;
    const cPF = Totalpoints.map((row) => row[columnIndex]).filter((val) => typeof val === "number" && val !== 0).length;
    const rVF = Totalpoints[rowIndex].filter((val) => val === "x").length;
    const cVF = Totalpoints.map((row) => row[columnIndex]).filter((val) => val === "x").length;
    const rSum = Totalpoints[rowIndex].reduce((sum, value) => {
      if (typeof value === "number" && value !== 0) return sum + value;
      return sum;
    }, 0);
    const cSum = Totalpoints.reduce((sum, row) => {
      const value = row[columnIndex];
      if (typeof value === "number" && value !== 0) return sum + value;
      return sum;
    }, 0);
    // Set BackgroundImage
    const setBG = (bgImg, value) => {
      el.style.backgroundImage = bgImg;
      Totalpoints[rowIndex][columnIndex] = value;
      if (bgImg != TileImg) removeMemos(el);
    };
    // Markers
    if (rP+rV-rSum === 5-rPF-rVF || cP+cV-cSum === 5-cPF-cVF || rP + rV == 5 || cP + cV == 5) { // Dead
      Memo(el, ["v", 1], [2, 3]);
      if (BG == TileImg || BG == SafeImg) {
        el.children[4].style.backgroundImage = "url(Img/Dead.png)"
      }
      MemoBoard[rowIndex][columnIndex] = "v1"
    } else if (rV+rP==6 && rV!=4 || cV+cP==6 && cV!=4) { // V+P=6 
      Memo(el, ["v", 1, 2], [3])
      MemoBoard[rowIndex][columnIndex] = "v12"
    } else if (5-rV<=1/3*rP+1 || 5-cV<=1/3*cP+1) { // !1's 
      Memo(el, ["v", 2, 3], [1])
      MemoBoard[rowIndex][columnIndex] = "v23"
    } else if (5-rV-rVF==1 || 5-cV-cVF==1) { // 4V 
      if (5-rV-rVF==1) {
        var PNT = rP
        var SUM = rSum
      } else if (5-cV-cVF==1) {
        var PNT = cP
        var SUM = cSum
      }
      let Arr = [1, 2, 3]
      Arr.splice(rP-rSum-1, 1)
      Memo(el, ["v", PNT-SUM, Arr])
      MemoBoard[rowIndex][columnIndex] = `v${Arr[0]}${Arr[1]}`
    } else {
      removeMemos(el)
    }
    // Background Image
    if (rV==5-rPF || rP-rSum==0 || cV==5-cPF || cP-cSum==0) { // Only V left
      if (BG == TileImg || BG == SafeImg || BG == DeadImg) setBG(VltImg, "x");
    } else if (rV-rVF==0 && 5-rVF-rPF==rP-rSum || cV-cVF==0 && 5-cVF-cPF==cP-cSum) { // Only 1 left 
      if (BG == TileImg || BG == SafeImg || BG == DeadImg) setBG(Pnt1Img, 1);
    } else if (rV-rVF==0 || cV-cVF==0) { // Safe 
      if (BG == TileImg || BG == SafeImg || BG == DeadImg) setBG(SafeImg, 0);
    } 
  });
  CountFoM()
 /*  if (SumTotalPnts - 25 + SumTotalVlts == count2 + count3 * 2) { // Alerts when game is done
    alert("won");
  } else {
  } */
  // Calculate selection score = P(cell is a 2 or 3) / (ε + P(Voltorb))
  /* 
  Number of 1's = 8 + 8 + 8 + 8 + 8 = 40
  Number of 2's = 0 + 8 + 5 + 2 + 7 = 22
  Number of 3's = 7 + 2 + 4 + 6 + 3 = 22
  Number of Voltorbs = 10 + 10 + 10 + 10 + 10 = 50
  40 / 25 / 5 = 1 - 0.176 - 0.176 - 0.4 * 100 = 24.8 %
  22 / 25 / 5 = 0.176 * 100 = 17.6 %
  22 / 25 / 5 = 0.176 * 100 = 17.6 %
  50 / 25 / 5 = 0.4 * 100 = 40 %
  */
}

function FoM(Merit, Voltorb) {
  return Merit/(0.00000001+Voltorb)
}

function calculateFoMValues(count2Arr, count3Arr) {
  const rFoM = [];
  const cFoM = [];
  tiles.forEach(el => {
    let rowIndex = parseInt(el.classList[0].slice(-1))
    let columnIndex = parseInt(el.classList[1].slice(-1))
    let rV = parseInt(inpVoltorbs[rowIndex].value)
    let rP = parseInt(inpPoints[rowIndex].value)
    let cV = parseInt(inpVoltorbs[columnIndex+5].value)
    let cP = parseInt(inpPoints[columnIndex+5].value)
    rFoM.splice(rowIndex, 1, FoM(rP+rV-5-count2Arr[rowIndex]-2*count3Arr[rowIndex], rV))
    cFoM.splice(columnIndex, 1, FoM(cP+cV-5-count2Arr[columnIndex]-2*count3Arr[columnIndex], cV))
  });
  return { rFoM, cFoM };
}

function calculateFoMBoard(rFoM, cFoM) {
  for (let i = 0; i < rFoM.length; i++) {
    FoMBoard[i] = [];
    for (let j = 0; j < cFoM.length; j++) {
      FoMBoard[i][j] = rFoM[i] * cFoM[j];
    };
  };
  for (let row = 0; row < Totalpoints.length; row++) { // Looks at TotalPoints
    for (let column = 0; column < Totalpoints[row].length; column++) {
      if (Totalpoints[row][column] !== 0) {
        FoMBoard[row][column] = 0;
      }
    }
  }
  for (let row = 0; row < MemoBoard.length; row++) { // Looks at MemoBoard
    for (let column = 0; column < MemoBoard[row].length; column++) {
      if (MemoBoard[row][column] === 'v1') {
        FoMBoard[row][column] = 0;
      }
    }
  }
  return FoMBoard;
}

function findHighestValue(matrix) {
  let highestValue = -Infinity; // Initialize with negative infinity
  let rowIndex = 0;
  let colIndex = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const currentValue = matrix[i][j];
      if (currentValue > highestValue && currentValue !== 0) {
        highestValue = currentValue;
        rowIndex = i;
        colIndex = j;
      }
    }
  }
  return { value: highestValue, row: rowIndex, col: colIndex };
}

function areAllValuesZero(board) {
  for (let row = 0; row < board.length; row++) {
    for (let column = 0; column < board[row].length; column++) {
      if (board[row][column] !== 0) {
        return false;
      }
    }
  }
  return true;
}

function CountFoM() {
  const { count3Arr, count2Arr } = Totalpoints.reduce(
    ({ count3Arr, count2Arr }, row) => {
      const rowCounts = row.reduce(
        (acc, cell) => ({
          count3: acc.count3 + (cell === 3 ? 1 : 0),
          count2: acc.count2 + (cell === 2 ? 1 : 0)
        }),
        { count3: 0, count2: 0 }
      );
      count3Arr.push(rowCounts.count3);
      count2Arr.push(rowCounts.count2);
      return { count3Arr, count2Arr };
    },
    { count3Arr: [], count2Arr: [] }
  );
  const { rFoM, cFoM } = calculateFoMValues(count2Arr, count3Arr);
  const FoMBoard = calculateFoMBoard(rFoM, cFoM);
  const { value, row, col } = findHighestValue(FoMBoard);
  let SumTotalPnts = SumTotalVlts = 0
  for (let i = 0; i < 5; i++) {
    SumTotalPnts += parseInt(inpPoints[i].value)
    SumTotalVlts += parseInt(inpVoltorbs[i].value)
  };
  // Select highest value
  if (document.querySelector(".Hint")) {
    let borderEl = document.querySelector(".Hint")
    borderEl.classList.remove("Hint")
  }
  if (areAllValuesZero(FoMBoard)) {
    alert("Won")
  } else {
    let el = document.querySelector(".Row" + row + ".Column" + col)
    el.classList.add("Hint")
    console.log(FoMBoard);
  }
}
// R = S - 5 - 2F - 2*3F
// Figure of merit = R/(1+V)

function Memo(Element, Mark=[], Unmark=[]) {
  if (Element.style.backgroundImage == TileImg) {
    const markers = ["v", 1, 2, 3];
    markers.forEach((marker) => {
      const index = Math.round(4+4*(Math.sin(1.0472*markers.indexOf(marker) - 1.5708)))
      const backgroundImage = Mark.includes(marker)
        ? `url(Img/${marker}marker.png)`
        : "none";
      Element.children[index].style.backgroundImage = backgroundImage;
      if (Unmark.includes(marker)) {
        Element.children[index].style.backgroundImage = "none";
      }
    });
  } 
}

function removeMemos(Element) {
  for (let i = 0; i <= 8; i+=2) {
    Element.children[i].style.backgroundImage = "none"
  }
  Element.children[4].style.backgroundImage = "none"
}

/* Reset the entire board */
function resetBoard() {
  for (let i = 0; i < 10; i++) {
    inpPoints[i].value = ""
    inpVoltorbs[i].value = ""
  };
  let sectionArr = document.querySelectorAll("div[class^='section']")
  sectionArr.forEach(element => {
    element.style.backgroundImage = "none"
    element.style.backgroundSize = "cover"
    element.style.backgroundRepeat = "no-repeat"
  });
  tiles.forEach(element => {
    element.style.backgroundImage = TileImg
  });
  /* outputEl.textContent = "" */
  Totalpoints = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
  if (document.querySelector(".Hint")) {
    let borderEl = document.querySelector(".Hint")
    borderEl.classList.remove("Hint")
  }
  MemoBoard = [["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""]]
  FoMBoard = []
}

resetBoard()