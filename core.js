const fs = require('fs');
const color = require('cli-color');
const tmp = require('tmp');
const spawn = require('child_process').spawn;

function proc(program, configFile) {
  
  var saveToFile = true === program.save
    ? 'config.json' : program.save || false;
  var v2rayPath =  program.v2ray
    ? program.v2ray : 'v2ray';

  if (fs.existsSync(configFile.base) === false) {
    errorText("Base config not found!");
    process.exit(1);
  }
  if (fs.existsSync(configFile.override) === false) {
    errorText("Override config not found!");
    process.exit(1);
  }
  if (fs.accessSync(configFile.base, fs.constants.R_OK) === false) {
    errorText("Base config is not readable!");
    process.exit(1);
  }
  if (fs.accessSync(configFile.override, fs.constants.R_OK) === false) {
    errorText("Override config is not readable!");
    process.exit(1);
  }

  try {
    var baseConfig = fs.readFileSync(configFile.base, encoding = 'utf-8');
    var overrideConfig = fs.readFileSync(configFile.override, encoding = 'utf-8');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  try {
    var baseConfigJSON = JSON.parse(baseConfig);
    var overrideConfigJSON = JSON.parse(overrideConfig);
  } catch (err) {
    errorText("Fail to parse JSON. Detailed message:");
    console.error(err);
    process.exit(1);
  }

  try {
    let mergeConfig = determine(program);
//    console.log(mergeConfig);
    if (mergeConfig.log) baseConfigJSON.log = overrideConfigJSON.log;
    if (mergeConfig.inbound) baseConfigJSON.inbound = overrideConfigJSON.inbound;
    if (mergeConfig.outbound) baseConfigJSON.outbound = overrideConfigJSON.outbound;
    if (mergeConfig.api) baseConfigJSON.api = overrideConfigJSON.api;
    if (mergeConfig.dns) baseConfigJSON.dns = overrideConfigJSON.dns;
    if (mergeConfig.stats) baseConfigJSON.stats = overrideConfigJSON.stats;
    if (mergeConfig.policy) baseConfigJSON.policy = overrideConfigJSON.policy;
    if (mergeConfig.transport) baseConfigJSON.transport = overrideConfigJSON.transport;
    if (mergeConfig.routing) {
      if (!overrideConfigJSON.routing) {
        baseConfigJSON.routing = baseConfigJSON.inboundDetour = baseConfigJSON.outboundDetour = undefined;
      } else {
        baseConfigJSON.routing = overrideConfigJSON.routing;
        baseConfigJSON.inboundDetour = overrideConfigJSON.inboundDetour;
        baseConfigJSON.outboundDetour = overrideConfigJSON.outboundDetour;
      }
    }

  } catch (err) {
    errorText("Fail to merge file. Detailed message:");
    console.error(err);
    process.exit(1);
  }

  if (program.show) {
    console.log(color.blue(color.bold("[Info] ") + "merged config:"));
    console.log(baseConfigJSON);
    process.exit();
  }

  var content = JSON.stringify(baseConfigJSON);

  if (saveToFile) {
    saveConfig(saveToFile, content, program.overwrite);
    process.exit();
  } else {
    runV2ray(v2rayPath, content);
  }
}

function errorText(text) {
  console.error(color.red(color.bold('[Error] ') + text));
}

function saveConfig(filename, text, overwrite) {
  console.log(color.blue(color.bold("[Info] ") + "saving to " + filename));
  if (fs.existsSync(filename)) {
    if (!overwrite) {
      console.warn(color.yellow.bold("[WARNING] ") + "File exists, overwrite?");
      console.warn("Use --overwrite to overwrite.");
      process.exit(1);
    } else {
      console.warn(color.yellow.bold("[Warning] ") + "Overwriting " + filename);
    }
  }
  try {
    fs.writeFileSync(filename, text);
  } catch (err) {
    errorText("Fail to save file. Detailed message:");
    console.error(err);
    process.exit(1);
  }
}

function runV2ray(exePath, content) {
  var tmpobj = tmp.fileSync();
  fs.writeFileSync(tmpobj.fd, content);
  let v2rayProc = spawn(exePath, ['-config', tmpobj.name]);
  v2rayProc.stdout.on('data', (data) => { console.log(`${data}`); });
  v2rayProc.stderr.on('data', (data) => { console.log(`${data}`); });
  v2rayProc.on('exit', function (code, signal) {
    console.log('v2ray has exited. Exit code: ' + code);
    process.exit();
  });
}

function determine(program) {
  var dtm = {};
  dtm.log = program.log ? true : false;
  dtm.inbound = program.inbound ? true : false;
  dtm.outbound = program.outbound ? true : false;
  dtm.api = program.api ? true : false;
  dtm.dns = program.dns ? true : false;
  dtm.stats = program.stats ? true : false;
  dtm.routing = program.routing ? true : false;
  dtm.policy = program.policy ? true : false;
  dtm.transport = program.transport ? true : false;
  return dtm;
}

module.exports = {
  process: proc
}