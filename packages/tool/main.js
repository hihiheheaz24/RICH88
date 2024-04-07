'use strict';
var path = require('path');
var fs = require('fs');
var rimraf = require("rimraf");
var crypto = require('crypto');
const zipFolder = require('zip-a-folder');
const extract = require('extract-zip')
var listLoc = [];
var dest = '';
var src = '';


var _src = "";
var _srcProject = "";
var totalFile = 0;
var currentFile = 0;
var mangUrl = [];
var urlSave = "";
var urlProject = '';
var URLs_SubPack = [];
var proManUid = "";

var currentPlatForm = "";

var currentFileSub = 0;
var totalFileSub = 0;

var optionsCache = null;

var version = {
  4: "1.0.1",
  5: "1.0.1",
  6: "1.0.1",
  8: "1.0.1",
  9: "1.0.1",
  12: "1.0.1",
  13: "1.0.1",
  15: "1.0.1",
  16: "1.0.1",
  17: "1.0.1",
  18: "1.0.1",
  19: "1.0.1",
  21: "1.0.1",
  20: "1.0.1",
  25: "1.0.1",
};
// https://storage.googleapis.com/bet888-android/v1
// https://storage.googleapis.com/bet888-ios/v1

var url = "http://192.168.1.97:8080/ChildGame";
var urlProjectRemoteAsset = "http://192.168.1.97:8080/";
var urlProjectRemoteAssetZip = "http://192.168.1.97:8080/";
var versionProject = "5.1.6";
// var manifest = {
//   packageUrl: 'http://192.168.1.97:8080/',
//   remoteManifestUrl: 'http://192.168.1.97:8080/project.manifest',
//   remoteVersionUrl: 'http://192.168.1.97:8080/version.manifest',
//   version: '1.0.1',
//   assets: {},
//   searchPaths: []
// };

function onBeforeBuildFinish(options, callback) {
  if (options.platform != "android" ) {
    //onBuildFinished(options);
    //   URLs_SubPack.forEach(temp =>{
    //     temp.meta.isSubpackage = true;
    //     Editor.assetdb.saveMeta(temp.uuid,  JSON.stringify(temp.meta), (err , meta)=>{
    //     })
    // })

    callback();
    return;
  }


optionsCache = options;

  URLs_SubPack.forEach(temp => {
    mangUrl = [];
    //  getUrlFileFromDir(temp.url);

    //  mkdirsSync(urlSave +"/" + temp.name + "/src");
    //  mkdirsSync(urlSave +"/" + temp.name + "/res");


    //  getUrlFileFromDirBuildRes(urlSave + "/res/raw-assets"  , urlSave +"/" + temp.name );
    //  getUrlFileFromDirBuildImport(urlSave + "/res/import"  , urlSave +"/" + temp.name  );
  })

  //xoa xong raw  assets;

  callback();

}

function onClickBuild(){
  Editor.log("chay vao click build nay")
  renameBundle();
  creatSubpack(src);
  genManifestToanProject(optionsCache);
}

function Loc(fileName) {
  // var arrLoc = [".meta",".json" , ".atlas"];
  var arrLoc = [".meta"];
  var name = path.extname(fileName);
  if (arrLoc.includes(name)) return false;
  return true;
}

