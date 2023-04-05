//GUI variables
let corn=0;         //numri i korneve
let max=7;          //vlera max multiplikuese
let start_mult=0;   //vlera startuese min e multiplikimit
let ver=360;        //numri i pikave ne perimeter
let dif=0.008;      //hapi i rritjes se multiplikimit ne çdo cikel tek draw()
let base_point=1;   // 1-fillo ne kend; 0-fillo ne mes;
let edge=1;         //konturi eshte i dukshem: 1
let saturation=160; //saturacioni i vijave
let alpha=100;      //opaciteti i vijave

//variablat e sistemit
let mult=start_mult;//numri multiplikimit per secilen vertex
let dir=1;          //nqs mult rritet: 1
let m_pos=1;        //pozicioni i kursorit ne menu
const m_max=9;      //numri i ndarjeve ne menu
let r;              //rrezja e rrethit

function setup()
{
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB,255);
  stroke(255);
  noFill();
}


function draw()
{
  background(0);
  noFill();
  applyMatrix();
  translate(width/2,height/2);  //qendra e ekranit
  rotate(PI/2);                 //0 e me tej
  if(corn==0)       //nese figura eshte rrethore
  {
    r=height/2;     //vendosja e rrezes
    stroke(255);
    if(edge==1) circle(0,0,r); 
    for(let i=0;i<ver;i++)                //vizatimi i vijave
    {
      stroke(map(i,0,ver,128+dir*128,128-dir*128),saturation,250,alpha);  //mapping color
      let p1=getXY(r,dir*TWO_PI/ver*i);             //llogaritja e koordinatave Karteziane te pikes 1
      let p2=getXY(r,dir*TWO_PI/ver*(i*mult%ver));  //llogaritja e koordinatave Karteziane te pikes 2
      line(p1.x,p1.y,p2.x,p2.y);      //vija qe bashkon dy pikat
    }
  }else if(corn>2)  //nqs figura eshte poligon
  {
    r=height/2*cos(TWO_PI/corn/2);  //llogaritja e rrezes se rrethit te brendashkruar
    stroke(255);
    if(edge==1)
      for(let i=0;i<corn;i++)       //vizatimi i konturit te poligonit
      {
        let p1=getXY(r/cos(TWO_PI/corn/2),TWO_PI/corn*(i-0.5));
        let p2=getXY(r/cos(TWO_PI/corn/2),TWO_PI/corn*(i+0.5));
        line(p1.x,p1.y,p2.x,p2.y);
      }
    for(let i=(-ver/corn/2)*base_point;i<=ver+(ver/corn/2)*base_point;i++)  //vizatimi i vijave (konsiderojme piken baze)
    {
      stroke(map(i,0,ver,128+dir*128,128-dir*128),saturation,250,alpha);  //mapping color
      let angle=dir*TWO_PI/ver;
      let p1=getXY(getR(r,corn,angle*i),angle*i);                       //llogaritja e koordinatave Karteziane te pikes 1
      let p2=getXY(getR(r,corn,angle*(i*mult%ver)),angle*(i*mult%ver)); //llogaritja e koordinatave Karteziane te pikes 2
      line(p1.x,p1.y,p2.x,p2.y);      //line
    }
  }

  //ndryshimi i multiplikimit
  if(dir==1)
    mult+=dif;
  else
    mult-=dif;

  //kthimi i kahut te levizjes
  if(mult<=start_mult) dir=1;
  if(mult>=max) dir=-1;

  resetMatrix();
  if(m_pos>0) GUI();  //vizatimi i nderfaqesit GUI
}

function getXY(r,angle)   //funksioni qe konverton koordinatat Polare ne Karteziane
{
  return createVector(r*cos(angle),r*sin(angle));
}

function getR(r0,corn,angle)  //lloaritja e koordinates polare R e poligonit te rregullt per kendin e dhene
{
  let segment=angle+(PI/corn);
  segment/=TWO_PI/corn;
  segment=floor(segment);
  return r0/cos(angle-TWO_PI/corn*segment);

}

function GUI()    //nderfaqesi grafik i perdoruesit
{
  applyMatrix();
  translate(width-170,10);

  //menuja e perdoruesit --MENUBOX--
  menu_box(1,"Cepat/Kornet",corn,0,24);
  menu_box(2,"Max multi",max,0,21);
  menu_box(3,"Min multi",start_mult,1,2);
  menu_box(4,"Num i vijave",ver,0,450,30);
  menu_box(5,"Shpejtesia",dif,0,0.015,0.001);
  menu_box(6,"Pika ne baze",base_point,2,1);
  menu_box(7,"Konturi",edge,2,1);
  menu_box(8,"Saturacioni",saturation,0,240,20);
  menu_box(9,"Opaciteti",alpha,0,240,20);

  //vizatimi i kursorit te menuse
  applyMatrix();
    translate(-15,m_pos*45-20);
    noStroke();
    fill(190,255,255);
    triangle(-7,-7,-7,7,7,0);
  resetMatrix();

  resetMatrix();

  //vizatimi i shortkateve( te PC) / butonat e navigimit (ne cel)
  applyMatrix();
  translate(width-255,height-160);
  noStroke();
  if(deviceOrientation=='undefined')  //nqs eshte PC
  {
  fill(255);
  textFont("Courier New",15);
  text("[SPACE] - shfaq/fsheh GUI-n",0,0)
  text("[Shigjete] - perdor menune",0,20)
  text("[Enter] - rinis animacionin",0,40)
  text("[Kursori] - navigon ne menu",0,70)
  text("[Scrolli] - ndryshon vlerat",0,90)
  }else                               //nqs eshte cel
  {
    //me touch-butttons tek cel ndryshohen vlerat
    textFont("Courier New",20);
    textAlign(CENTER,CENTER);
    fill(190,209,255);
    rect(0,60,40,30);
    fill(255);
    text("-",20,75);        //butoni 'minus'
    fill(190,209,255);
    rect(60,60,40,30);
    fill(255);
    text("+",80,75);        //butoni 'plus'
    fill(190,209,255);
    rect(20,100,60,30);
    fill(255);
    text("HIDE",50,115);    //butoni 'hide'
  }
  resetMatrix();
}

