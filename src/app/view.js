const {ipcRenderer} = require('electron')
let counter = 0;

function openDialog(){
    ipcRenderer.sendSync("open");
}


ipcRenderer.on("message", (arg, data) => {
    console.log("did I receive ? ", JSON.stringify(data))
    document.getElementById("msg").innerHTML = "[" +  JSON.stringify(data) + "]";
})
