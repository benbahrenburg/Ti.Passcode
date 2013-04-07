<h1>Ti.Passcode</h1>

Cross-platform implementation of the iOS passcode screen for Titanium Mobile.


<h2>How to install</h2>

Installing Ti.Queue is straightforward, simply copy the ti.passcode.js file into your Titanium project.

Since Ti.Passcode is a CommonJS module, can you import the module anywhere in your app by simply using the require method.

For example:
```javascript
var mod = require('Ti.Passcode');
```

<h2>Sample</h2>

First requre the module into our project

```javascript
var mod = require('Ti.Passcode');
```

Next create some configuration options

```javascript
	var options = {
			window:{
				backgroundColor:'#ccc',
				navBarHidden:true
			},
			view:{
				title:'Enter application passcode',
				errorColor:'yellow'
			}
		};		
```

Then build our callback method

```javascript
	function onCompleted(d){					
		if(d.success){
			var msg = Ti.UI.createAlertDialog({
				title:'Information',
				message:'Passcode entered is correct'
			});				
			msg.addEventListener('click',function(t){
				codeWindow.close();		
			});
			msg.show();				
		}else{
			var msg = Ti.UI.createAlertDialog({
				title:'Information',
				message:'Invalid passcode, please try again'
			}).show();
		}			
	};
```

Next create a new instance of the module

```javascript
var passcode = new my.mod();
```

Finally, open the Passcode window

```javascript
var codeWindow = passcode.createWindow(txtPasscode.value,onCompleted,options);
codeWindow.open({modal:true});
```

<h2>Example app.js</h2>
Please download the demo project's [app.js](https://github.com/benbahrenburg/Ti.Queue/blob/master/app.js) for a complete sample.

<h2>Credits</h2>

 This module contains code forked from the following projects:
 
 Pedro Enrique ‏ [@pecdev](http://twitter.com/pecdev)
 [https://gist.github.com/pec1985/1819804](https://gist.github.com/pec1985/1819804)

 Terry Martin [@tzmartin](http://twitter.com/tzmartin)
 [https://github.com/tzmartin/TiUIExamples](https://github.com/tzmartin/TiUIExamples)

<h2>Licensing & Support</h2>

This project is licensed under the OSI approved Apache Public License (version 2). For details please see the license associated with each project.

Developed by [Ben Bahrenburg](http://bahrenburgs.com) available on twitter [@benCoding](http://twitter.com/benCoding)

<h2>Learn More</h2>

<h3>Twitter</h3>

Please consider following the [@benCoding Twitter](http://www.twitter.com/benCoding) for updates 
and more about Titanium.

<h3>Blog</h3>

For module updates, Titanium tutorials and more please check out my blog at [benCoding.Com](http://benCoding.com). 
