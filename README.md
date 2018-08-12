# v2cust
Customize your Project V config. - `npm install -g v2cust`

[![](https://nodei.co/npm/v2cust.png?global=true)](https://nodei.co/npm/v2cust)

For help: `v2cust -h`.

```

  Usage: v2cust <base_config> <override_config>

  v2cust allow you to use different part of v2ray config file together. You can choose what to override.

  Options:

    -V, --version             output the version number
    -l, --log                 logs
    -i, --inbound             inbound
    -o, --outbound            outbound
    -a, --api                 api
    -d, --dns                 dns
    -s, --stats               stats
    -r, --routing             routing (including inbound detour & outbound detour)
    -p, --policy              policy
    -t, --transport           transport
    -v, --v2ray <v2ray path>  v2ray path
    --show                    don't run v2ray, just show the merged config file.
    --save <file>             don't run v2ray, just save the new configuration to <file> [default: config.json]
    --overwrite               overwrite the file to save.
    -h, --help                output usage information

  Examples:

    $ v2cust -i external.json socks5_1080.json
    $ v2cust -r external.json bypass_intranet.json
```