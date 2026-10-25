let row = 1000;
let col = 26;

let sheetDB = [];

function createSheetDB() {
    for (let i = 0; i < row; i++) {
        let row = [];
        for (let j = 0; j < col; j++) {
            row.push(
                {
                    value: "",
                    formula: "",
                    children: [],
                    parents: []
                }
            );
        }
        sheetDB.push(row);
    }
}

createSheetDB();

let topRow = document.querySelector(".top-row");
let leftCol = document.querySelector(".left-col");
let cellContainer = document.querySelector(".cells");

function generateHeaders() {

    for (let i = 0; i < col; i++) {

        let cell = document.createElement("div");

        cell.textContent = String.fromCharCode(65 + i);

        cell.classList.add("cell");

        topRow.appendChild(cell);
    }

    for (let i = 0; i < row; i++) {

        let cell = document.createElement("div");

        cell.textContent = i + 1;

        cell.classList.add("cell");

        leftCol.appendChild(cell);
    }
}

generateHeaders();

let selectedCell = null;
function generateCells() {
    for (let i = 0; i < row; i++) {
        let rowDiv = document.createElement("div");
        rowDiv.classList.add("row");

        for (let j = 0; j < col; j++) {
            let cell = document.createElement("div");
            cell.contentEditable = true;
            cell.classList.add("cell");
            cell.setAttribute("rid",i);
            cell.setAttribute("cid",j);
            rowDiv.appendChild(cell);
            cell.addEventListener("click", function(e)  {
                selectedCell = cell;
                let addressBar=document.querySelector("#address");
                let address=String.fromCharCode(65+j)+(i+1);
                addressBar.value=address;
                console.log(sheetDB[i][j]);
            })
        }

        cellContainer.appendChild(rowDiv);
    }
}

generateCells();

cellContainer.addEventListener("blur", function(e) {
    console.log(e.target);
    let cell = e.target;
    let value = cell.textContent;
    let rid=Number(cell.getAttribute("rid"));
    let cid=Number(cell.getAttribute("cid"));
    sheetDB[rid][cid].value=value;
},
true,);

let boldbtn = document.querySelector("#bold");
let italicbtn = document.querySelector("#italic");
let underlinebtn = document.querySelector("#underline");

boldbtn.addEventListener("click", function(e) {
    if(!selectedCell) return;
    selectedCell.style.fontWeight = 
    selectedCell.style.fontWeight == "bold" ? "normal" : "bold";    
});

italicbtn.addEventListener("click", function(e) {
    if(!selectedCell) return;
    selectedCell.style.fontStyle = 
    selectedCell.style.fontStyle == "italic" ? "normal" : "italic";    
});

underlinebtn.addEventListener("click", function(e) {
    if(!selectedCell) return;
    selectedCell.style.textDecoration = 
    selectedCell.style.textDecoration == "underline" ? "none" : "underline";    
});

function evaluateFormula(formula){
    if(formula === "") return "";
    let tokens=formula.split(" ");
    for(let i=0;i<tokens.length;i++){
        if(/^[A-Z][0-9]+/.test(tokens[i])){
            let {rid, cid}=getRIDCID(tokens[i]);
            let value=sheetDB[rid][cid].value;
            tokens[i]=value;
        }
    }
    let expression=tokens.join(" ");
    try{
        return eval(expression);
    }
    catch(err){
        console.error("Error");
        return "";
    
}

}

function getRIDCID(address){
    let rid=address.charCodeAt(0)-65;
    let cid=Number(address.slice(1))-1;
    return {rid,cid};
}


let formulaInput = document.querySelector("#formula");

formulaInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        if (!selectedCell) return;

        let formula = formulaInput.value;
        let value = evaluateFormula(formula);

        console.log(value);
    }
});