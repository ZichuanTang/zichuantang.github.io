(function() {
  // 只在深色模式下启用
  if (!window.matchMedia('(prefers-color-scheme: dark)').matches) return;

  // 创建canvas
  var canvas = document.createElement('canvas');
  canvas.id = 'stars-bg';
  canvas.style.position = 'fixed';
  canvas.style.left = 0;
  canvas.style.top = 0;
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = 0;
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);

  var context;
  var arr = [];
  var starCount = 300;
  var rains = [];
  var rainCount = 8;
  var windowWidth = window.innerWidth;

  function resizeCanvas() {
    windowWidth = window.innerWidth;
    canvas.width = windowWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  context = canvas.getContext('2d');
  context.font = "13px Arial";

  // 星星对象
  var Star = function (){
    this.x = windowWidth * Math.random();
    this.y = 5000 * Math.random();
    this.text=".";
    this.color = "rgba(255,255,255,0.3)";
    this.getColor=function(){
      var _r = Math.random();
      this.color = _r<0.5 ? "rgba(80,80,80,0.2)" : "rgba(255,255,255,0.3)";
    }
    this.init=function(){ this.getColor(); }
    this.draw=function(){
      context.fillStyle=this.color;
      context.fillText(this.text,this.x,this.y);
    }
  }

  // 流星对象
  var MeteorRain = function(){
    this.x = -1; this.y = -1; this.length = -1;
    this.angle = 30; this.width = -1; this.height = -1;
    this.speed = 1; this.offset_x = -1; this.offset_y = -1;
    this.alpha = 0.5;
    this.color1 = ""; this.color2 = "";
    this.init = function () {
      this.getPos();
      this.alpha = 0.5;
      this.getRandomColor();
      var x = Math.random() * 40 + 80;
      this.length = Math.ceil(x);
      this.angle = 30;
      x = Math.random()+0.5;
      this.speed = Math.ceil(x);
      var cos = Math.cos(this.angle*3.14/180);
      var sin = Math.sin(this.angle*3.14/180);
      this.width = this.length*cos;
      this.height = this.length*sin;
      this.offset_x = this.speed*cos;
      this.offset_y = this.speed*sin;
    }
    this.getRandomColor = function (){
      var a = Math.ceil(200-180* Math.random());
      this.color1 = "rgba("+a+","+a+","+a+",0.5)";
      this.color2 = "rgba(0,0,0,0.1)";
    }
    this.countPos = function () {
      this.x = this.x - this.offset_x;
      this.y = this.y + this.offset_y;
    }
    this.getPos = function () {
      this.x = Math.random() * window.innerWidth;
      this.y = Math.random() * window.innerHeight;
    }
    this.draw = function () {
      context.save();
      context.beginPath();
      context.lineWidth = 0.7;
      context.globalAlpha = this.alpha;
      var line = context.createLinearGradient(this.x, this.y, this.x + this.width, this.y - this.height);
      line.addColorStop(0, "rgba(255,255,255,0.7)");
      line.addColorStop(0.3, this.color1);
      line.addColorStop(0.6, this.color2);
      context.strokeStyle = line;
      context.moveTo(this.x, this.y);
      context.lineTo(this.x + this.width, this.y - this.height);
      context.closePath();
      context.stroke();
      context.restore();
    }
    this.move = function(){
      var x = this.x+this.width-this.offset_x;
      var y = this.y-this.height;
      context.clearRect(x-3,y-3,this.offset_x+5,this.offset_y+5);
      this.countPos();
      this.alpha -= 0.002;
      this.draw();
    }
  }

  // 初始化星星
  for (var i=0;i<starCount;i++) {
    var star = new Star();
    star.init();
    star.draw();
    arr.push(star);
  }
  // 初始化流星
  for (var i=0;i<rainCount;i++) {
    var rain = new MeteorRain();
    rain.init();
    rain.draw();
    rains.push(rain);
  }

  // 星星闪烁
  function playStars(){
    for (var n = 0; n < starCount; n++){
      arr[n].getColor();
      arr[n].draw();
    }
    setTimeout(playStars,100);
  }
  // 流星雨
  function playRains(){
    for (var n = 0; n < rainCount; n++){
      var rain = rains[n];
      rain.move();
      if(rain.y>window.innerHeight){
        context.clearRect(rain.x,rain.y-rain.height,rain.width,rain.height);
        rains[n] = new MeteorRain();
        rains[n].init();
      }
    }
    setTimeout(playRains,2);
  }

  playStars();
  playRains();
})(); 