
/* Editori ne adresen https://editor.p5js.org/  */

let time = 0;                   // pozicionohemi ne çastin fillestar / kendi 0
let wave =[];                   // gjenerojme vargun bosh

function setup() {              // funksioni i ndertimit te zones se grafikut
  createCanvas(1400, 400);      // konturohet zona e grafikut
}

function draw() {
  background(250,240,240);      // vendoset ngjyra e sfondit
  translate(200,200);           // pozicionohemi per qendren

  stroke(255,0,0,80);           // percaktojme ngjyren e vijezimit te boshteve
  line(-200,0,1200,0);          // vizatohet boshti X
  line(0,200,0,-200);           // vizatohet boshti Y
  line(200,200,200,-200);       // vizatohet boshti i projeksionit te pikes se gjeneruar

  stroke(255,0,0,50);           // percaktojme ngjyren e vijezimeve te rrjetes
  strokeWeight(2);              // percaktojme trashesine e vijezimeve te rrjetes
  for(i=-200;i<=200;i+=10)
  {
    line(-200,i,1200,i);        // vizatohet rrjeta horizontale
  }
  for(i=-200;i<=200;i+=10)
  {
    line(i,200,i,-200);         // vizatohet rrjeta horizontale
  }

  let radius = 150;             // vendosim rrezen
  strokeWeight(2);              // perdor trashesine prej 2px
  noFill();                     // pa mbushje
  stroke(0,0,0,50);             // me kontur te zi (me alpha channel 50%)
  ellipse(0,0,radius*2);        // vizatohet rrethi gjenerues
  
  let x = radius * cos(time);   // llogaritet abshisa x e pikes gjeneruese ne rreth
  let y = radius * sin(time);   // gjenerohet ordinata y e pikes gjeneruese ne rreth
  wave.unshift(y);              // shton pika te reja ne krye te vargut (sposton grafikun)
  fill(0,0,255);                // me mbushje blu
  stroke(0,0,255);              // me mbushje ngjyren blu
  line(0,0,x,y);                // vizato rrezen qe rrotullohet
  ellipse(x,y,8);               // vizato piken (rreth me rreze 8px) qe rrotullohet ne rreth
  strokeWeight(2);              // perdor trashesine prej 2px
  translate(200,0);             // pozicionohu ne piken fillestare te grafikut
  line(x-200, y,  0, wave[0]);  // vizato vijen horizontale te projeksionit te pikes se gjeneruar
  beginShape();
  noFill();                     // pa mbushje
  stroke(100,155,0);            // me ngjyren e gjeber
  strokeWeight(3);              // me trashesi 5px
  for(i=0;i<wave.length;i++)
  {
      vertex(i,wave[i]);        // gjenero pikat e sinusoides
  }
  endShape();
  
  time -=.02;                   // ndrysho kohen / kendin
}