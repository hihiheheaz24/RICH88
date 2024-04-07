

cc.Class({
    extends: cc.Component,

    properties: {
      content:cc.RichText,
      btnNo : cc.Node
    },

    onClickButtonYes(){
      this.Hide();
      if(this.yesEvent != null)
        this.yesEvent();
      this.ClearEvent();
	  },

    onClickButtonNo(){
      this.Hide();
      if(this.noEvent != null)
        this.noEvent();
      this.ClearEvent();
    },

    ClearEvent() {
      this.noEvent = null;
      this.yesEvent = null;
    },
    
    Hide() {
      Global.onPopOff(this.node);
    },

    show(message, yesEvent, noEvent){
      Global.onPopOn(this.node);
      this.content.string = message;
      this.yesEvent = yesEvent;

     
      if(!noEvent){
        this.noEvent = ()=>{
          Global.onPopOff(this.node);
        };
      }
      else{
        this.noEvent = noEvent;
      }
	  },

    onDestroy(){
      Global.ConfirmPopup = null;
    },
});
