var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
       var lessonInfo = JSON.parse(xhttp.responseText);
    }
};
xhttp.open("GET", "LESSONINFO.json", true);
console.log(lessonInfo);
xhttp.send();
let buttons = document.getElementById("gradeDetails");

buttons.addEventListener("click",function(e){
    target = e.target;
    if(!isNaN(target.id)){
        console.log(lessonInfo[target.id])
    }
});
