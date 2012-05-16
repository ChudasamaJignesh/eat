/**
 * E.A.T. - Enemy class
 * 
 * This class initializeses and organizes itself. All actions
 * are handled in the update method, so regardless of anything
 * just call update() and the class will do the rest. The only
 * points of orientation are the ticks parameter for the update 
 * method which specifies the actual "time" and the count parameter
 * given in the constructor function, which specifies the count of
 * enemies.
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
var DIR_EAST  = 0x00;
var DIR_WEST  = 0x01;
var ENEMY_MAXRADIUS = 60;

function Enemy(context, screen, game) {
  this.ctx = context;
  this.screen = screen;
  this.game = game;
  
  this.image = new Image();
  this.image.src = 'gfx/enemy2.png';
  this.frame = 0;
  
  this.speed = Math.floor(game.stage+(Math.random()*3));
  this.w = this.h = (15+(Math.random()*ENEMY_MAXRADIUS))*this.game.scale;
  
  // Set random start coordinates
  this.y = Math.floor(this.h+(Math.random()*(screen.height-this.h)));
  this.x = (Math.floor(Math.random()*2)) ? 0 : screen.width;  
  
  this.nextAlive = Math.floor(game.ticks+(Math.random()*20));
  this.alive = false;
  this.movePattern = null; // TODO Implement patterns for different movement
  this.direction = (this.x) ? 1 : 0;
  
  // Move
  this.Move = function() {  
    if( this.direction === DIR_EAST ) {
      this.x += this.speed;
      if( this.x >= this.screen.width ) {        
        this.Die();
      }
    } else {
      this.x -= this.speed;
      if( this.x < (-100) ) {        
        this.Die();
      }
    }
  }
  
  this.Die = function() {
    this.alive = false;
    this.nextAlive = this.game.ticks+(Math.random()*30);
    this.x = (Math.floor(Math.random()*2)) ? -100 : screen.width;  
    this.y = Math.floor(this.h+(Math.random()*(screen.height-this.h)));
    this.direction = (Math.floor(Math.random()*2)) ? 1 : 0;
    this.w = this.h = ((this.game.stage*5)+Math.random()*ENEMY_MAXRADIUS)*this.game.scale;
  }
  
  // Update
  this.Update = function(ticks) {    
    if( this.alive === true ) {
      this.Move();
      this.Draw();
    } else {
      // Check ticks if enemy should be born
      if( ticks >= this.nextAlive ) {
        this.alive = true;
      }
    }    
  }
  
  // Draw
  this.Draw = function() {
    if( this.alive === true ) {
      var imgy = (this.direction === DIR_WEST) ? 0 : (this.image.height/2);
      this.ctx.drawImage(this.image, this.frame, imgy, (this.image.width/5), (this.image.height/2), 
                        this.x, this.y, this.w, this.h);
      //this.frame += this.image.width/5;
      if( this.frame >= this.image.width ) this.frame = 0;

      /*this.ctx.beginPath();
      this.ctx.arc(cx, cy, this.radius, 0, 2*Math.PI, false);
      this.ctx.fillStyle = 'rgba(255,0,0, 0.7)';
      this.ctx.fill();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = 'rgba(192,0,0,0.5)';
      this.ctx.stroke();    
      this.ctx.beginPath();
      this.ctx.shadowColor = '#333';
      this.ctx.shadowOffsetX = 0;
      this.ctx.shadowOffsetY = 2;
      this.ctx.shadowBlur = 2;*/
    }
  }
}