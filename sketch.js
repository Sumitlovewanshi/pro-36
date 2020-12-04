var dog, happyDog,bedroom,garden,washroom, database, foodS, foodStock;
var fedTime;
var lastFed,addfood,food,feed;
function preload()
{
  dog1 = loadImage("dogImg.png")
  dog2 = loadImage("dogImg1.png")
  bedroom = loadImage("Bed Room.png")
  washroom = loadImage("Wash Room.png")
  garden = loadImage("Garden.png")
}

function setup() {
	createCanvas(800, 700);
  database = firebase.database();

  food = new food();
  dog = createSprite(400,350,10,10);
  dog.addImage(dog1)
  dog.scale = 0.2;

  foodStock=database.ref('food');
  foodStock.on("value",readStock);
  textSize(20); 

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addfood=createButton("Add food");
  addfood.position(800,95);
  addfood.mousePressed(addfoods);


}

function draw() {
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      food.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      food.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      food.washroom();
   }else{
    update("Hungry")
    food.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addfood.hide();
     dog.remove();
   }else{
    feed.show();
    addfood.show();
    dog.addImage(dog1);
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  food.updatefoodStock(foodS);
}

readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

//function to update food stock and last fed time
function feedDog(){
  dog.addImage(dog2);

  food.updatefoodStock(food.getfoodStock()-1);
  database.ref('/').update({
    food:food.getfoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addfoods(){
  foodS++;
  database.ref('/').update({
    food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}