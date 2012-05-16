/**
 * E.A.T. - Player class
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

function Plancton(context, screen, game) {
  this.ctx = context;
  this.x = this.y = 200;
  this.mx = this.my = 0;
  this.speed = 0;
  this.maxspeed = 5;
  this.radius = 5*game.scale;
  this.w = this.h = this.radius*2;
  this.grow = true;
  this.growRadius = this.radius;
  
  // Animate
  this.Animate = function() {
    if( this.grow === true && this.radius <= (this.growRadius+3) ) {
      this.radius += 0.3;
      if( this.radius >= (this.growRadius+3) ) this.grow = false; 
    } else {
      this.radius -= 0.3;
      if( this.radius <= this.growRadius ) this.grow = true;
    }
  }
  
  // Calculate speed
  this.Accelerate = function() {
    var dx = (this.mx > this.x) ? this.mx-this.x : this.x-this.mx;
    var dy = (this.my > this.y) ? this.my-this.y : this.y-this.my;  
    var mousedist = Math.floor(Math.sqrt((Math.pow(dx, 2) + Math.pow(dy, 2))));    
    var factor = 40;
    
    if( mousedist > 20 && this.speed < this.maxspeed ) {
      this.speed = mousedist/factor;
    } else {
      this.speed = mousedist/factor;
    }
  }
  
  // Set random position
  this.SetRnd = function() {
    this.x = Math.floor(Math.random()*screen.width);
    this.y = Math.floor(Math.random()*100);
  }
  
  // Move
  this.Move = function(inscr) {
    this.Accelerate();
    
    if( inscr === 'True' ) {
      // East
      if( this.x+this.w <= this.mx ) {
        this.x += (this.x < (screen.width-(this.w))) ? this.speed : 0;
      }
      // West
      if( this.x+this.w >= this.mx ) {
        this.x -= (this.x > 0) ? this.speed : 0;
      }
      
      // South
      if( this.y+this.h <= this.my ) {
        this.y += (this.y < (screen.height-(this.h))) ? this.speed : 0;
      } 
      // North
      if( this.y+this.h >= this.my ) {
        this.y -= (this.y > 0) ? this.speed : 0;
      }
    }
  }
  
  // Grow
  this.Grow = function() {    
    this.radius += 0.0025;
    this.w = this.h = this.radius * 2;
    this.growRadius = this.radius;
  }
  
  // Update
  this.Update = function(inscreen, mx, my) {
    this.mx = mx;
    this.my = my;
    this.Move(inscreen);
    this.Animate();
    this.Draw();
  }
  
  // Draw
  this.Draw = function() {
    var cx = this.x+this.radius;
    var cy = this.y+this.radius;
    
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, this.radius, 0, 2*Math.PI, false);
    this.ctx.fillStyle = 'rgba(0,160,0, 0.7)';
    this.ctx.fill();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'rgba(0,192,0,0.5)';
    this.ctx.stroke();
    
    this.ctx.shadowColor = 'rgba(60,60,60,1)';
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 2;
    this.ctx.shadowBlur = 2;
    this.ctx.closePath();
    
    /*this.ctx.beginPath();
    this.ctx.fillStyle = 'rgba(255, 0, 0, 1)';
    this.ctx.rect(this.x, this.y, this.w, this.h);
    this.ctx.lineWidth = 1;
    this.ctx.fill();
    this.ctx.closePath();*/
  }
}