//vizatimi dhe zoterimi i menu box
function menu_box(position,name,value,style,max,step=1)
{
  let y=position*45-40;
  noStroke();

  fill(190,209,255);  //pozicionimi
  rect(0,y,160,40);

  fill(255);          //etiketat
  textFont("Courier New",15);
  textAlign(RIGHT);
  text(value,155,15+y)
  textAlign(LEFT);
  text(name + ": ",5,15+y);

  switch(style)       //shiritat e vlerave
  {
    case 0:   //shiritat bazik
    for(let i=0;i<max/step;i++)   //per cdo kutize...
    {
      stroke(200);
      if(i*step<value) fill(0);   //kutizat e mbushura me pak se vlera
      else noFill();
      rect(5+((150-50/(max/step))/(max/step))*i,24+y,100/(max/step),10,2);  //vizato kutizen ne pozicion
    }
    break;
    case 1:   //shiriti nis ne 0 (jo tek 1)
    for(let i=0;i<=max/step;i++)
    {
      stroke(200);
      if(i*step<value+1) fill(0);
      else noFill();
      rect(5+((140-50/(max/step+1))/(max/step+1))*i,24+y,100/(max/step+1),10,2);
    }
    break;
    case 2:   //kalimi 1 nga 1 i opsioneve
    for(let i=0;i<=max/step;i++)
    {
      stroke(200);
      if(i*step==value) fill(0);  //mbush me vlere e opsionit
      else noFill();
      rect(5+((140-50/(max/step+1))/(max/step+1))*i,24+y,100/(max/step+1),10,2);
    }
    break;
  }

  //handling mouse/touch pointing
  if(mouseX>width-170 && mouseX<width-10 && mouseY>y+10 && mouseY<y+50) //nqs veprohet me mouse/touch mbi kete opsion te menuse
  {
    m_pos=position; //ndryshimi i kursorit mbi nje opsion te menuse
  }
}


function keyPressed()
{
  //console.log(key);

  if(key==" ") //shfaq/fshih menune
    {
      if(m_pos==0)
        m_pos=1;
      else
        m_pos=0;
    }
  if(key=="ArrowUp")      //ngjitja lart ne menu
    if(m_pos>1) m_pos--;
  if(key=="ArrowDown")    //levizja poshte ne menu
    if(m_pos<m_max) m_pos++;  

  if(key=="ArrowLeft")    //zvogelimi i vlerave ne menu
  {
    decrement()
  }
  if(key=="ArrowRight")   //rritja e vlerave ne menu
  {
    increment();
  }
  if(key=="Enter") mult=start_mult+0.001; //restartimi i animacionit
}

function mouseWheel(event) //rritja/zvogelimi i vlerave me ane te scroll-it (rrotezes se mausit)
{
  if(event.delta>0) decrement();
  else increment();
}

function touchStarted() { //kontrollimi i nderveprimit me prekje me ane te butonave ose touch-buttons
  if(m_pos==0 && touches.length>0) m_pos=1;
  if(touches[0].x>width-255 && touches[0].x<width-205 && touches[0].y>height-100 && touches[0].y<height-70) //'-' button
    decrement();
  if(touches[0].x>width-195 && touches[0].x<width-155 && touches[0].y>height-100 && touches[0].y<height-70) //'+' button
    increment();
  if(touches[0].x>width-215 && touches[0].x<width-175 && touches[0].y>height-60 && touches[0].y<height-30)  //'hide' button
    m_pos=0;  //fshehja e GUI
}

function decrement()  //zvogelimi i vlerave lidhur me opsionin e zgjedhur ne menu
{
  switch(m_pos)
    {
      case 1:
        if(corn>3)corn--;
        else if(corn==3) corn=0;
      break;
      case 2:
        if(max>1) max--;
        if(mult>max) mult=max-0.001;
      break;
      case 3:
        if(start_mult>0) start_mult--;
      break;
      case 4:
        if(ver>=60) ver-=30;
      break;
      case 5:
        if(dif>0.001) 
          {
            dif=floor(dif*1000-1);    //kur shkon keq ndertimi te eleminohet gabimi '0.800000001'
            dif/=1000;
          }
      break;
      case 6:
        if(base_point==1) base_point=0;
      break;
      case 7:
        if(edge==1) edge=0;
      break;
      case 8:
        if(saturation>0) saturation-=20;
      break;
      case 9:
        if(alpha>20) alpha-=20;
      break;
    }
}

function increment() {    // rritja e vlerave
    switch(m_pos)
    {
      case 1:
        if(corn<24 && corn!=0) corn++;
        else if(corn==0) corn=3;
      break;
      case 2:
        if(max<21)max++;
      break;
      case 3:
        if(start_mult<2) start_mult++;
        if(mult<start_mult) mult=start_mult+0.001;
      break;
      case 4:
        if(ver<=620) ver+=30;
      break;
      case 5:
        if(dif<0.015)
          {
            dif=floor(dif*1000+1);
            dif/=1000;
          }
      break;
      case 6:
        if(base_point==0) base_point=1;
      break;
      case 7:
        if(edge==0) edge=1;
      break;
      case 8:
        if(saturation<240) saturation+=20;
      break;
      case 9:
        if(alpha<240) alpha+=20;
      break;
    }
}