const gameOfLife = {
  width: 12,
  height: 12,
  stepInterval: null, 

  setColor: () => {
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    return `#${randomColor}`
  },
  createAndShowBoard: function () {
    
    const goltable = document.createElement("tbody");

    let tablehtml = "";
    for (let h = 0; h < this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (let w = 0; w < this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;

    
    const board = document.getElementById("board");
    board.appendChild(goltable);
    
    this.setupBoardEvents();
  },

  forEachCell: function (iteratorFunc) {
    
    let celdas = document.querySelectorAll('td')
    celdas.forEach(celda => {
      let celdaArray = celda.id.split('-') //[1,2]
      iteratorFunc(celda,parseInt(celdaArray[0]),parseInt(celdaArray[1]))
    })
  },

  setupBoardEvents: function () {
    

    const onCellClick = function (e) {
      

      if (this.dataset.status == "dead") {
        this.className = "alive";
        this.dataset.status = "alive";
        this.style.background = '#' + Math.floor(Math.random()*16777215).toString(16);
      } else {
        this.className = "dead";
        this.dataset.status = "dead";
        this.style.background = '#ced5db';
      }
    };

    
    this.forEachCell(function(celda,x,y){
      celda.addEventListener("click", onCellClick);
    })

    //CLEAR
    let clearButton = document.querySelector('#clear_btn')
    clearButton.addEventListener('click',()=>this.clear())

    //RANDOM
    let randomButton = document.querySelector('#random_btn')
    randomButton.addEventListener('click',()=>this.random())

    //STEP
    let stepButton = document.querySelector('#step_btn')
    stepButton.addEventListener('click',()=>this.step())

    //AUTO
    let autoButton = document.querySelector('#auto_btn')
    autoButton.addEventListener('click',()=>this.enableAutoPlay())

  },

  clear: function(){
    this.forEachCell(function(celda,x,y) {
      // classList.remove('alive')
      celda.classList.remove("alive")
      celda.setAttribute('data-status','dead')
      celda.style.background = '#ced5db';

    })
  },

  random: function(){
    this.forEachCell(function(celda,x,y){
      if (Math.round(Math.random() * 144) > 72) {
        celda.classList.add("alive")
        celda.setAttribute('data-status','alive')
        celda.style.background = '#' + Math.floor(Math.random()*16777215).toString(16);
      } else {
        celda.classList.remove("alive")
        celda.setAttribute('data-status','dead')
        celda.style.background = '#ced5db';
      }
    })
  },

  step: function () {
    
    let vecinosACambiar = []
    this.forEachCell((celda,x,y) => {
      let vecinos = []
      //abajo
      vecinos.push(document.getElementById(`${x-1}-${y+1}`))
      vecinos.push(document.getElementById(`${x}-${y+1}`))
      vecinos.push(document.getElementById(`${x+1}-${y+1}`))
      //misma línea
      vecinos.push(document.getElementById(`${x-1}-${y}`))
      vecinos.push(document.getElementById(`${x+1}-${y}`))
      //arriba
      vecinos.push(document.getElementById(`${x-1}-${y-1}`))
      vecinos.push(document.getElementById(`${x}-${y-1}`))
      vecinos.push(document.getElementById(`${x+1}-${y-1}`))
      let vecinosVivos = vecinos.filter(vecino => vecino !== null && vecino.getAttribute('data-status')==='alive').length

     

      if(celda.getAttribute('data-status')==='alive'){
        if(vecinosVivos!==2 && vecinosVivos!==3){
          vecinosACambiar.push(celda)
        }
      } else {
        if(vecinosVivos===3){
          vecinosACambiar.push(celda)
          // celda.className = 'alive'
          // celda.setAttribute('data-status','alive')
        }
      }
      
    })
    vecinosACambiar.forEach(function(vec) { if(vec.getAttribute('data-status') == 'alive') {
      vec.setAttribute('data-status','dead') 
      vec.className = 'dead'
      vec.style.background = '#ced5db';
    } else {
      vec.className = 'alive';
      vec.setAttribute('data-status','alive')
      vec.style.background = '#' + Math.floor(Math.random()*16777215).toString(16);
    }})
   
  },

  enableAutoPlay: function () {
    const btn = document.getElementById('auto_btn')
    if(this.stepInterval){
      this.stopAutoplay()
      btn.innerText = 'auto'
    } else {
      this.stepInterval = setInterval(() => this.step(),500)
      btn.innerText = 'pause'
    }
  },

  stopAutoplay: function(){
    clearInterval(this.stepInterval)
    this.stepInterval=null
  }
};

gameOfLife.createAndShowBoard();
