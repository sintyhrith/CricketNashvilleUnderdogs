const MAX_SELECTED = 12;
let selected = [];

// ✅ Set your pitch image URL here
const pitchURL = "https://as2.ftcdn.net/v2/jpg/12/96/73/35/1000_F_1296733554_a2gJh0mxT1PAkCmTvYhZwDkqzVZsgqYu.jpg"; // <-- replace with your web URL

const dropdown = document.getElementById("playerDropdown");
const selectedDiv = document.getElementById("selected");
const ground = document.getElementById("ground");
const count = document.getElementById("count");

// Populate dropdown
defaultPlayers.forEach(name=>{
  let opt = document.createElement("option");
  opt.value = name;
  opt.textContent = name;
  dropdown.appendChild(opt);
});

function addPlayer(){
  const val = dropdown.value;
  if(!val) return alert("Select a player");
  if(selected.length >= MAX_SELECTED) return alert("Only 12 players allowed");
  if(selected.some(p=>p.name===val)) return alert("Player already selected");
  selected.push({name: val, x:45, y:45}); // start near center
  render();
}

function render(){
  selectedDiv.innerHTML="";
  // Reset ground with pitch image
  ground.innerHTML = `<img id="pitchImg" src="${pitchURL}" alt="Cricket Pitch">`;

  // List
  selected.forEach(p=>{
    const div = document.createElement("div");
    div.textContent = p.name;
    selectedDiv.appendChild(div);
  });

  // Tokens
  selected.forEach(p=>{
    const token = document.createElement("div");
    token.className = "token";
    token.textContent = p.name;
    token.style.left = p.x + "%";
    token.style.top = p.y + "%";
    makeDraggable(token, p);
    ground.appendChild(token);
  });

  count.textContent = `${selected.length} / ${MAX_SELECTED} Selected`;
}

// Drag
function makeDraggable(el, player){
  el.onmousedown = function(e){
    e.preventDefault();
    let shiftX = e.clientX - el.getBoundingClientRect().left;
    let shiftY = e.clientY - el.getBoundingClientRect().top;

    function moveAt(pageX, pageY){
      let newX = pageX - ground.getBoundingClientRect().left - shiftX;
      let newY = pageY - ground.getBoundingClientRect().top - shiftY;
      // constrain inside ground
      newX = Math.max(0, Math.min(ground.offsetWidth - el.offsetWidth, newX));
      newY = Math.max(0, Math.min(ground.offsetHeight - el.offsetHeight, newY));
      el.style.left = newX + "px";
      el.style.top = newY + "px";
      player.x = (newX / ground.offsetWidth) * 100;
      player.y = (newY / ground.offsetHeight) * 100;
    }

    function onMouseMove(event){
      moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.onmouseup = function(){
      document.removeEventListener('mousemove', onMouseMove);
      document.onmouseup = null;
    };
  };
  el.ondragstart = function(){ return false; };
}

// Export
function exportImage(){
  setTimeout(()=>{
    html2canvas(ground, {useCORS:true, allowTaint:true}).then(canvas=>{
      const link = document.createElement("a");
      link.download="cricket-field.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }).catch(err=>{
      console.error("Export failed:", err);
      alert("Export failed. Make sure the pitch image URL is publicly accessible.");
    });
  }, 200);
}

render();
