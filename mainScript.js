var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var lessonInfo = JSON.parse(xhttp.responseText);
        console.log(lessonInfo);
    }
};
xhttp.open("GET", "LESSONINFO.json", true);
xhttp.send();
let buttons = document.getElementById("gradeDetails");

buttons.addEventListener("click",function(e){
    target = e.target;
    if(!isNaN(target.id)){
        console.log(lessonInfo[target.id])
    }
});
