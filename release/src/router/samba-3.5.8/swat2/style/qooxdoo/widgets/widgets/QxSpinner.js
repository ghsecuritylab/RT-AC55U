/* Copyright (c): 2002-2005 (Germany): United Internet, 1&1, GMX, Schlund+Partner, Alturo */
function QxSpinner(min,value,max){QxWidget.call(this);this.setWidth(60);this.setHeight(22);this.setBorder(QxBorder.presets.inset);this.setTabIndex(-1);this._manager=new QxRangeManager();this._textfield=new QxTextField();this._textfield.set({left:0,right:16,bottom:0,top:0,textAlign:"right",text:this._manager.getValue()});this.add(this._textfield);this._upbutton=new QxWidget();this._upbutton.set({top:0,bottom:"50%",width:16,right:0,border:QxBorder.presets.outset,canSelect:false});this._upbuttonimage = new QxImage("widgets/arrows/up_small.gif", 5, 3);this._upbuttonimage.set({top:1,left:3,anonymous:true});this._upbutton.add(this._upbuttonimage);this.add(this._upbutton);this._downbutton=new QxWidget();this._downbutton.set({top:"50%",bottom:0,width:16,right:0,border:QxBorder.presets.outset,canSelect:false});this._downbuttonimage = new QxImage("widgets/arrows/down_small.gif", 5, 3);this._downbuttonimage.set({top:1,left:3,anonymous:true});this._downbutton.add(this._downbuttonimage);this.add(this._downbutton);this._timer=new QxTimer(this.getInterval());this.addEventListener("keypress",this._g6,this);this.addEventListener("keydown",this._g4,this);this.addEventListener("keyup",this._g5,this);this.addEventListener("mousewheel",this._onmousewheel,this);this._textfield.addEventListener("input",this._oninput,this);this._textfield.addEventListener("blur",this._onblur,this);this._upbutton.addEventListener("mousedown",this._g1,this);this._downbutton.addEventListener("mousedown",this._g1,this);this._manager.addEventListener("change",this._onchange,this);this._timer.addEventListener("interval",this._i7,this);if(isValidNumber(min)){this.setMin(min);};if(isValidNumber(max)){this.setMax(max);};if(isValidNumber(value)){this.setValue(value);};};QxSpinner.extend(QxWidget,"QxSpinner");QxSpinner.addProperty({name:"incrementAmount",type:Number,defaultValue:1});QxSpinner.addProperty({name:"wheelIncrementAmount",type:Number,defaultValue:1});QxSpinner.addProperty({name:"pageIncrementAmount",type:Number,defaultValue:10});QxSpinner.addProperty({name:"interval",type:Number,defaultValue:100});QxSpinner.addProperty({name:"firstInterval",type:Number,defaultValue:500});QxSpinner.addProperty({name:"minTimer",type:Number,defaultValue:20});QxSpinner.addProperty({name:"timerDecrease",type:Number,defaultValue:2});QxSpinner.addProperty({name:"amountGrowth",type:Number,defaultValue:1.01});proto.getPreferredHeight=function(){return 22;};proto.getPreferredWidth=function(){return 60;};proto._g6=function(e){var vCode=e.getKeyCode();if(vCode==QxKeyEvent.keys.enter&&!e.getAltKey()){this._checkValue(true,false,false);this._textfield.selectAll();}else {switch(vCode){case QxKeyEvent.keys.up:case QxKeyEvent.keys.down:case QxKeyEvent.keys.left:case QxKeyEvent.keys.right:case QxKeyEvent.keys.shift:case QxKeyEvent.keys.ctrl:case QxKeyEvent.keys.alt:case QxKeyEvent.keys.esc:case QxKeyEvent.keys.del:case QxKeyEvent.keys.backspace:case QxKeyEvent.keys.insert:case QxKeyEvent.keys.home:case QxKeyEvent.keys.end:case QxKeyEvent.keys.pageup:case QxKeyEvent.keys.pagedown:case QxKeyEvent.keys.numlock:case QxKeyEvent.keys.tab:break;default:if(vCode>=48&&vCode<=57){return;};e.preventDefault();};};};proto._g4=function(e){var vCode=e.getKeyCode();if(this._intervalIncrease==null){switch(vCode){case QxKeyEvent.keys.up:case QxKeyEvent.keys.down:this._intervalIncrease=vCode==QxKeyEvent.keys.up;this._intervalMode="single";this._resetIncrements();this._checkValue(true,false,false);this._increment();this._timer.startWith(this.getFirstInterval());break;case QxKeyEvent.keys.pageup:case QxKeyEvent.keys.pagedown:this._intervalIncrease=vCode==QxKeyEvent.keys.pageup;this._intervalMode="page";this._resetIncrements();this._checkValue(true,false,false);this._pageIncrement();this._timer.startWith(this.getFirstInterval());break;};};};proto._g5=function(e){if(this._intervalIncrease!=null){switch(e.getKeyCode()){case QxKeyEvent.keys.up:case QxKeyEvent.keys.down:case QxKeyEvent.keys.pageup:case QxKeyEvent.keys.pagedown:this._timer.stop();this._intervalIncrease=null;this._intervalMode=null;};};};proto._g1=function(e){if(e.isNotLeftButton()){return;};this._checkValue(true);var vButton=e.getCurrentTarget();vButton.setBorder(QxBorder.presets.inset);vButton.addEventListener("mouseup",this._g2,this);vButton.addEventListener("mouseout",this._g2,this);this._intervalIncrease=vButton==this._upbutton;this._resetIncrements();this._increment();this._textfield.selectAll();this._timer.setInterval(this.getFirstInterval());this._timer.start();};proto._g2=function(e){var vButton=e.getCurrentTarget();vButton.setBorder(QxBorder.presets.outset);vButton.removeEventListener("mouseup",this._g2,this);vButton.removeEventListener("mouseout",this._g2,this);this._textfield.selectAll();this._textfield.setFocused(true);this._timer.stop();this._intervalIncrease=null;};proto._onmousewheel=function(e){this._manager.setValue(this._manager.getValue()+this.getWheelIncrementAmount()*e.getWheelDelta());this._textfield.selectAll();};proto._oninput=function(e){this._checkValue(true,true);};proto._onchange=function(e){var vValue=this._manager.getValue();this._textfield.setText(vValue);if(vValue==this.getMin()){this._downbutton.setBorder(QxBorder.presets.outset);this._downbutton.setEnabled(false);this._downbuttonimage.setEnabled(false);this._timer.stop();}else {this._downbutton.setEnabled(true);this._downbuttonimage.setEnabled(true);};if(vValue==this.getMax()){this._upbutton.setBorder(QxBorder.presets.outset);this._upbutton.setEnabled(false);this._upbuttonimage.setEnabled(false);this._timer.stop();}else {this._upbutton.setEnabled(true);this._upbuttonimage.setEnabled(true);};if(this.hasEventListeners("change")){this.dispatchEvent(new QxEvent("change"));};};proto._onblur=function(e){this._checkValue(false);};proto.setValue=function(nValue){this._manager.setValue(nValue);};proto.getValue=function(){this._checkValue(true);return this._manager.getValue();};proto.resetValue=function(){return this._manager.resetValue();};proto.setMax=function(vMax){return this._manager.setMax(vMax);};proto.getMax=function(){return this._manager.getMax();};proto.setMin=function(vMin){return this._manager.setMin(vMin);};proto.getMin=function(){return this._manager.getMin();};proto._intervalIncrease=null;proto._i7=function(e){this._timer.stop();this.setInterval(Math.max(this.getMinTimer(),this.getInterval()-this.getTimerDecrease()));if(this._intervalMode=="page"){this._pageIncrement();}else {if(this.getInterval()==this.getMinTimer()){this.setIncrementAmount(this.getAmountGrowth()*this.getIncrementAmount());};this._increment();};switch(this._intervalIncrease){case true:if(this.getValue()==this.getMax()){return;};case false:if(this.getValue()==this.getMin()){return;};};this._timer.restartWith(this.getInterval());};proto._checkValue=function(acceptEmpty,acceptEdit){var el=this._textfield.getElement();if(!el){return;};if(el.value==""){if(!acceptEmpty){el.value=this.resetValue();this._textfield.selectAll();return;};}else {var val=el.value;if(val.length>1){while(val.charAt(0)=="0"){val=val.substr(1,val.length);};var f1=parseInt(val)||0;if(f1!=el.value){el.value=f1;return;};};if(val=="-"&&acceptEmpty&&this.getMin()<0){if(el.value!=val){el.value=val;};return;};val=parseInt(val);var doFix=true;var fixedVal=this._manager._checkValue(val);if(isNaN(fixedVal)){fixedVal=this._manager.getValue();};if(acceptEmpty&&val==""){doFix=false;}else if(!isNaN(val)){if(acceptEdit){if(val>fixedVal&&!(val>0&&fixedVal<=0)&&String(val).length<String(fixedVal).length){doFix=false;}else if(val<fixedVal&&!(val<0&&fixedVal>=0)&&String(val).length<String(fixedVal).length){doFix=false;};};};if(doFix&&el.value!=fixedVal){el.value=fixedVal;};if(!acceptEdit){this._manager.setValue(fixedVal);};};};proto._increment=function(){this._manager.setValue(this._manager.getValue()+((this._intervalIncrease?1:-1)*this.getIncrementAmount()));};proto._pageIncrement=function(){this._manager.setValue(this._manager.getValue()+((this._intervalIncrease?1:-1)*this.getPageIncrementAmount()));};proto._resetIncrements=function(){this.resetIncrementAmount();this.resetInterval();};proto.dispose=function(){if(this.getDisposed()){return;};this.removeEventListener("keypress",this._g6,this);this.removeEventListener("keydown",this._g4,this);this.removeEventListener("keyup",this._g5,this);if(this._textfield){this._textfield.removeEventListener("blur",this._onblur,this);this._textfield.dispose();this._textfield=null;};if(this._upbutton){this._upbutton.removeEventListener("mousedown",this._g1,this);this._upbutton.dispose();this._upbutton=null;};if(this._downbutton){this._downbutton.removeEventListener("mousedown",this._g1,this);this._downbutton.dispose();this._downbutton=null;};if(this._timer){this._timer.removeEventListener("interval",this._i7,this);this._timer.stop();this._timer.dispose();this._timer=null;};if(this._manager){this._manager.removeEventListener("change",this._onchange,this);this._manager.dispose();this._manager=null;};return QxWidget.prototype.dispose.call(this);};