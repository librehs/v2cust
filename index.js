#!/bin/env node

const program = require('commander');
const package_json = require('./package.json');
const core = require('./core.js');

program
  .version(package_json.version)
  .usage('v2cust <base_config> <override_config>')
  .description('v2cust allow you to use different part of v2ray config file together. You can choose what to override.')
  .option('-l, --log', 'logs')
  .option('-i, --inbound', 'inbound')
  .option('-o, --outbound', 'outbound')
  .option('-a, --api','api')
  .option('-d, --dns','dns')
  .option('-s, --stats','stats')
  .option('-r, --routing','routing (including inbound detour & outbound detour)')
  .option('-p, --policy','policy')
  .option('-t, --transport','transport')
  .option('-v, --v2ray','v2ray path')
  .option('-s, --save [file]', 'don\'t run v2ray, just save the new configuration to [file]', 'config.json');

program.on('--help', function(){
  console.log('  Examples:');
  console.log('');
  console.log('    $ v2cust -i external.json socks5_1080.json');
  console.log('    $ v2cust -r external.json bypass_intranet.json');
});

program.parse(process.argv);

core.process(program);