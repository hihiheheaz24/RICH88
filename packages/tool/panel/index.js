
var fs = require('fs');
function mkdirSync (path) {
  try {
      fs.mkdirSync(path);
  } catch(e) {
      if ( e.code != 'EEXIST' ) throw e;
  }
}
// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({
  // css style for panel
  style: `
    :host { margin: 5px; }
    h2 { color: #f90; }
  `,

  // html template for panel
  template: `
    <h2>tool tao bundle va gen project</h2>
    
    <ui-button id="btn">Lưu dữ liệu</ui-button>
    <div>(đường dẫn full)<span id="label1"></span></div>
     <div class="middle layout vertical">
       <ui-text-area id = "edbFull" resize-v value="https://bundlev2.xalnxxadhsakkduixxx.com/Full/F07-08/"></ui-text-area>
     </div>
     <div>(đường dẫn zip)<span id="label2"></span></div>
     <div class="middle layout vertical">
     <ui-text-area id = "edbZip" resize-v value="https://bundlev2.xalnxxadhsakkduixxx.com/Zip/Z07-08/"></ui-text-area>
   </div>
   <div>(đường dẫn buldGame)<span id="label3"></span></div>
   <div class="middle layout vertical">
     <ui-text-area id = "edbChildGame" resize-v value="https://bundlev2.xalnxxadhsakkduixxx.com/ChildGame07-08"></ui-text-area>
   </div>
   <div>(version Toàn Project)<span id="label4"></span></div>
   <div class="middle layout vertical">
     <ui-text-area id = "edbVerProejctGame" resize-v value="5.0.6"></ui-text-area>
   </div>
   <div>(version Bundle)<span id="label5"></span></div>
   <div class="middle layout vertical">
     <ui-text-area id = "edbVerChildGame" resize-v value='{"4":"2.0.8","5":"2.0.8","6":"2.0.8","8":"2.0.8","9":"2.0.8","12":"2.0.8","13":"2.0.8","15":"2.0.8","16":"2.0.8","17":"2.0.8","18":"2.0.8","19":"2.0.8","21":"2.0.8","20":"2.0.8","25":"2.0.8"}'></ui-text-area>
   </div>
   <div>Trạng Thái: <span id="labelState">--</span></div>
  `,

  // element and variable binding
  $: {
    btn: '#btn',
    txtFull: '#edbFull',
    txtZip: '#edbZip',
    
    txtBundle: '#edbChildGame',
    txtVerProject: '#edbVerProejctGame',
    txtVerChildGame: '#edbVerChildGame',
    lbLabel :'#labelState'
  },
  
  // method executed when template and styles are successfully loaded and initialized
  ready () {
    //fs.
    let strFile = process.cwd() +"/infoBuild.txt";
    strFile = strFile.replace(/\\/g, '/');

    strFile = Editor.url('packages://tool/panel/infoBuild.txt', 'utf8')
    Editor.log("link la " + strFile);
    var objCache = {};

    var stat = fs.existsSync(strFile);
    var strTemp = "";
    if(stat){
     strTemp = fs.readFileSync(strFile);
    }
    

    if(strTemp!= null && strTemp!= "") {
      objCache = JSON.parse(strTemp);
    } 
    this.$txtFull.value = objCache.urlFull || "https://bundlev2.xalnxxadhsakkduixxx.com/Full/F07-08/";
    this.$txtZip.value = objCache.urlZip || "https://bundlev2.xalnxxadhsakkduixxx.com/Zip/Z07-08/";
    this.$txtBundle.value = objCache.urlBundle || "https://bundlev2.xalnxxadhsakkduixxx.com/ChildGame07-08";
    this.$txtVerProject.value = objCache.verProejct || "1.0.0";
    this.$txtVerChildGame.value =JSON.stringify(objCache.verChildGame ) || `{"4":"2.0.8","5":"2.0.8","6":"2.0.8","8":"2.0.8","9":"2.0.8","12":"2.0.8","13":"2.0.8","15":"2.0.8","16":"2.0.8","17":"2.0.8","18":"2.0.8","19":"2.0.8","21":"2.0.8","20":"2.0.8","25":"2.0.8"}`;
    this.$btn.addEventListener('confirm', () => {
      let obj = {};
      obj.urlFull = this.$txtFull.value;
      obj.urlZip = this.$txtZip.value;
      obj.urlBundle = this.$txtBundle.value;
      obj.verProejct = this.$txtVerProject.value;
      obj.verBundle = this.$txtVerChildGame.value;
      var str = JSON.stringify(obj);
      Editor.Ipc.sendToMain('tool:clicked' , str);
    });
  },

  // register your ipc messages here
  messages: {
    'tool:hello' (event) {
     // this.$input.defaultValue  = "url download ne";
      // Editor.Ipc.sendToMain('tool:dialog' , "nhan dc thong bao chua");
       
    },

    'tool:onLoad' (event ){
      Editor.Ipc.sendToMain('tool:dialog' , "nhan dc thong bao chua1");
    },

    'tool:luuThanhCong'(){
      this.$lbLabel.innerText = "Lưu dữ liệu thành công"
    }
  }
});