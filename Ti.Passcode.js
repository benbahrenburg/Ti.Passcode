/*jslint maxerr:1000 */

/**
 * Ti.Password is a cross-platform unlock screen for Titanium module
 * Author : Benjamin Bahrenburg
 * License : Apache 2
 * 
 * This module contains code forked from:
 * 
 * Pedro Enrique ‏ @pecdev
 * https://gist.github.com/pec1985/1819804
 * 
 * and
 * 
 * Terry Martin @tzmartin
 * https://github.com/tzmartin/TiUIExamples
 * 
 */
var _isAndroid = Ti.Platform.osname === 'android';

var VIEW_DEFAULTS = {
	boxSize:50, boxFontSize:32,
	errorColor:'red',
	title :'Enter Passcode To Unlock',
	backgroundColor:'transparent',
	comment :{
		text:'We take your security seriously, please enter your passcode to continue.',
		height:60, width:Ti.UI.FILL,textAlign:'center',color:'#000'
	},
	boxViewArgs : {top:5,height:60}
};

var WINDOW_DEFAULTS = {
	backgroundColor:'#fff',
	title :'Enter Password'
};

//Extend an object with the properties from another 
//(thanks Dojo - http://docs.dojocampus.org/dojo/mixin)
function mixin(/*Object*/ target, /*Object*/ source){
	var name, s, i,empty = {};
	for(name in source){
		s = source[name];
		if(!(name in target) || (target[name] !== s && (!(name in empty) || empty[name] !== s))){
			target[name] = s;
		}
	}
	return target; // Object
};


