#!/usr/bin/env node

var fs = require('fs');
var readline = require('readline');
var util = require('util');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var program = require('commander');
var async = require('async');
var chalk = require('chalk');
var error = chalk.bold.rgb(0, 0, 0).bgRgb(255, 60, 60);
var warn = chalk.bold.rgb(0, 0, 0).bgRgb(255, 252, 31);
var done = chalk.bold.rgb(0, 0, 0).bgRgb(141, 255, 104);
var working = chalk.bold.rgb(255, 255, 255).bgRgb(40, 40, 40);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

program
  .version('1.0.0', '-v, --version')
  .option('-u, --upload', 'upload video')
  .parse(process.argv);

if(program.upload) {

    var data = [];

    async.series([
        function (callback) {
            rl.question('Enter video Path (path/to/video.mp4) : ', function (args) {
                if(!args){
                    console.log(warn("Warning : path can't be empty"));
                    rl.clearLine();
                }
                data.push(args);
                callback();
            });
        }, function (callback) {
            rl.question('Enter video Title : ', function (args) {
                if(!args){
                    console.log(warn("\nWarning : title can't be empty"));
                    rl.clearLine();
                }
                data.push(args);
                callback();
            });
        }, function (callback) {
            rl.question('Enter video Description : ', function (args) {
                data.push(args);
                callback();
            });
        },
        function (callback) {
            rl.question('\nChoose a visiblity type for video (public,private or unlisted) : ', function (args) {
                if(!args){
                    console.log(warn("\nWarning : visiblity can't be empty"));
                    rl.clearLine();
                }
                data.push(args.toLowerCase());
                callback();
            });
        },
    ], function () {
        if(!data[0] || !data[1] || !data[3]) {
            console.error(error("\nError : you left some fields empty, try again :("));
            rl.close();
            return;
        }

        rl.question(`
        Video Path => ${data[0]}
        Video Title => ${data[1]}
        Video Description => ${data[2]}
        Video Visiblity => ${data[3]} 
        \nIs this ok?  (yes/no) `, (answer) => {
            if (answer.match(/^y(es)?$/i)){
                sure(data);
            }else{
                rl.close();
            }
        });
        function sure(){
        rl.question('\nAre you sure you want to continue uploading video? (yes/no) ', (answer) => {
            if (answer.match(/^y(es)?$/i)){
                uploadvideo2yt(data);
                rl.close();
            }else{
                rl.close();
            }
        });
    }
    });

}else {
  process.exit(1);
}

  function uploadvideo2yt(data) {
   fs.readFile('client_secret.json', function processClientSecrets(err, content) {
       if (err) {
         console.log(error('Error loading client secret file: ' + err));
         return;
       }
         authorize(JSON.parse(content), {'params': {'part': 'snippet,status'}, 'properties': {'snippet.categoryId': '22',
                      'snippet.defaultLanguage': '',
                     'snippet.description': `${data[2]}`,
                     'snippet.tags[]': '',
                     'snippet.title': `${data[1]}`,
                    'status.embeddable': '',
                    'status.license': '',
                    'status.privacyStatus': `${data[3]}`,
                    'status.publicStatsViewable': ''
        }, 'mediaFilename': `${data[0]}`}, videosInsert);
    });
  }

var SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']
var TOKEN_DIR = './credentials/';
var TOKEN_PATH = TOKEN_DIR + 'google-apis-nodejs-quickstart.json';

function authorize(credentials, requestData, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, requestData, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client, requestData);
    }
  });
}

function getNewToken(oauth2Client, requestData, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log(error('\nError while trying to retrieve access token'));
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client, requestData);
    });
  });
}

function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('\nToken stored to ' + TOKEN_PATH);
}

function removeEmptyParameters(params) {
  for (var p in params) {
    if (!params[p] || params[p] == 'undefined') {
      delete params[p];
    }
  }
  return params;
}

function createResource(properties) {
  var resource = {};
  var normalizedProps = properties;
  for (var p in properties) {
    var value = properties[p];
    if (p && p.substr(-2, 2) == '[]') {
      var adjustedName = p.replace('[]', '');
      if (value) {
        normalizedProps[adjustedName] = value.split(',');
      }
      delete normalizedProps[p];
    }
  }
  for (var p in normalizedProps) {
    // Leave properties that don't have values out of inserted resource.
    if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
      var propArray = p.split('.');
      var ref = resource;
      for (var pa = 0; pa < propArray.length; pa++) {
        var key = propArray[pa];
        if (pa == propArray.length - 1) {
          ref[key] = normalizedProps[p];
        } else {
          ref = ref[key] = ref[key] || {};
        }
      }
    };
  }
  return resource;
}


function videosInsert(auth, requestData) {
  var service = google.youtube('v3');
  console.log(working("\nuploading video..."));
  var parameters = removeEmptyParameters(requestData['params']);
  parameters['auth'] = auth;
  parameters['media'] = { body: fs.createReadStream(requestData['mediaFilename']) };
  parameters['notifySubscribers'] = true;
  parameters['resource'] = createResource(requestData['properties']);
  service.videos.insert(parameters, function(err, data) {
    if (err) {
      console.log(error('\nError uploading video : ' + err));
    }
    if (data) {
        console.log(done("\nvideo uploaded"));
    }
    process.exit();
  });
}