function getUrlFileFromDir(str) {
  fs.readdirSync(str).forEach(file => {
    let tempUrl = str + "/" + file;
    var stats = fs.statSync(tempUrl);

    if (stats.isDirectory()) {
      getUrlFileFromDir(str + "/" + file);
    } else if (stats.isFile()) {
      if (Loc(file)) {
        let temp = str.replace(urlProject, "db:/");
        let temp2 = temp + "/" + file;
        // Editor.log(temp2);

        let objSubAssets = Editor.assetdb.subAssetInfos(temp2);
        let length = objSubAssets.length;
        for (let i = 0; i < length; i++) {
          mangUrl.push(objSubAssets[i].uuid);
        }
        //  Editor.log("url la " + JSON.stringify() );
        //  Editor.log("url la chinh" + JSON.stringify(Editor.assetdb.urlToUuid(temp2)) );

        mangUrl.push(Editor.assetdb.urlToUuid(temp2));
        // mangUrl.push(temp2);
      }

    }
  });
}
function getUrlFileFromDirBuildRes(str, strGen) {
  fs.readdirSync(str).forEach(file => {
    let urltemp = str + "/" + file
    fs.readdirSync(urltemp).forEach(filee => {
      var stats = fs.statSync(urltemp + "/" + filee).isFile();
      if (stats) {
        mangUrl.forEach((temp) => {
          let strTemp = filee.split('.')[0]
          if (temp == strTemp) {
            let creatUrl = strGen + "/res/raw-assets/" + strTemp.slice(0, 2)
            mkdirsSync(creatUrl);
            fs.rename(urltemp + "/" + filee, creatUrl + "/" + filee);
          }
        })
      }

    })
  });
}
function getUrlFileFromDirBuildImport(str, strGen) {
  fs.readdirSync(str).forEach(file => {
    let urltemp = str + "/" + file
    fs.readdirSync(urltemp).forEach(filee => {
      var stats = fs.statSync(urltemp + "/" + filee).isFile();
      if (stats) {
        mangUrl.forEach((temp) => {
          let strTemp = filee.split('.')[0]
          if (temp == strTemp) {
            let creatUrl = strGen + "/res/import/" + strTemp.slice(0, 2)
            mkdirsSync(creatUrl);
            fs.renameSync(urltemp + "/" + filee, creatUrl + "/" + filee);
          }
        })
      }

    })
  });
  Editor.log("xong het lay file");
}
// function getSubCode(src , url , name , url2){
//   fs.readdirSync(src).forEach(file =>{
//     let urltemp = src + "/" + file;
//     var stats = fs.statSync(urltemp).isFile();
//     if(stats && name == file.split(".")[0]){
//       let creatUrl = url + "/src/assets" + url2 ;
//       mkdirsSync(creatUrl);
//       fs.rename(urltemp, creatUrl +"/" + file );
//     }
//   })
// }

function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}
function getUrlSubPack(urlProject) {
  fs.readdirSync(urlProject).forEach(file => {

    let tempUrl = urlProject + "/" + file;
    var stats = fs.statSync(tempUrl);
    if (stats.isDirectory() && file != "resources") {
      var strTemp = fs.readFileSync(tempUrl + ".meta");
      var strParse = JSON.parse(strTemp);
      let nameSub = strParse.bundleName
      if (strParse.isBundle) {

        let temp = {};
        temp.name = nameSub;
        temp.nameScritp = file;
        temp.url = tempUrl;
        temp.meta = strParse;
        temp.uuid = strParse.uuid;
        URLs_SubPack.push(temp);
        // strParse.isSubpackage = false;
        // if(currentPlatForm == "web-mobile"){
        //   fs.writeFileSync(tempUrl +".meta", JSON.stringify(strParse));
        //   Editor.assetdb.saveMeta(strParse.uuid,  JSON.stringify(strParse), (err , meta)=>{
        //     })
        // }
        //   Editor.log( "=== " +  fs.readFileSync(tempUrl +".meta" , "utf8"));

      }
      getUrlSubPack(urlProject + "/" + file);
    }
  });
}
function unCheckSub(options, callback) {
  currentFileSub = 0;
  currentFile = 0;
  totalFile = 0;
  currentPlatForm = options.platform;
  URLs_SubPack = [];
  urlSave = options.dest.replace(/\\/g, "/");
  rimraf.sync(urlSave + "/projectGen");
  src = urlSave + "/subpackages";
  urlProject = options.buildPath.slice(0, options.buildPath.length - 6).replace(/\\/g, "/");
  getUrlSubPack(urlProject + "/assets");
  Editor.log("lengh build la " + URLs_SubPack.length);
  URLs_SubPack.forEach(temp => {
    rimraf.sync(urlSave + "/" + temp.name);
  })


  rimraf.sync(urlSave + "/subpackages");
  mkdirsSync(urlSave + "/subpackages")
  //onBeforeChangeFile(options)
  callback();
}



//------------------------------------------

