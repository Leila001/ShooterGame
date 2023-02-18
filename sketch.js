var ShootingImg,ShooterImg;
var bg, bgImg;
var Player;
var zombie, zombieImg;
var heart1, heart2,heart3;
var heart1Img, heart2Img, heart3Img;
var bullets=70;
var zombieGroup;
var bulletGroup;
var gameState="fight"
var lose, winning, explosionSound;
var lives=3;
var score=0;

function preload(){
  bgImg=loadImage("./assets/bg.jpeg");
  ShooterImg=loadImage("./assets/shooter_2.png");
  ShootingImg=loadImage("./assets/shooter_3.png");
  heart1Img=loadImage("./assets/heart_1.png");
  heart2Img=loadImage("./assets/heart_2.png");
  heart3Img=loadImage("./assets/heart_3.png");
  zombieImg=loadImage("./assets/zombie.png");
  lose=loadSound("./assets/lose.mp3");
  winning=loadSound("./assets/win.mp3");
  explosionSound=loadSound("./assets/explosion.mp3");

}

function setup(){
  createCanvas(windowWidth, windowHeight);

  //adding the background Image
  bg=createSprite(displayWidth/2-20, displayHeight/2-40, 20, 20);
  bg.addImage(bgImg);
  bg.scale=1.1;

  //Creating the player sprite
  Player=createSprite(displayWidth-1150, displayHeight-300, 50, 50);
  Player.addImage(ShooterImg);
  Player.scale=0.3;
  Player.debug=true;
  Player.setCollider("rectangle", 0, 0,300,300);
  
  // creating sprites to depict lives remaining
  heart1=createSprite(displayWidth-150, 40,20,20);
  heart1.visible=false;
  heart1.addImage("heart1",heart1Img);
  heart1.scale=0.4;

  heart2=createSprite(displayWidth-100,40,20,20);
  heart2.visible=false;
  heart2.addImage("heart2", heart2Img);
  heart2.scale=0.4;

  heart3=createSprite(displayWidth-150,40,20,20);
  heart3.addImage("heart3", heart3Img);
  heart3.scale=0.4;

  // creating group for zombies
  zombieGroup=new Group();
  bulletGroup=new Group();
}

function draw(){
  background(0);

if (gameState==="fight")
{
  if (lives===3) {
heart3.visible=true;
heart1.visible=false;
heart2.visible=false;
  }

  if (lives===2) {
    heart3.visible=false;
    heart1.visible=false;
    heart2.visible=true;
      }

      if (lives===1) {
        heart3.visible=false;
        heart1.visible=true;
        heart2.visible=false;
          }

  //go to gamestate "lost" when zero lives remain
  if (lives===0){
    gameState="lost";
  }

  //go to gamestate winning if score reaches 100
  if (score==100){
    gameState="won";
  winning.play();
  }

  // Moving the player up and down, making the game mobile compatible using touches
  if (keyDown ("UP_ARROW") || touches.length>0){
    Player.y=Player.y-30; 
}

  if(keyDown ("DOWN_ARROW") || touches.length>0){
    Player.y=Player.y+30;
  }

// Release bullets and change the Image of shooter to shooting position when space key is pressed
  if(keyWentDown ("space")){
    bullets=createSprite(displayWidth-1150,Player.y-30,20,10)
    bullets.velocityX=20
    bulletGroup.add(bullets)
    Player.depth=bullets.depth
    Player.depth=Player.depth+2
    Player.addImage(ShootingImg);
    bullets=bullets-1
   // explosionSound.play();
  }

  //player goes back to original standing image once we stop pressing the space key
  else if (keyWentUp ("space")){
    Player.addImage(ShooterImg)
  }
 if(bullets==0){
  gameState="bullet";
lose.play();
 }

  // destroy zombie when player touches it
  if(zombieGroup.isTouching(bulletGroup)){

    for(var i=0; i<zombieGroup.length; i++){
      if (zombieGroup[i].isTouching(bulletGroup)){
        zombieGroup[i].destroy();
        bulletGroup.destroyEach();
        explosionSound.play();

        score=score+20;
      }
    }
  }

  if(zombieGroup.isTouching(Player)){

    lose.play();
    for(var i=0; i<zombieGroup.length; i++){
      if (zombieGroup[i].isTouching(Player)){
        zombieGroup[i].destroy();
      lives=lives-1;
      }
    }
  }

  enemy();
}
  drawSprites();

  //displaying the score and remaining lives and bullets
  textSize(20);
  fill("white");
  text("Bullets="+bullets,displayWidth-210, displayHeight/2-250);
  text("Score="+score,displayWidth-200, displayHeight/2-220);
  text("Lives="+lives,displayWidth-200, displayHeight/2-280);

  if(gameState=="lost"){
    textSize(100)
    fill ("white")
    text("GAME OVER", 400, 400)
    zombieGroup.destroyEach()
    Player.destroy()
  }
 else if(gameState=="won"){
    textSize(100)
    fill ("white")
    text("YOU WIN", 400, 400)
    zombieGroup.destroyEach()
    Player.destroy()
  }
  else if(gameState=="bullet"){
    textSize(100)
    fill ("white")
    text("YOU RAN OUT OF BULLETS", 400, 400)
    zombieGroup.destroyEach()
    Player.destroy()
    bulletGroup.destroyEach()
  }
}

function enemy(){
  if (frameCount%100===0){

    // giving random x and y postions to the zombies
  zombie=createSprite(random(1500,1100),random(100,700),40,40);

  zombie.addImage(zombieImg);
  zombie.scale=0.15;
  zombie.velocityX=-3;
  zombie.debug=true;
  zombie.setCollider("rectangle", 0,0,400,400);
  zombie.lifetime=400;
  zombieGroup.add(zombie);

  }
}

