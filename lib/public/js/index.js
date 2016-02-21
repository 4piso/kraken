
// Dependencies =================================
window.$ = window.jQuery = require( 'jquery');
require('bootstrap');
var Nes = require('nes');
var client = new Nes.Client('ws://295de5fe.ngrok.io');


$(document).ready(function(){

  "use strict";
  // Vars
    var paint = false,
        points = [],
        click_x = [],
        click_y = [],
        click_drag = [],
        $canvas = $('#canvas'),
        ctxt = $canvas[0].getContext('2d'),
        touch_mouse = {
          up: 'mouseup',
          down: 'mousedown',
          leave: 'mouseleave',
          move: 'mousemove'
        },
        colors = {
          "green": "#2ecc71",
          "brown": "#795548",
          "blue": "#3498db",
          "purple": "#8e44ad",
          "red": "#e74c3c",
          "orange": "#f39c12",
          "yellow": "#f1c40f",
          "dark_blue": "#34495e",
          "gray": "#7f8c8d",
          "light_gray": "#ecf0f1"
        },
        stroke_color = colors[Object.keys(colors)[Math.floor(Math.random() * 9) + 1 ]];

  // Mobile
    if ('ontouchstart' in window) {
      touch_mouse = {
          up: 'touchend',
          down: 'touchstart',
          leave: 'touchleave',
          move: 'touchmove'
        };
    }
  
  // Helpers 
    var mousedown = function(e) {
      var mouse_x = e.pageX - this.offsetLeft,
          mouse_y = e.pageY - this.offsetTop;

      paint = true;
      add_click(mouse_x, mouse_y);
      // redraw();
    };
    var mousemove = function(e) {
      if (paint) {
        var mouse_x = e.pageX - this.offsetLeft,
            mouse_y = e.pageY - this.offsetTop;
        add_click(mouse_x, mouse_y, true);
        // redraw();
      }
    };
    var mouseleave = function(e) {
      paint = false;
    };
    var add_click = function(x,y,dragging) {
      var tmp = {
        x: x,
        y: y,
        drag: (dragging)? true: false,
        color: stroke_color
      };
      points.push(tmp);
      client.message( points );
    };
    var redraw = function ( data ) {
      clear_canvas();
      var points_len = 0;
      var _points = [];

      ctxt.lineJoin = "round";
      ctxt.lineWidth = 5;

      for ( var socket in data ) {
        _points = data[ socket ];
        points_len = _points.length;

        for( var i = 0; i < points_len; i++) {
          var cur_point = _points[i],
              prev_point = _points[i-1];

          ctxt.strokeStyle = cur_point.color;
          ctxt.beginPath();
          if (cur_point.drag) {
            ctxt.moveTo(prev_point.x, prev_point.y);
          } else {
            ctxt.moveTo(cur_point.x - 1, cur_point.y);
          }
          ctxt.lineTo(cur_point.x, cur_point.y);
          ctxt.closePath();
          ctxt.stroke();
        }
      }
    };
    var clear_canvas = function(clear_all) {
      ctxt.clearRect(0, 0, ctxt.canvas.width, ctxt.canvas.height); // Clears the canvas
      if (clear_all) {
        points = [];
      }
    };
  
  // Events
    $canvas
      //.attr('width',$canvas.parent().outerWidth())
      .on(touch_mouse.down, mousedown)
      .on(touch_mouse.move, mousemove)
      .on(touch_mouse.up, mouseleave)
      .on(touch_mouse.leave, mouseleave); 

  // NES
    client.connect(function (err) {
      console.log(client);
        var handler = function ( update ) {
          // redraw( update.data );
        };

        client.subscribe('/paint', handler, function (err) {
            console.log('Subscribe');
            console.log(arguments);
        });

        client.onUpdate = function ( data ) {
            console.log('Update');
            console.log(arguments);
        };
        client.onError = function() {
            console.log('Error');
            console.log(arguments);
        };
        client.onConnect = function() {
            console.log('Connect');
            console.log(arguments);
        };
    });

});










// $('.send-btn' ).on('click', function(event) {

//  event.preventDefault();
//  var $txt = $txtTpl.clone();
//  var msg = $msgInput.val();

//  addMsg( 'ME', msg );
//  client.message( msg );
//  $msgInput.val( '' );
//  $msgs.append( $txt );
// });

// function addMsg ( user, msg ) {

//  var $txt = $txtTpl.clone();

//  $txt
//  .find( 'strong' )
//  .text( user+': ' )
//  .siblings( 'span' )
//  .text( msg );

//  if ( user === 'SERVER' ) $txt.addClass( 'text-muted' );

//  $msgs.append( $txt );
// }

// $(document ).ready(function() {
//  $('#login-modal' ).modal({ show: true });
// });

// $('.send-name' ).on('click', function(event) {

//  client.connect( { auth: { headers: { authorization: 'Custom ' + $('#recipient-name' ).val() } } }, function (err) {
//      if ( err ) console.error(err);
//  });
//  $('#login-modal' ).modal('hide');
// });

// @main
// Luis Matute
// Feb-15
/*
'use strict';

// Common Dependencies ==========================
    require( 'angular' );
    require( 'angular-animate' );
    require( 'angular-ui-router' );


// Create and Bootstrap Angular App =============
    angular.element( document ).ready( function(){
        var requires = [ 'ngAnimate','ui.router' ];
        window._chat = angular.module( '_chat', requires );

        // App Configurations ---------
        angular.module( '_chat' ).constant( 'Config', require( './config' ) );

        // Factories Init -------------
        require( './factories/_index.js' );

        // Controllers Init -----------
        require( './controllers/_index.js' );

        // Directives Init ------------
        // require( './directives/_index.js' );

        // Directives Init ------------
        // require( './filters/_index.js' );

        // Routes ---------------------
        angular.module( '_chat' ).config( require( './routes') );

        // App Init -------------------
        angular.module( '_chat' ).run( require( './on_run') );

        // Bootstraping App to Doc ----
        angular.bootstrap( document, [ '_chat' ] );
    });
*/