function readDir(dir, obj) {
  var stat = fs.statSync(dir);
  if (!stat.isDirectory()) {
    return;
  }
  var subpaths = fs.readdirSync(dir), subpath, size, md5, compressed, relative;
  for (var i = 0; i < subpaths.length; ++i) {
    if (subpaths[i][0] === '.') {
      continue;
    }
    subpath = path.join(dir, subpaths[i]);
    stat = fs.statSync(subpath);
    if (stat.isDirectory()) {
      readDir(subpath, obj);
    }
    else if (stat.isFile()) {
      // Size in Bytes
      size = stat['size'];
      md5 = crypto.createHash('md5').update(fs.readFileSync(subpath, 'binary')).digest('hex');
      compressed = path.extname(subpath).toLowerCase() === '.zip';

      relative = path.relative(_src, subpath);
      relative = relative.replace(/\\/g, '/');
      relative = encodeURI(relative);
      obj[relative] = {
        'size': size,
        'md5': md5
      };
      if (compressed) {
        obj[relative].compressed = true;
      }
    }
  }
}

function mkdirSync(path) {
  try {
    fs.mkdirSync(path);
  } catch (e) {
    if (e.code != 'EEXIST') throw e;
  }
}
function getUrlSubPackMiniGame(src) {
  Editor.log("chay vao gen " + src);
  let list = fs.readdirSync(src);
  totalFileSub = list.length;
  list.forEach(file => {
    let tempUrl = src + "/" + file;
    var stats = fs.statSync(tempUrl);
    if (stats.isDirectory() && !listLoc.includes(file)) {
      var manifest = {
        packageUrl: "",
        remoteManifestUrl: '',
        remoteVersionUrl: '',
        version: '1.0.0',
        assets: {},
        searchPaths: []
      };
      // fs.renameSync(urlSave+"/"+file +"/res" ,src +"/" +file+"/res");
      manifest.version = version[file];
      manifest.packageUrl = url + "/" + file + "/";
      manifest.remoteManifestUrl = url + "/" + file + '/project.manifest';
      manifest.remoteVersionUrl = url + "/" + file + '/version.manifest';
      _src = tempUrl;
      readDir(tempUrl, manifest.assets, tempUrl);
      var destManifest = path.join(tempUrl, 'project.manifest');
      var destVersion = path.join(tempUrl, 'version.manifest');
      mkdirSync(tempUrl);
      fs.writeFileSync(destManifest, JSON.stringify(manifest));
      delete manifest.assets;
      delete manifest.searchPaths;
      fs.writeFileSync(destVersion, JSON.stringify(manifest));
      fs.renameSync(tempUrl + "/project.manifest", tempUrl + "/assets/project.manifest");
      // rimraf.sync(urlSave+"/"+file);



      fs.readdirSync(tempUrl + "/assets").forEach(filee => {
        var stat = fs.statSync(tempUrl + "/assets/" + filee);
        if (stat.isDirectory()) {
          zipFolder.zipFolder(tempUrl + "/assets/" + filee, tempUrl + "/assets/" + filee + ".zip", (err) => {
            if (err) {
              console.log("khong zip duoc " + filee);
              return;
            }

            rimraf(tempUrl + "/assets/" + filee, () => {
              mkdirsSync(tempUrl + "/assets/" + filee);
              fs.rename(tempUrl + "/assets/" + filee + ".zip", tempUrl + "/assets/" + filee + "/" + filee + ".zip", () => {


                // mkdirsSync(tempUrl +"/res/import");
                // zipFolder.zipFolder(tempUrl +"/res/import" ,   tempUrl +"/res/import.zip" , ()=>{

                // let listRemoveImportZip = fs.readdirSync(tempUrl +"/res/import" )
                // listRemoveImportZip.forEach(fileImport =>{
                //   rimraf.sync(tempUrl +"/res/import/" + fileImport)
                // })
                // fs.renameSync(tempUrl +"/res/import.zip" , tempUrl +"/res/import/import.zip");
                manifest = {
                  packageUrl: '',
                  remoteManifestUrl: 'project.manifest',
                  remoteVersionUrl: 'version.manifest',
                  version: '1.0.0',
                  assets: {},
                  searchPaths: []
                };
                manifest.version = version[filee];
                manifest.packageUrl = url + "/" + file + "/";
                manifest.remoteManifestUrl = url + "/" + file + '/project.manifest';
                manifest.remoteVersionUrl = url + "/" + file + '/version.manifest';
                _src = tempUrl;

                rimraf.sync(tempUrl + "/version.manifest");
                readDir(tempUrl, manifest.assets, tempUrl);
                destManifest = path.join(tempUrl, 'project.manifest');
                destVersion = path.join(tempUrl, 'version.manifest');
                mkdirSync(tempUrl);
                fs.writeFileSync(destManifest, JSON.stringify(manifest));
                delete manifest.assets;
                delete manifest.searchPaths;
                fs.writeFileSync(destVersion, JSON.stringify(manifest));

                Editor.log("Built to " + filee + " successfully")
                rimraf.sync(urlSave + "/" + filee);
                checkFinishBuild();
                // } )
              });
            });
          });
        }
      })
    }
  })
}


