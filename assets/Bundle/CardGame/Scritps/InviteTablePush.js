// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    // foo: {
    //     // ATTRIBUTES:
    //     default: null,        // The default value will be used only when the component attaching
    //                           // to a node for the first time
    //     type: cc.SpriteFrame, // optional, default is typeof default
    //     serializable: true,   // optional, default is true
    // },
    // bar: {
    //     get () {
    //         return this._bar;
    //     },
    //     set (value) {
    //         this._bar = value;
    //     }
    // },
    lbName: cc.Label,
    // lbGoldUser:cc.Label,
    avatar: cc.Sprite,
    lbBlind: cc.Label,
    lbIdTalbe: cc.Label,
    lbTime: cc.Label,
    lbNameGame: cc.Label,
    toggle: cc.Toggle,
    lbAg: cc.Label,
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    Global.InviteTablePush = this;
  },
  onDestroy() {
    Global.InviteTablePush = null;
  },
  show(info) {
    this.data = info;
    cc.log("=============> info user invite : ", info);
    Global.onPopOn(this.node);
    //this.lbGoldUser.string = Global.formatNumber(info[15]);
    Global.GetAvataById(this.avatar, info[13]);
    this.lbName.string = info[14];
    this.lbBlind.string = Global.formatNumber(info[32]);
    this.lbIdTalbe.string = info[17];
    this.lbAg.string = info[15];
    this.lbNameGame.string = Global.getNameGameCardByType(info[18]);
    this.startCountDown();
    this.toggle.uncheck();
    // let rd = Global.RandomNumber(1 , 6);
    // let str = "MOICHOI" + rd;
    // this.lbChat.string = MyLocalization.GetText(str);
    // let nodeChat = this.lbChat.node.parent;
    // cc.Tween.stopAllByTarget(nodeChat);
    // nodeChat.scale = 0;
    // actionEffectOpen(this.node ,()=>{
    //     cc.tween(nodeChat)
    //     .to(0.2 , {scale:1} , {easing:"backOut"})
    //     .start();
    // });
  },
  startCountDown() {
    this.unschedule(this.funCd);
    this.time = 10;
    let str = "(%ns)";
    this.lbTime.string = str.replace("%n", this.time);
    this.schedule(
      (this.funCd = () => {
        this.time--;
        this.lbTime.string = str.replace("%n", this.time);
        if (this.time < 1) this.onHide();
      }),
      1
    );
  },
  onToggleKoMoi(event, data) {
    Global.UIManager.notShowInviteTalbe(event.isChecked);
  },
  onHide() {
    this.unschedule(this.funCd);
    Global.onPopOff(this.node);
  },
  onClickXacNhan() {
    MainPlayerInfo.CurrentGameCode = this.data[AuthenticateParameterCode.GameId];
    MainPlayerInfo.CurrentTableId = this.data[AuthenticateParameterCode.TableId];
    MainPlayerInfo.CurrentBlind = this.data[AuthenticateParameterCode.Blind];
    MainPlayerInfo.isReconnect = true;
    if (!cc.sys.isNative || cc.sys.os == cc.sys.OS_WINDOWS) {
      if (Global.InGameCard) {
        Global.InGameCard.start();
      }
    } else {
      if (Global.UIManager.onClickOpenBigGame(Global.getGameTypeByName(MainPlayerInfo.CurrentGameCode), true)) {
      } else {
        if (Global.InGameCard) {
          Global.InGameCard.start();
        }
      }
    }
    this.onHide();
  },

  // start () {

  // },

  // update (dt) {},
});
