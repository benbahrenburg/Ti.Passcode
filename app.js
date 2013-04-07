
/*jslint maxerr:1000 */
var my = {
	mod : require('Ti.Passcode')
};

(function () {
	    
    var win = Ti.UI.createWindow({
        backgroundColor: '#fff', title: 'Passcode Example', 
        barColor:'#000',layout:'vertical',fullscreen:false, exitOnClose:true
    });
      
	win.add(Ti.UI.createLabel({
		top:10, height:65, left:5, right:5,color:'#000',
		textAlign:'left',text:'Demonstration on how to use Ti.Passcode to create a passcode verification screen.', 
		font:{fontSize:14}
	}));

	win.add(Ti.UI.createLabel({
		top:10, height:25, left:5, right:5,color:'#000',
		textAlign:'left',text:'Enter Passcode', 
		font:{fontSize:14}
	}));
	
	var txtPasscode = Ti.UI.createTextField({
		value:'1234',hintText:'Enter Passcode',
		height:45, left:5, right:5,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED	
	});	
	win.add(txtPasscode);
			
	var btnRunPasscode = Ti.UI.createButton({
		title:'Open Passcode Screen', top:25, height:45, left:5, right:5	
	});
	win.add(btnRunPasscode);
	
	btnRunPasscode.addEventListener('click',function(x){
		var codeWindow  = null, 
			options = {
			window:{
				backgroundColor:'#ccc',
				navBarHidden:true
			},
			view:{
				title:'Enter application passcode',
				errorColor:'yellow'
			}
		};		
		
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
		
		var passcode = new my.mod();

		var codeWindow = passcode.createWindow(txtPasscode.value,onCompleted,options);
		codeWindow.open({modal:true});
	});
	
    win.open();
        
})();    
