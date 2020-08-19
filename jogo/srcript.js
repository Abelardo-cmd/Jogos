//var maypace;

//Função de inicialização do area do jogo
function startgame(){
    
    GameArea.start()
    maypace= new component(70,200,"#FF0000",50,50)
    myscore=new component(500,50,"black","Consolas","35px","text" )
    
    //Cria uma lista de obstacles
    obstacleList=[]
    obstacleList.push(new component(801,250,"green",20,600))
    obstacleList.push(new component(801,0,"green",20,170))
    
}



GameArea={
    canvas:document.createElement("canvas"),
    button: document.createElement("button") ,
    //Adiciona o node restart no button
    appendchild: function(){
        this.button.appendChild(document.createTextNode("Restart"))
    },
    start : function(){
        this.speed=-2;
        this.canvas.width=800;
        this.canvas.height=600;
        //Reseta o opacity
        this.canvas.style.opacity=1
        this.context=this.canvas.getContext("2d")
        this.frameNo=0;
        
        document.body.insertBefore(this.canvas,document.body.childNodes[0])

        //Aciona um intervalo para o updategame
        this.interval= setInterval(updateGame, 20)
       
        //Cria um evento de teclado
        window.addEventListener("keydown", function(e){
            GameArea.key=e.keyCode;
        })
        window.addEventListener("keyup", function(e){
            GameArea.key=false
        })
        //Termina aqui 
    },
     //Limpa a area de jogo
    clear: function(){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
    },

    //Termina o intervalo de acionamento da função updategame
    stop: function(){
       clearInterval(this.interval)
       this.canvas.style.opacity=0.6
       document.body.insertBefore(this.button,document.body.childNodes[1])
       this.button.onclick= function(){GameArea.restart()} 
},
//Reinicia o jogo e tira o problematico botão start
    restart: function(){
        startgame()
        document.body.removeChild(this.button)
    }
}
function component(x,y,color,width,height,type){
        this.type=type
        this.width=width
        this.height=height
        this.movementx=0
        this.movementy=0
        this.color=color
        this.x=x
        this.y=y
        this.color=color
        
        this.update= function(){
        ctx=GameArea.context
       
        if (this.type=="text"){
        ctx.font= this.height+" "+this.width
        ctx.fillStyle=this.color
        ctx.fillText(this.text, this.x,this.y)
        }else{
            ctx.fillStyle=this.color
            ctx.fillRect(this.x,this.y,this.width,this.height)
        }
        }

       
        this.newpos=function(){
            this.x+= this.movementx
            this.y+= this.movementy
        }
        this.Iscrash=function(obj){
           mytop= this.y
           mybottom=this.y + this.width
           myleft = this.x
           myright= this.x +this.width
           objtop=obj.y
           objbottom=obj.y+obj.height
           objleft= obj.x
           objrigth=obj.x + obj.width
           

           if(myright < objleft || myleft > objrigth || mybottom<objtop || mytop>objbottom){
               crash=false
           }else{
               crash=true
           }
           return crash
        }
     
      
}

//Verifica se ja se passaram n(milisegundos) de tempo 
function everyInterval(n){
    if((GameArea.frameNo/n)%1==0){
      return true
    }else{
        return false
    }
}

function dificult(n){
    if((GameArea.frameNo/n)%1==0){
      return true
    }else{
        return false
    }
}


//Adicionando o child no button uma unica vez
GameArea.appendchild()

function updateGame(){
    //Numero de frames criados ou seja o quantidade de clears
    GameArea.frameNo+=1
    //Desloca a passagem entre o obstacle superior e inferior em deslocpx
    var desloc= Math.random()*100
   //Cria um novo obstacle depois que se apareça o primeiro frame ou depois que se passem 150(milisegundos)
    for(i=0; i<obstacleList.length;i++){
     if(obstacleList[obstacleList.length-1].x<561){
          //Cria um obstaclo na parte inferior da area de jogo
        obstacleList.push(new component(801,250-desloc,"green",20,600))
          //Cria um obstaclo na parte superior da area de jogo
        obstacleList.push(new component(801,0,"green",20,170-desloc))
      }
     }
       
     if(dificult(1000)){
         GameArea.speed-=1
     }

   
  //Limpa a area de jogo 
   GameArea.clear()

   //Reseta a velocidade da peça
    maypace.movementx=0
    maypace.movementy=0
  
    myscore.text="SCORE: "+GameArea.frameNo
    myscore.update()

    //Adiciona novamente a peça na area de jogo após o clear 
    maypace.update()

    //Realiza os procedimentos mencionados acima para cada obstacle 
   for(i=0;i<obstacleList.length; i++){
    obstacleList[i].movementx=0
    obstacleList[i].update()
    obstacleList[i].movementx+=GameArea.speed;
   }
   
    
  //Realiza o movimento da peça de acordo o controle pressionado && estabelece limites nas posições do maypace
    if (GameArea.key && GameArea.key == 38 && maypace.y!=0) {maypace.movementy = -2.5; }
    
    if (GameArea.key && GameArea.key == 37 && maypace.x!=0) {maypace.movementx = -2.5; }
   
    if(GameArea.key && GameArea.key == 40 && maypace.y!=GameArea.canvas.height-50) {maypace.movementy = 2.5; }
 
    if (GameArea.key && GameArea.key == 39 ) {maypace.movementx = 2.5; }
   
//Avança a peça para a proxima posição
    maypace.newpos()
  
    for(i=0;i<obstacleList.length; i++){
    obstacleList[i].newpos()
   }

   
   //Para o jogo se o maypace colidir com um obstacle
   
   for(i=0;i<obstacleList.length; i++){
   if(maypace.Iscrash(obstacleList[i])){
        GameArea.stop()
    }
}
}   