function coppyFodler() {
  let list = fs.readdirSync(src);
  list.forEach(file => {
    let tempUrl = src + "/" + file;
    var stats = fs.statSync(tempUrl);

    if (stats.isDirectory() && !listLoc.includes(file)) {
      let srcCoppytemp = src + "/" + file + "full"
      copyFolderRecursiveSync(tempUrl, srcCoppytemp);
      let list2 = fs.readdirSync(srcCoppytemp + "/" + file);
      list2.forEach(file2 => {
        fs.renameSync(srcCoppytemp + "/" + file + "/" + file2, srcCoppytemp + "/" + file2);
      })
      rimraf.sync(srcCoppytemp + "/" + file)
      rimraf.sync(srcCoppytemp + "/assets/project.manifest");
      rimraf.sync(srcCoppytemp + "/project.manifest");
      rimraf.sync(srcCoppytemp + "/version.manifest");
      let outputPath2 = srcCoppytemp + "/assets/" + file;
      let uriRemove2 = srcCoppytemp + "/assets/" + file + "/" + file + ".zip";
      unzip(uriRemove2, outputPath2, () => {
        var manifest = {
          packageUrl: '',
          remoteManifestUrl: '',
          remoteVersionUrl: '',
          version: '1.0.0',
          assets: {},
          searchPaths: []
        };
        manifest.version = version[file];
        manifest.packageUrl = url + "/" + file + "full" + "/";
        manifest.remoteManifestUrl = url + "/" + file + "full" + '/project.manifest';
        manifest.remoteVersionUrl = url + "/" + file + "full" + '/version.manifest';
        _src = tempUrl + "full";
        readDir(tempUrl + "full", manifest.assets);
        var destManifest = path.join(tempUrl + "full", 'project.manifest');
        var destVersion = path.join(tempUrl + "full", 'version.manifest');
        mkdirSync(tempUrl + "full");
        fs.writeFileSync(destManifest, JSON.stringify(manifest));
        delete manifest.assets;
        delete manifest.searchPaths;
        fs.writeFileSync(destVersion, JSON.stringify(manifest));
      });

    }
  })
}
async function unzip(source, target, fun) {
  try {
    await extract(source, { dir: target })
    rimraf.sync(source);
    if (fun) fun();
  } catch (err) {
    Editor.log("Giai ne loi" + source);
    // handle any errors
  }
}
function checkFinishBuild() {
  currentFileSub++;
  if (currentFileSub == totalFileSub) {
    Editor.log("Chuan bi nhau vao Zip item con");
    coppyFodler(src);
  }
}
function renameBundle() {
  URLs_SubPack.forEach(temp => {
    fs.renameSync(urlSave + "/assets/" + temp.name, urlSave + "/subpackages/" + temp.name);
  })


}

function creatSubpack(src) {
  fs.readdirSync(src).forEach(file => {
    let tempUrl = src + "/" + file;
    let newUrl = tempUrl + "/assets/" + file;
    mkdirsSync(newUrl);

    fs.readdirSync(tempUrl).forEach(filee => {
      if (filee != "assets")
        fs.renameSync(tempUrl + "/" + filee, newUrl + "/" + filee);
    })
  })
  getUrlSubPackMiniGame(src);
}

