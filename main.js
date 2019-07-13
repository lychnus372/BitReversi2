const size = 40;


const property = new Object();
property.num_phase = 61;
property.num_shape = 10;
property.learning_rate = 1/8/2;
property.colorOfCpu = -1;
property.num_readnode = 0;
property.depth = [2, 4];
property.depth0 = 4;
property.depth1 = 4;
property.clickDisabled = false;
property.touchScreen = false;
property.player_state_pass = false;




const createElement = (element="div", property={})=>{
    const div = document.createElement(element);
    div.className = property.className || "";
    div.id = property.id || "";
    return div;
};


const display = new Object();
display.squares = new Array();
display.circles = new Array();
display.black_score = document.getElementById("black_score");
display.white_score = document.getElementById("white_score");

display.comment = document.getElementById("comment");
display.board = document.getElementById("board");
display.pass = document.getElementById("pass");
display.switch = document.getElementById("switch_colors");




(()=>{
	//detect touch screen
	for(const name of ["iPhone", "Android", "Mobile", "iPad"]){
		property.touchScreen = false;
		if(navigator.userAgent.indexOf(name)!==-1){
			property.touchScreen = true;
			break;
		}
	}
	
	
	//generate reversi board
	const reversiBoard = document.getElementById("test");
	for(let i=0;i<8;i++){
		const row = document.createElement("div");
		for(let i=0;i<8;i++){
			const box = document.createElement("div");
			const div = document.createElement("div");
			box.classList.add("board_box");
			row.appendChild(box);
			box.appendChild(div);
			box.style.display = "inline-block";
			display.squares.push(box);
			display.circles.push(div);
		}
		reversiBoard.appendChild(row);
	}

	
	//add eventlistener to each cell
	for(let i=0;i<8;i++){
		for(let j=0;j<8;j++){
			const e = i*8 + j;
			display.circles[e].addEventListener(property.touchScreen?"touchend":"mouseup", ()=>{
				if(property.clickDisabled){
					return;
				}
				if(property.player_state_pass){
					return;
				}
				property.clickDisabled = true;
				master.play(i<4?1<<(31-e):0, i<4?0:1<<(63-e))
				.then(()=>{
					property.clickDisabled = false;
				});
			});
		}
	}
	

	document.body.addEventListener(property.touchScreen?"touchend":"mouseup", (e)=>{
		const target = e.target;
		
		//三回連続クリックの判定
		touchcount++;
		setTimeout(()=>{touchcount=0;}, 300);
		if(touchcount>=3){
			const comment_text = display.comment.innerText;
			display.comment.innerText = "開発モード";
			touchcount = -1e9;
			setTimeout(() => {
				display.comment.innerText = comment_text;
				touchcount = 0;
			}, 3000);
		}
	});

	//on pulldown menu changed (depth)
	document.getElementById("search_depth").addEventListener("change", e=>{
		const value = e.target.value.split("/").map(x=>parseInt(x));
		property.depth0 = value[0];
		property.depth1 = value[1];
	});

	//pass button
	document.getElementById("pass").addEventListener(property.touchScreen?"touchend":"mouseup", e=>{
		if(property.player_state_pass){
			display.pass.style.display = "none";
			property.player_state_pass = false;
			master.play();
		}
	});
})();

let touchcount =0;



