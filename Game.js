/**
 * E.A.T. - Main game file
 * 
 * Here, we find the basic game class and main function. The initializes itself
 * through the main function. 
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

var GAMEMODE_INIT  = 0x01;
var GAMEMODE_RUN   = 0x02; 
var GAMEMODE_PAUSE = 0x03;
var GAMEMODE_END   = 0x04;
var GAME_VERSION   = '0.0.2 alpha';
var GAME_MAXENEMIES = 15;
var GAME_STARTENEMIES = 3;
 
// Keyboard codes
var KEYB_D = 100;
var KEYB_I = 105;
var KEYB_M = 109;
var KEYB_P = 112;
var KEYB_S = 115; 
 
function cGame(debug) {   
  // First, we check the browser and its version 
  // to make sure we can display everything     
  this.browser = {};  
  // Browser IE
  if( navigator.appName.search(/Internet Explorer/) !== -1 ) {
    this.browser.name = 'IE';
    this.browser.version = navigator.appVersion.match(/MSIE ([0-9]+)/)[1];    
    // Block IE <9  users
    if( this.browser.version <= 8 ) {
      var html = '<center><strong>Sorry, your browser is too old to play the' +
                 ' game! Please update your browser!</strong></center>';
      document.write(html);
      return false;
    }
  } 
  // Safari
  else if( navigator.vendor.search(/Apple/i) !== -1 ) {
    this.browser.name = 'Safari';
  }
  // All other browsers
  else {
    this.browser.name = navigator.appName;
    this.browser.version = navigator.appVersion.match(/([0-9]+)/)[1];    
  }  
     
  // Loading icon
  this.loading = document.createElement('div');
  this.loading.setAttribute('id', 'loading');
  document.body.appendChild(this.loading);      
    
  // Other stuff    
  var self = this;
  this.fails = 5;
  this.debug = debug;  
  this.stage = 1;
  this.lastStage = this.stage;
  this.keydown = false;
  this.key = null;
  this.score = 0;
  this.ticks = 0;
  this.gid = null; 
  this.playback = true;
  this.playlist = {};
  this.mode = GAMEMODE_INIT;
  this.mouseX = this.mouseY = 0;
  this.IE = document.all ? true : false;
  this.enemyCount = 0;
  
  // Load icons
  this.iconSpeaker = document.createElement('div');
  this.iconSpeaker.setAttribute('id', 'iconSpeaker');
  
  // Debug settings
  if( window.location.origin === 'file://') {
    this.debug = true;
    this.playback = false;
    self.iconSpeaker.style.display = 'block';
  }
 
  // Check screen size and set parameters 
  // for game screen init
  var scrWidth = 0;
  var scrHeight = 0;
  this.scale = 1;
  if( window.innerHeight < 600 ) {
    scrWidth = 640;
    scrHeight = 480;    
  } else if( window.innerHeight >= 600 && window.innerHeight <= 768  ) {
    scrWidth = 800;
    scrHeight = 600;
    this.scale = 1.25;
  } else {
    scrWidth = 1024;
    scrHeight = 768;
    this.scale = 1.28;
  }
 
  // Screen and screen context
  this.main = document.createElement('div');
  this.main.setAttribute('id', 'main');    
  this.main.setAttribute('class', 'h'+scrHeight);    
  this.screen = document.createElement('canvas');
  this.screen.setAttribute('id', 'screen');
  this.screen.setAttribute('class', 'h'+scrHeight);    
  this.screen.setAttribute('width', scrWidth);
  this.screen.setAttribute('height', scrHeight);
  this.ctx = this.screen.getContext('2d') ;    
  
  // Credits panel
  this.creditsPanel = document.createElement('div');
  this.creditsPanel.setAttribute('id', 'creditsPanel');
  this.creditsPanel.innerHTML = '<a href="credits.htm">Credits</a>';
    
  // Game objects
  this.planc = new Plancton(this.ctx, this.screen, this);
  this.food = new Array(); 
  this.food.push(new Food(this.ctx, this.screen, this));
    
  this.enemies = new Array();
  for(var i=0; i<GAME_STARTENEMIES; i++) { 
    this.enemies[i] = new Enemy(this.ctx, this.screen, this);
  }
  this.enemyCount = GAME_STARTENEMIES;
     
  // Audio initialization  
  
  this.audioFormat = '.ogg';
  this.audioType = 'audio/ogg';
  if( this.IE ) {
    this.audioFormat = '.mp3';
    this.audioType = 'audio/mpeg';
  } else if( this.browser.name === 'Safari' ) {
    this.audioFormat = '.aac';
    this.audioType = 'audio/aac';
  } else {
    this.audioFormat = '.ogg';
    this.audioType = 'audio/ogg';
  }
  
  this.sndEat = document.createElement('audio');
  this.sndEat.setAttribute('id', 'achan1');
  this.sndEat.setAttribute('preload', 'auto');
  
  this.chan1Src = document.createElement('source');   
  this.chan1Src.setAttribute('src', 'snd/eat'+this.audioFormat);
  this.chan1Src.setAttribute('type', this.audioType);
  this.sndEat.appendChild(this.chan1Src);
  
  this.sndOuch = document.createElement('audio');
  this.sndOuch.setAttribute('id', 'achan1');
  this.sndOuch.setAttribute('preload', 'auto');
  
  this.chan2Src = document.createElement('source');   
  this.chan2Src.setAttribute('src', 'snd/ouch'+this.audioFormat);
  this.chan2Src.setAttribute('type', this.audioType);
  this.sndOuch.appendChild(this.chan2Src);
    
  this.musicPlayer = document.createElement('audio');
  this.musicPlayer.setAttribute('id', 'audio');
  this.musicPlayer.setAttribute('preload', 'auto');
  //this.musicPlayer.setAttribute('loop', 'loop');
  
  this.playlist.track = this.playlist.index;
  this.playlist.tracks = [
    'GUITARREANDO_-_GEORGE_CARDOSO_Milonga__',
    'GUITARREANDO_-_PASTORALE_scarlatti',
    'Sur_les_remparts-Alpha_Hydrae',
    'Ton_-_soft',
    'Oursvince_-_Serenite'
    //'ShamAnimal-Apocalypse',
    //'ShamAnimal-Free_your_mind',
  ];
  this.playlist.index = Math.floor(Math.random()*this.playlist.tracks.length);
    
  this.audioSource = document.createElement('source');    
  this.audioSource.setAttribute('src', 'snd/'+self.playlist.tracks[self.playlist.index]+this.audioFormat);
  this.audioSource.setAttribute('type', this.audioType);
  this.musicPlayer.appendChild(this.audioSource); 
  
  // Play next track
  this.musicPlayer.addEventListener('ended', function() {
    self.playlist.index++
    if( self.playlist.index >= self.playlist.tracks.length) {
      self.playlist.index = 0;
    } 
    
    self.audioSource.src = 'snd/'+self.playlist.tracks[self.playlist.index]+this.audioFormat;
    self.musicPlayer.load();
  });
    
  // Display a message on the screen
  this.DrawMessage = function(text, size, x, y, style, fnt, shad) {
    font = (typeof fnt === 'undefined') ? 'Tahoma' : fnt;
    shadow = (typeof shad  !== 'undefined' && shad === true) ? true : false;
    self.ctx.beginPath();
    self.ctx.fillStyle = "#fff";            
    self.ctx.font = style + " " + size + " " + font;      
    self.ctx.textBaseline = 'bottom';
    self.ctx.fillText(text, x, y);
  }
    
  // Mouse functions
  this.FetchMouse = function(e) {
    if(self.IE) {
      self.mouseX = (event.clientX + document.body.scrollLeft) - self.main.offsetLeft;
      self.mouseY = (event.clientY + document.body.scrollTop) - self.main.offsetTop;
    } else { 
      self.mouseX = e.pageX - self.main.offsetLeft;
      self.mouseY = e.pageY - self.main.offsetTop;
    }      
  }

  this.MouseInScreen = function() {
    return ( (this.mouseX > 0 && this.mouseX < this.screen.width ) 
      && (this.mouseY > 0 && this.mouseY < thisscreen.height) ); 
  }
    
  if( !this.IE ) {
    document.captureEvents(Event.MOUSEMOVE);
  }
  document.onmousemove = this.FetchMouse;
    
  // Keyboard input
  document.onkeypress = function(e) {
    if( self.keydown === false ) {
      var ev = window.event || e;
      if( !self.IE ) {
        self.key = ev.charCode;
      } else {
        self.key = ev.keyCode;
      }
      console.log(self.key);
      self.keydown = true;      
    }
  }
  document.onkeyup = function() {
    self.key = null;
    self.keydown = false;
  }
    
  // Append all game nodes to main node
  this.main.appendChild(this.screen);
  this.main.appendChild(this.sndEat);
  this.main.appendChild(this.musicPlayer);
  this.main.appendChild(this.iconSpeaker);
  this.main.appendChild(this.creditsPanel);
    
  // Loading is done, we can now destroy the loading node 
  // and display all other game nodes        
  document.body.removeChild(this.loading);
  document.body.appendChild(this.main);  
  
  // Add food funcion
  this.addFood = function() {
    this.food.push(new Food(this.ctx, this.screen, this));
  }
  
  // Add enemy function
  this.AddEnemy = function() {
    if( self.enemyCount < GAME_MAXENEMIES ) {
      var en = new Enemy(this.ctx, this.screen, this);
      self.enemies.push(en);
      self.enemyCount = self.enemies.length;
    }
  }
    
  /**
     * Game loop function
     */
  this.Run = function() {
    // Clear screen
    self.ctx.clearRect(0,0, self.screen.width, self.screen.height);   
      
    // Draw version info
    var verInfo = '(c) 2012 Martin Albrecht - v' + GAME_VERSION;      
    self.DrawMessage(verInfo, '9px',(self.screen.width-165), 
                     self.screen.height, 'normal');
      
    // Start screen mode
    if( self.mode === GAMEMODE_INIT ) {
      if( self.keydown === true ) {
        if( self.key === KEYB_I ) {
          DialogInstructions();
        }
      }
    
      self.DrawMessage('E.A.T.', '40px', (self.screen.width/2)-60, 
                       (self.screen.height/2), 'bold', 'courier', true);
      self.DrawMessage('CLICK TO START', '20px', 
                       (self.screen.width/2)-80, (self.screen.height/2)+20, 
                       'bold', true);
      self.DrawMessage('or press i on your keyboard for instructions', '16px', 
                       (self.screen.width/2)-125, (self.screen.height/2)+80, 
                       'normal', true);
      self.screen.onclick = function() {
        self.mode = GAMEMODE_RUN;
      }
    } 
      
    // Run game mode
    else if( self.mode === GAMEMODE_RUN ) { 
      // Start music playback
      if( self.playback === true ) {
        if( self.browser.name !== 'Safari' ) self.musicPlayer.play();
      }
        
      // Check for game over
      if( self.fails <= 0 ) {
        self.mode = GAMEMODE_END;
      }
      
      //var inscreen = (MouseInScreen()) ? 'True' : 'False';
      var inscreen = 'True';
      for(var i=0; i<self.food.length; i++) {
        if( self.ticks === self.food[i].nextShow ) {
          self.food[i].SetNext(self.ticks, 100);
          if( self.food[i].show === false ) {
            self.food[i].SetRnd();
            self.food[i].show = true;
          }
        }
      }
        
      // Check for player collision with food      
      if( self.ticks > 10 ) {
        for(i=0; i<self.food.length; i++) {
          if( chkCollision(self.planc, self.food[i]) ) {
            if( self.food[i].type === FOOD_TYPE_GOOD) {
              if( self.browser.name !== 'Safari' && self.playback === true ) self.sndEat.play();
              self.planc.Grow();
              self.score += self.food[i].speed;

              if( self.stage < Math.floor(self.score/20) ) {
                self.stage++;
                self.addFood();
                if( self.stage >= 3 ) self.AddEnemy();
              }
            } else {
              if( self.browser.name !== 'Safari' && self.playback === true ) self.sndOuch.play();
              self.fails--;
              self.score -= self.food[i].speed;
            }
            
            self.food[i].SetNext(self.ticks, 70);
            self.food[i].SetRnd();
            self.food[i].show = false;
          }
        }
      }
        
      // Update enemies and check for collision with player
      for(i=0; i<self.enemyCount; i++) {
        self.enemies[i].Update(self.ticks);
        if( chkCollision(self.planc, self.enemies[i]) ) {
          //self.enemies[i].Die();
          if( self.browser.name !== 'Safari' && self.playback === true ) self.sndOuch.play();
          self.fails--;
          self.planc.SetRnd();
        }
      }
        
      // Handle key input
      if( self.keydown === true ) {
        if( self.key === KEYB_P ) {
          self.mode = GAMEMODE_PAUSE;
        }
          
        if( self.key === KEYB_M ) {
          self.playback = (self.playback === true) ? false : true;  
          if( self.playback === true ) {
            self.iconSpeaker.style.display = 'none';
          } else {
            self.iconSpeaker.style.display = 'block';
          }
          if( self.browser.name !== 'Safari' ) self.musicPlayer.pause();
        }
          
        if( self.key === KEYB_D ) {       
          self.debug = (self.debug === true) ? false : true;
        }
      }
        
      // Draw everything
      var msgScore = 'Stage ' + self.stage +
      ' - Score: ' + self.score +
      ' - Lives: ' + self.fails;
      self.DrawMessage(msgScore, '12px', 10, 20, 'bold');
        
      if( self.debug === true ) {
        var debugInfo = 'Ticks: ' + self.ticks + ' - mx: ' + self.mouseX + 
        ' - my: ' + self.mouseY + ' - Food count: ' + self.food.length +
        ' - Scale: ' + self.scale + ' - EnemyCount: ' + self.enemyCount;
        self.DrawMessage(debugInfo, '9px', 0, (self.screen.height), 'normal');
      }
        
      for(i=0; i<self.food.length; i++) {        
        if( self.food[i].show === true ) {
          self.food[i].Draw(self.ticks, self.stage);
        } 
      }
      self.planc.Update(inscreen, self.mouseX, self.mouseY);
      self.ticks++;
    }
      
    // Pause mode
    else if( self.mode === GAMEMODE_PAUSE ) {
      self.DrawMessage('PAUSED', '40px', (self.screen.width/2)-70, 
                       (self.screen.height/2), 'bold', 'courier');
      if( self.browser.name !== 'Safari' ) self.musicPlayer.pause();
      if( self.keydown === true ) {
        if( self.key === KEYB_P ) {
          self.mode = GAMEMODE_RUN;
        }
      }
    }
      
    // Game over
    else if( self.mode === GAMEMODE_END ) {
      self.DrawMessage('GAME OVER', '20px',
                       (self.screen.width/2)-60, 
                       (self.screen.height/2), 'bold');
      self.DrawMessage('Score: '+self.score+ ' points', '14px', 
                       (self.screen.width/2)-60, 
                       (self.screen.height/2)+20, 'bold');
      if( self.browser.name !== 'Safari' ) self.musicPlayer.pause();
      clearTimeout(self.gid);        
    }
  };
} 
 
/** 
  * Main function
  * Here, we create and initialize the game, so that it
  * somehow organizes itself.
  */
function main(debug) {  
  if( typeof debug === 'undefined' ) {
    debug = false;
  } else {
    debug = true;
  }
  var Game = new cGame(debug);
  if( Game !== false ) {
    var gid = setInterval(Game.Run, 1000/30);
    Game.gid = gid;
  }
}