function passcodeView(code,callback,params){	
	// @PARAMS:{
	// 		boxSize: 			(Number) size of the passcode character boxes
	//		backgroundColor:	(String) background color for passcodeView
	// 		errorColor: 		(String) background color of the view when panic() is called - when wrong password
	// 		title: 				(String) the text of the title view, above the pass code boxes by default,
	//		boxViewArgs:		(Dict) parameters for the box view
	// }

	if(_isAndroid){
		VIEW_DEFAULTS.boxFontSize = 24;
	}
	var options = mixin(VIEW_DEFAULTS,params), stateLength = 0;
	
	var container = Ti.UI.createView({
		top:0,bottom:0,right:0,left:0, backgroundColor:options.backgroundColor, layout:'vertical'
	});
		
	var hiddenTextField = Ti.UI.createTextField({
		visible:false, keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD,focusable: true,
		height:0, width:0
	});

	if(_isAndroid){
		hiddenTextField.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
	}
	var box = {
		create : function(top,left){
			return Titanium.UI.createTextField({
				top:top, left:left,
				width:options.boxSize, height:options.boxSize,
				color:'#336699', backgroundColor:'#FFF',
				borderColor:'#999',
				returnKeyType:Ti.UI.RETURNKEY_DONE,
				enableReturnKey:true,
				keyboardType:Ti.UI.KEYBOARD_NUMBER_PAD,
				autocorrect:false, enabled:false,
				textAlign:'center', value:'', touchEnabled:false,
				font:{fontWeigh:'bold',fontSize:options.boxFontSize}, clearOnEdit:true,
				borderStyle:Ti.UI.INPUT_BORDERSTYLE_NONE,
				clearButtonMode:Ti.UI.INPUT_BUTTONMODE_NEVER			
			});				
		},		
		update : function(inputObject, value){
			inputObject.value = value; 
			setTimeout(function()
			{
				inputObject.value ='*';
			},350);			
		}
	};
	
	var boxContainer = Ti.UI.createView(options.boxViewArgs);
	var titleView = Ti.UI.createLabel({
		top:0, left:0, right:0,
		height:60, text:options.title,color:'#000',
		textAlign:'center', font:{fontSize:20,fontWeight:'bold'}
	});
	
	var viewWidth = container.size.width || Ti.Platform.displayCaps.platformWidth;
	var leftMargin = (viewWidth - (options.boxSize * 4))/5
	var left = 0;
	var top = Math.round((boxContainer.height - options.boxSize) / 2);
	
	
	var field1 = box.create(top,left += leftMargin);
	var field2 = box.create(top,left += leftMargin + options.boxSize);
	var field3 = box.create(top,left += leftMargin + options.boxSize);
	var field4 = box.create(top,left += leftMargin + options.boxSize);
	
	container.add(hiddenTextField);
	container.add(titleView);
	boxContainer.add(field1);
	boxContainer.add(field2);
	boxContainer.add(field3);
	boxContainer.add(field4);
	container.add(boxContainer);

	var commentLabel = Ti.UI.createLabel(options.comment);
	container.add(commentLabel);

	var reset = {
		all : function(){
			field1.value = '';
			field2.value = '';
			field3.value = '';
			field4.value = '';	
			stateLength = 0;			
			hiddenTextField.value = '';			
		},
		byIndex : function(index){
			if(index === 0){
				reset.all();
				return;
			}
			if(index < 1){
				field1.value = '';				
			}
			if(index < 2){
				field2.value = '';
			}			
			if(index < 3){
				field3.value = '';
			}	
			if(index < 4){
				field4.value = '';
			}						
		}
	};
			
	var confirm = {
		check : function(value){
			var codeToCheck = code + ''; //Force string
			var valueToCheck = hiddenTextField.value + '';
			if(codeToCheck ===valueToCheck){
				confirm.fireCallback(true,codeToCheck,valueToCheck);
			}else{
				confirm.error();
				confirm.fireCallback(false,codeToCheck,valueToCheck);	
			}
		},
		fireCallback : function(successful,codeEntered,passcode){
			if((callback!=undefined) && (callback!=null)){
				callback({success:successful, passcode:passcode, codeEntered:codeEntered});
			}
		},
		error : function(){
			boxContainer.backgroundColor = options.errorColor;
			var duration = ((_isAndroid) ? 1500 : 2000);
			var hideError = Ti.UI.createAnimation({
				backgroundColor:options.backgroundColor,
				duration : duration
			});
			var annimatedPresented = function(){
				reset.all();
				hideError.removeEventListener('complete',annimatedPresented);
				if(_isAndroid){
					boxContainer.backgroundColor = options.backgroundColor;
				}
			};
			hideError.addEventListener('complete',annimatedPresented);
			boxContainer.animate(hideError);	
		}
	};
	hiddenTextField.addEventListener('change', function(e){
		var value = e.value;
		var len = value.length;
		
		if(stateLength > len){
			reset.byIndex(len);	
		}
						
		if((len===1) && (stateLength < 1)){
			box.update(field1,value.substring(0,1));
		}
		
		if((len===2) && (stateLength < 2)){
			box.update(field2,value.substring(1,2));		
		}
		
		if((len===3) && (stateLength < 3)){
			box.update(field3,value.substring(2,3));		
		}
		
		if((len > 3) && (stateLength < 4)){
			field4.value = '*';
		}

		stateLength = len;
		if(stateLength === 4){
			confirm.check();
		}
	});
	
	container.closeKeyboard = function(){
		hiddenTextField.blur();
		hiddenTextField.hide();
	};
	container.focus = function(){
		if(_isAndroid){
			hiddenTextField.keyboardType = Ti.UI.KEYBOARD_NUMBER_PAD;
			hiddenTextField.show();
		}
		hiddenTextField.focus();
	};

	return container;
};


var pinObjectWrappers = function(){
	
	this.createWindow = function(code,callback,params){
		var winOptions = params.window || {};
		var viewOptions = params.view || {};
		winOptions = mixin(WINDOW_DEFAULTS,winOptions);
		viewOptions = mixin(VIEW_DEFAULTS,viewOptions);

		var win = Ti.UI.createWindow(winOptions);
		var pinView = this.createView(code,callback,viewOptions);
		win.add(pinView);
	
		if(_isAndroid){
		    win.addEventListener('android:back', function(e){
		        Ti.API.debug('Do not allow back button');
		    }); 
		
			win.addEventListener('open', function(){			
				 setTimeout(function(e){
				       pinView.focus();
				    },1000) ;			
			});

			win.addEventListener('close', function(){			
				pinView.closeKeyboard()
			});
			
			win.addEventListener('click', function(){
				pinView.focus();
			});		
		
		}else{
			win.addEventListener('open', function(){
				pinView.focus();
				win.addEventListener('focus', function(){
					pinView.focus();
				});					
			});								
		}

						
		return win;				
	};
	
	this.createView = function(code,callback,params){
		var options = params || {};
		options = mixin(VIEW_DEFAULTS,options);		
		var view = passcodeView(code,callback,options);		
		return view;				
	};
};

module.exports = pinObjectWrappers;