const canvas=document.querySelector("canvas");
const ctn = canvas.getContext("2d");
const toolBtn=document.querySelectorAll(".tools");
const fillCol=document.querySelector("#fill-color");
const colBtns=document.querySelectorAll(".color .option");
const colPic=document.querySelector("#cpicker");
const size=document.querySelector("#slider");
const clear=document.querySelector(".clear");
const save=document.querySelector(".save");


let preMX,preMY,snapshot;
let isDraw=false;
let brushW=5;
let toolselect="brush";
let colSelect="#000";


const setCanvasBackground=()=>{
    ctn.fillStyle="#fff";
    ctn.fillRect(0,0,canvas.width,canvas.height);
    ctn.fillStyle=colSelect;
}

window.addEventListener("load",()=>{
    canvas.width=canvas.offsetWidth
    canvas.height=canvas.offsetHeight
    setCanvasBackground();
});

const startDraw=(e)=>{
    preMX=e.offsetX;
    preMY=e.offsetY;
    isDraw=true;
    ctn.beginPath();
    ctn.lineWidth=brushW;
    ctn.strokeStyle=colSelect;
    ctn.fillStyle=colSelect;
    snapshot=ctn.getImageData(0,0,canvas.width,canvas.height);
}

const stopDraw=()=>{
    isDraw=false
}

const drawRect=(e)=>{
    if(!fillCol.checked){
        return ctn.strokeRect(e.offsetX,e.offsetY,preMX-e.offsetX, preMY-e.offsetY)
    }
    ctn.fillRect(e.offsetX,e.offsetY,preMX-e.offsetX, preMY-e.offsetY)
}

const drawCir=(e)=>{
    ctn.beginPath();
    let radius=Math.sqrt(Math.pow((preMX-e.offsetX),2)+Math.pow((preMY-e.offsetY),2));
    ctn.arc(preMX,preMY,radius,0,2*Math.PI);
    fillCol.checked?ctn.fill():ctn.stroke();
}

const drawTri=(e)=>{
    ctn.beginPath()
    ctn.moveTo(preMX,preMY);
    ctn.lineTo(e.offsetX,e.offsetY)
    ctn.lineTo(preMX*2 - e.offsetX,e.offsetY);
    ctn.closePath();
    fillCol.checked?ctn.fill():ctn.stroke();


}


const drawing =(e)=>{
    if(!isDraw)
        return
    ctn.putImageData(snapshot,0,0)

    if(toolselect==="brush" || toolselect==="eraser"){
        ctn.strokeStyle=toolselect==="eraser"?"#fff":colSelect
        ctn.lineTo(e.offsetX,e.offsetY);
        ctn.stroke();
    }else if(toolselect==="rectangle"){
        drawRect(e);
    }else if(toolselect==="circle"){
        drawCir(e);
    }else if(toolselect==="triangle"){
        drawTri(e);
    }
}


toolBtn.forEach(btn =>{
    btn.addEventListener("click",()=>{
        // console.log(btn.id);
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        toolselect=btn.id;
        console.log(toolselect);
        
    })
})
size.addEventListener("change",()=> brushW=size.value)

colBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        colSelect=window.getComputedStyle(btn).getPropertyValue("background-color")
    })
})

colPic.addEventListener("change",()=>{
    colPic.parentElement.style.background=colPic.value;
    colPic.parentElement.click();
})

clear.addEventListener("click",()=>{
    ctn.clearRect(0,0,canvas.width,canvas.height);
    setCanvasBackground();
})

save.addEventListener("click",()=>{
    const link=document.createElement("a");
    link.download=`${Date.now()}.jpg`;
    link.href=canvas.toDataURL();
    link.click();
})


canvas.addEventListener("mousedown",startDraw)
canvas.addEventListener("mouseup",stopDraw)
canvas.addEventListener("mousemove",drawing)