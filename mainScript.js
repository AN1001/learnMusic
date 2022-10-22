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
		} else if(el[0] == 'sheetMusic'){
			
			let musicEl = document.createElement("div");
			musicEl.id = "musicContainer";
			const {
				Renderer,
				Stave,
				StaveNote,
				Voice,
				Formatter
			  } = Vex.Flow;
			
			const notesRaw = el[1];
			const renderer = new Renderer(musicEl, Renderer.Backends.SVG);
			let cols = Math.ceil(notesRaw[1].length/2);
			renderer.resize(420, (130*cols-10));
			const context = renderer.getContext();
			
			notesRaw[1].forEach(function(bar,i) {
				let col = Math.floor(i/2);
				let row = i%2;
			
				const stave = new Stave(row*200+10, col*130, 200);
				if(i==0){
					stave.addClef('treble').addTimeSignature(notesRaw[0]);
				}
				stave.setContext(context).draw();
			
				if(!bar.length==0){
					const notes = [];
					notesRaw[1][i].forEach(function(note) {
						notes.push(new StaveNote({
							keys: note.slice(0,-1),
							duration: note[note.length - 1]
						}))
					});
			
					const voice = new Voice({
						num_beats: notesRaw[0].split('/')[0],
						beat_value: notesRaw[0].split('/')[1]
					});
			
					voice.addTickables(notes);
					if(i==0){
						new Formatter().joinVoices([voice]).format([voice], 130);
					} else {
						new Formatter().joinVoices([voice]).format([voice], 180);
					}
					voice.draw(context, stave);
				}
			})
			mainArea.appendChild(musicEl);
		} else if(el[0] == 'audioPlayer'){
			let audioTemp = document.querySelectorAll(".audioPlayer")[0].content.cloneNode(true);
			let audioEl = audioTemp.childNodes[1];
			mainArea.appendChild(audioTemp)

			const audio = new Audio("test.mp3");
			const mediaBtn = audioEl.childNodes[1];
			const currentTime = audioEl.childNodes[5].childNodes[1];
			const totalTime = audioEl.childNodes[5].childNodes[3];
			const durationBar = audioEl.childNodes[3];

			console.log(el[0][1]);

			mediaBtn.onclick = () => {
				if (audio.paused) { audio.play(); }
				else { audio.pause(); }
			};
			
			audio.onplay = () => { aPlayIco.innerHTML = "pause"; };
			audio.onpause = () => { aPlayIco.innerHTML = "play_arrow"; };

			var timeString = (secs) => {
				let ss = Math.floor(secs),
					hh = Math.floor(ss / 3600),
					mm = Math.floor((ss - (hh * 3600)) / 60);
				ss = ss - (hh * 3600) - (mm * 60);
				
				if (hh>0) { mm = mm<10 ? "0"+mm : mm; }
				ss = ss<10 ? "0"+ss : ss;
				return hh>0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}` ;
			};

			audio.onloadstart = () => {
				currentTime.innerHTML = "Loading";
				totalTime.innerHTML = "";
			};
			   
			audio.onloadedmetadata = () => {
				currentTime.innerHTML = timeString(0);
				totalTime.innerHTML = timeString(audio.duration);
				durationBar.max = Math.floor(audio.duration);

				var userSelectingTime = false;
				durationBar.oninput = () => { userSelectingTime = true; };
				durationBar.onchange = () => {
					audio.currentTime = durationBar.value;
					if (!audio.paused) { audio.play(); }
					userSelectingTime = false;
				};
				
				audio.ontimeupdate = () => {
					if (!userSelectingTime) { durationBar.value = Math.floor(audio.currentTime); }
				};
			};

			audio.oncanplaythrough = () => {
				mediaBtn.disabled = false;
				durationBar.disabled = false;
			};
			audio.onwaiting = () => {
				mediaBtn.disabled = true;
				durationBar.disabled = true;
			};
		}
	}
}
