/**
 * E.A.T. - Dialogs
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



/**
 * Show the instructions dialog
 */
function DialogInstructions() {
  var dlg = document.createElement('div');
  var main = document.getElementById('main');
  dlg.setAttribute('class', 'dialog');
  dlg.setAttribute('id', 'dlgInstrcut');
  
  dlg.innerHTML = '<h1>Instructions</h1><br/>' + 
                  '<Strong>Basics:</strong><br/>' +
                  'The goal of the game is to eat as much food as you can. Food is symbolized by the yellow objects falling' +
                  'down the screen. Red food or the fishes are to avoid as they will get you killed. Also, if the food reaches the'+
                  ' bottom of the screen, you\'ll lose one live!<br/>' +
                  'When you reached a score of 20, you made the first stage. From there on every twenty points will get you to the next stage' +
                  'and the higher you get, the more food and enemies will appear.<br/><br/>'+
                  '<Strong>Game controls:</strong><br/>' +
                  'Move the player with dragging the mouse. The player will always follow your mouse cursor.<br/><br/>' +
                  '<strong>Special keys:</strong><ul>' + 
                  '<li>P: Pause the game</li>' + 
                  '<li>M: Mute the music</li></ul>' +
                  'If you die, reload the page by pressing F5 on your keyboard or the reload button of your browser.<br/>'+
                  '<br/><br/<br/><center><strong style="color: red">To close this dialog, simply click with your mouse on the white area!</strong></center>';
  
  dlg.onclick = function() {
    main.removeChild(dlg);
  }
  main.appendChild(dlg);
}