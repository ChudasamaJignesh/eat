/**
 * E.A.T. - The food class
 * 
 * @author Martin Albrecht <martin.albrecht@javacoffee.de>
 * @version: 0.0.2 alpha
 * 
 * LICENSE:
 * --------
 * This program is free software; you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by the 
 * Free Software Foundation; either version 2 of the License, or (at your 
 * option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General 
 * Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along 
 * with this program; if not, write to the
 * 
 * Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330,
 * Boston, MA 02111-1307, USA.
 */
var FOOD_TYPE_BAD  = 0x00;
var FOOD_TYPE_GOOD = 0x01;

function Food(context, screen, game) {
  this.ctx = context;
  this.game = game;
  this.x = Math.floor(this.w+(Math.random()*(screen.width-this.w)));
  this.y = Math.floor(this.h+(Math.random()*(screen.height-this.h)));
  this.stage = 1;  
  this.speed = Math.floor(1+(Math.random()*(5*(this.stage/2))));
  this.show = false;
  this.nextShow = Math.floor(Math.random()*60);
  this.type = FOOD_TYPE_GOOD;
  
  // Initialize the image data
  this.w = this.h = 5*game.scale;
  this.imgd = null;
  if( this.ctx.createImageData ) {
    this.imgd = this.ctx.createImageData(this.w, this.h);
  } else if( this.ctx.getImageData ) {
    this.imgd = this.ctx.getImageData(0, 0, this.w, this.h);
  } else {
    this.imgd = {'width' : w, 'height' : h, 'data' : new Array(this.w*this.h*4)};
  }
  
  // Create pixel data
  this.SetPixelData = function() {
    var pix = this.imgd.data; 
    switch(this.type) {
      case FOOD_TYPE_BAD:
        for( var i=0, n = pix.length; i < n; i+=4) {      
          pix[i] = 255;   // r
          pix[i+1] = 0; // g
          pix[i+2] = 0;  // b
          pix[i+3] = 127; // alpha
        }
        break;
        
      case FOOD_TYPE_GOOD:
      default:
        for( var i=0, n = pix.length; i < n; i+=4) {      
          pix[i] = 255;   // r
          pix[i+1] = 249; // g
          pix[i+2] = 128;  // b
          pix[i+3] = 127; // alpha
        }
        break;
    }
  }
  this.SetPixelData(this.type); // Default pixeldata
  
  // Set random position
  this.SetRnd = function() {
    var rx = Math.floor(10+(Math.random()*(screen.width-20)));
    var ry = Math.floor(Math.random()*100);
    this.SetPos(rx, ry);
    if( this.game.stage >= 2 ) this.SetType();
  }
  
  // Set random type of food
  this.SetType = function() {
    this.type = ( (Math.random()*100) <= 50 ) ? FOOD_TYPE_BAD : FOOD_TYPE_GOOD;
    this.SetPixelData(this.type);
  }
  
  // Set next placement time
  this.SetNext = function(ticks, value) {
    this.nextShow = Math.floor((20+ticks)+(Math.random()*value));
  }
  
  // Set Position
  this.SetPos = function(x, y) {
    this.speed = Math.floor(1+(Math.random()*5));
    this.x = x;
    this.y = y;
  }
  
  // Move
  this.Move = function(ticks) {
    if( this.y < (screen.height+this.h) ) {
      this.y += this.speed;
    } else {
      if( this.type === FOOD_TYPE_GOOD ) this.game.fails--;
      this.SetNext(ticks, 100);
      this.show = false;
    }
  }
  
  // Draw
  this.Draw = function(ticks, stage) {
    this.Move(ticks);
    this.stage = stage;
    context.beginPath();
    context.putImageData(this.imgd, this.x, this.y);
    context.shadowColor = 'rgba(60,60,60,1)';
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 2;
    context.shadowBlur = 2;
    context.closePath();
  }
}