function checkFinish() {
  currentFile++;
  //   console.log("phan tram hien tai la " + );
  // process.stdout.clearLine();
  // process.stdout.cursorTo(0);
  // process.stdout.write(currentFile/totalFile *100 + '%');
  if (currentFile == totalFile) {

  }
}

function copyFileSync(source, target) {

  var targetFile = target;

  //if target is a directory a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
  var files = [];

  //check if folder needs to be created or integrated
  var targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    mkdirsSync(targetFolder);
  }

  //copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      var curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}


function genManifestToanProject(options) {
  mkdirSync(urlSave + "/projectGen");
  copyFolderRecursiveSync(urlSave + "/src", urlSave + "/projectGen");
  copyFolderRecursiveSync(urlSave + "/assets", urlSave + "/projectGen");
  var manifest = {
    packageUrl: '',
    remoteManifestUrl: '',
    remoteVersionUrl: '',
    version: '',
    assets: {},
    searchPaths: []
  };
  manifest.packageUrl = urlProjectRemoteAsset;
  manifest.remoteManifestUrl = urlProjectRemoteAsset + "project.manifest";
  manifest.remoteVersionUrl = urlProjectRemoteAsset + "version.manifest";
  manifest.version = versionProject;
  _srcProject = urlSave + "/projectGen";
  readDirProject(urlSave + "/projectGen", manifest.assets);
  var destManifest = path.join(urlSave + "/projectGen", 'project.manifest');
  var destVersion = path.join(urlSave + "/projectGen", 'version.manifest');
  fs.writeFile(destManifest, JSON.stringify(manifest), (err) => {
    if (err) throw err;
    cc.NGWlog('loi gen project1');
  });
  delete manifest.assets;
  delete manifest.searchPaths;
  fs.writeFile(destVersion, JSON.stringify(manifest), (err) => {
    if (err) throw err;
    cc.NGWlog('loi gen version1');
  });

  zipFolder.zipFolder(urlSave + "/projectGen", urlSave + "/Full.zip", (err) => {
    if (err) Editor.log("Zip loi thang Full");
    fs.renameSync(urlSave + "/projectGen/project.manifest", urlSave + "/projectGen/assets/project.manifest");

    zipFolder.zipFolder(urlSave + "/projectGen/assets/internal", urlSave + "/projectGen/assets/internal.zip", (err) => {
      if (err) Editor.log("Zip loi thang Zip1");
      rimraf.sync(urlSave + "/projectGen/assets/internal");
      mkdirSync(urlSave + "/projectGen/assets/internal");
      fs.renameSync(urlSave + "/projectGen/assets/internal.zip", urlSave + "/projectGen/assets/internal/internal.zip");


      zipFolder.zipFolder(urlSave + "/projectGen/assets/main", urlSave + "/projectGen/assets/main.zip", (err) => {
        if (err) Editor.log("Zip loi thang Zip2");
        rimraf.sync(urlSave + "/projectGen/assets/main");
        mkdirSync(urlSave + "/projectGen/assets/main");
        fs.renameSync(urlSave + "/projectGen/assets/main.zip", urlSave + "/projectGen/assets/main/main.zip");



        zipFolder.zipFolder(urlSave + "/projectGen/assets/resources", urlSave + "/projectGen/assets/resources.zip", (err) => {
          if (err) Editor.log("Zip loi thang Zip2");
          rimraf.sync(urlSave + "/projectGen/assets/resources");
          mkdirSync(urlSave + "/projectGen/assets/resources");
          fs.renameSync(urlSave + "/projectGen/assets/resources.zip", urlSave + "/projectGen/assets/resources/resources.zip");
          rimraf.sync(urlSave + "/projectGen/project.manifest");
          rimraf.sync(urlSave + "/projectGen/version.manifest");
          manifest = {
            packageUrl: '',
            remoteManifestUrl: '',
            remoteVersionUrl: '',
            version: '',
            assets: {},
            searchPaths: []
          };
          manifest.packageUrl = urlProjectRemoteAssetZip;
          manifest.remoteManifestUrl = urlProjectRemoteAssetZip + "project.manifest";
          manifest.remoteVersionUrl = urlProjectRemoteAssetZip + "version.manifest";
          manifest.version = versionProject;
          _srcProject = urlSave + "/projectGen";
          readDirProject(urlSave + "/projectGen", manifest.assets);
          destManifest = path.join(urlSave + "/projectGen", 'project.manifest');
          destVersion = path.join(urlSave + "/projectGen", 'version.manifest');
          fs.writeFile(destManifest, JSON.stringify(manifest), (err) => {
            if (err) throw err;
            cc.NGWlog('loi gen project2');
          });
          delete manifest.assets;
          delete manifest.searchPaths;
          fs.writeFile(destVersion, JSON.stringify(manifest), (err) => {
            if (err) throw err;
            cc.NGWlog('loi gen version2');
          });
          zipFolder.zipFolder(urlSave + "/projectGen", urlSave + "/Zip.zip", (err) => {
            if (err) Editor.log("Zip loi thang Zip");
            Editor.log("Zip xong thang zip");
            
            Editor.Panel.close('tool');
          })


        })

      })

    })
    Editor.log("Zip xong thang full");
  })
}

