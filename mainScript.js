var xhttp = new XMLHttpRequest();
var lessonInfo;
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        lessonInfo = JSON.parse(xhttp.responseText);
        console.log(lessonInfo);
    }
};
xhttp.open("GET", "LESSONINFO.json", true);
xhttp.send();
const buttons = document.getElementById("gradeDetails");
const mainArea = document.getElementById("lessonArea");

if(window.innerWidth >= 850){
	mainArea.style.display = "block";
}

const gradeFlowChart = document.getElementById("gradeFlowChart");
const gradeBtnsHolder = document.getElementById("gradeBtns");
const mnTitle = document.getElementById("mnTitle");
const mnSub = document.getElementById("mnSub");

const temp = document.querySelectorAll(".lessonSelectUI")[0];
buttons.addEventListener("click",function(e){
    target = e.target.parentElement;
    if(!isNaN(target.id) && !target.id==""){
        let lessonObj = lessonInfo[target.id];
        let bar;
        Object.keys(lessonObj).forEach((key) => {
            bar = temp.content.cloneNode(true);
            bar.querySelector('.lessonCode').textContent = key;
            bar.querySelector('.lessonDesc').firstChild.textContent = lessonObj[key];
            gradeFlowChart.appendChild(bar);
        })
        mnTitle.textContent = "Lessons";
        mnSub.textContent = "Grade "+target.id+" all lessons";
        gradeFlowChart.style.display = "block";
        gradeBtnsHolder.style.display = "none";
    }
});

const backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click",function(){
    gradeFlowChart.style.display = "none";
    gradeBtnsHolder.style.display = "block";
	while(gradeFlowChart.lastChild && gradeFlowChart.lastChild.id!="backBtn") {
		gradeFlowChart.lastChild.remove();
	}
})

gradeFlowChart.addEventListener("click",function(e){
    target = e.target.parentElement;
	if(target.classList.contains("lessonSelectData") || target.parentElement.classList.contains("lessonSelectData")){
		if(target.parentElement.classList.contains("lessonSelectData")){
			target = target.parentElement;
		}
		let code = target.childNodes[1].textContent.replace(":","");
		let req = new XMLHttpRequest();
		let lessonData;
		req.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				lessonData = req.responseText;
				updateLesson(lessonData);
			}
		};
		req.open("GET", "rawLessonData/"+code+".json", true);
		req.send();
	}
});

function updateLesson(txt){
	const embellishment = document.getElementById("embellishment").content.cloneNode(true);
	let layoutData = JSON.parse(txt);
	
	const backBtn2 = document.createElement("div");
	backBtn2.id = "backBtn2";
	backBtn2.addEventListener("click",function(){
		buttons.style.display = "block";
		mainArea.style.display = "none";
	})
	
	if(window.innerWidth <= 850){
		buttons.style.display = "none";
		mainArea.style.display = "block";
		backBtn2.style.display = "block";
	}
	
	while(mainArea.lastChild) {
		mainArea.lastChild.remove();
	}
	
	embellishment.childNodes[3].textContent = eval(layoutData[0])[0];
	embellishment.childNodes[5].textContent = eval(layoutData[0])[1];
	mainArea.appendChild(backBtn2);
	mainArea.appendChild(embellishment);

	for (const i in layoutData) {
		const el = eval(layoutData[i]);
		if(el[0] == 'title'){
			let titleEl = document.querySelectorAll(".titleTemp")[0].content.cloneNode(true);
			titleEl.childNodes[1].textContent = el[1];
			mainArea.appendChild(titleEl);
		} else if(el[0] == 'line'){
			let lineEl = document.querySelectorAll(".lineTemp")[0].content.cloneNode(true);
			lineEl.childNodes[1].textContent = el[1];
			mainArea.appendChild(lineEl);
		} else if(el[0] == 'text'){
			let textEl = document.querySelectorAll(".textTemp")[0].content.cloneNode(true);
			textEl.childNodes[1].textContent = el[1];
			mainArea.appendChild(textEl);
		} else if(el[0] == 'icaption'){
			let captionEl = document.querySelectorAll(".iCaption")[0].content.cloneNode(true);
			let caption = captionEl.childNodes[1]
			caption.childNodes[1].src = el[1][0];
			caption.childNodes[3].textContent = el[1][1];
			mainArea.appendChild(captionEl);
		}
	}
}

const { Factory, EasyScore, System } = Vex.Flow;

const vf = new Factory({
  renderer: { elementId: 'lessonArea', width: 500, height: 200 },
});

const score = vf.EasyScore();
const system = vf.System();

system
  .addStave({
    voices: [
      score.voice(score.notes('C#5/q, B4, A4, G#4', { stem: 'up' })),
      score.voice(score.notes('C#4/h, C#4', { stem: 'down' })),
    ],
  })
  .addClef('treble')
  .addTimeSignature('4/4');

vf.draw();
