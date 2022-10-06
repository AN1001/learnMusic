var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
       document.getElementById("lessonArea").innerHTML = xhttp.responseText;
    }
};
xhttp.open("GET", "testText.txt", true);
xhttp.send();