// Iterate res and src folder
function readDirProject(dir, obj) {
  var stat = fs.statSync(dir);
  if (!stat.isDirectory()) {
    return;
  }
  var subpaths = fs.readdirSync(dir), subpath, size, md5, compressed, relative;

  for (var i = 0; i < subpaths.length; ++i) {
    if (subpaths[i][0] === '.') {
      continue;
    }
    subpath = path.join(dir, subpaths[i]);
    stat = fs.statSync(subpath);
    if (stat.isDirectory()) {
      readDirProject(subpath, obj);
    }
    else if (stat.isFile()) {
      // Size in Bytes
      size = stat['size'];
      md5 = crypto.createHash('md5').update(fs.readFileSync(subpath, 'binary')).digest('hex');
      compressed = path.extname(subpath).toLowerCase() === '.zip';
      relative = path.relative(_srcProject, subpath);
      relative = relative.replace(/\\/g, '/');
      relative = encodeURI(relative);
      obj[relative] = {
        'size': size,
        'md5': md5
      };
      if (compressed) {
        obj[relative].compressed = true;
      }
    }
  }
}
module.exports = {
  load() {
     Editor.Builder.on('build-finished', onBeforeBuildFinish);
     Editor.Builder.on('build-start', unCheckSub);
  },

  unload() {
     Editor.Builder.removeListener('build-finished', onBeforeBuildFinish);
     Editor.Builder.removeListener('build-start', unCheckSub);




   // 14/5q9NWxDB6Fyr0N9oaMF
  },


  // register your ipc messages here
  messages: {
    'open'() {
      // open entry panel registered in package.json

      Editor.Panel.open('tool');
    },
    'clicked'(event, arg) {

      let obj = JSON.parse(arg);
      version = JSON.parse(obj.verBundle);
      versionProject = obj.verProejct;
      urlProjectRemoteAsset = obj.urlFull;
      urlProjectRemoteAssetZip = obj.urlZip;
      url = obj.urlBundle;
      Editor.log('Lưu dữ liệu thành công ');

      let objCache = {};
      objCache.urlFull = urlProjectRemoteAsset;
      objCache.urlZip = urlProjectRemoteAssetZip;
      objCache.urlBundle = url;
      objCache.verProejct = versionProject;
      objCache.verChildGame = version;


      let strFile = "";//process.cwd() +"/infoBuild";
      strFile = Editor.url('packages://tool/panel/infoBuild.txt', 'utf8');

      // strFile = path.join(process.cwd() , "/infoBuild.txt");

      fs.writeFile(strFile, JSON.stringify(objCache), (err) => {
        if (err) {
          Editor.log(err);
          return;
        }

        onClickBuild();
      });

    },
    'dialog'(event, arg) {
      Editor.log('Thong Bao TU panel ' + arg);
    }
  },
};