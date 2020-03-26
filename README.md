# DCM Exporter
This project provied DCM Exporter for prometheus writen in typescript.

## install and run

To start the exporter install it first:  
`npm i`  
Then you can run it by running: `npm start` or `npm run build && node ./dist/index.js`.  

## configuration

the exporter can get configuration from environment variable or from `.env` file that locate in the root folder of the exporter.  

| **KEY** | **DESCRIPTION** | **DEFAULT VALUE** |
|---------|-----------------|-------------------|
| INTERVAL | The gap in seconds to query the dcm   | 15 seconds |
| DCM_URL | dcm url | `http://localhost:9846/bitrate`|
|RESULT_PREFIX| prefix to the prometheus result | `""`|

## result example

The exporter will return 3 types of result, example:
```
# HELP dcm_port_bitrate provide the bitrate of the dcm ports
# TYPE dcm_port_bitrate gauge
dcm_port_bitrate{port="1",type="input"} 0.7328738276550926
dcm_port_bitrate{port="1",type="output"} 0.7593847218267118
dcm_port_bitrate{port="2",type="input"} 1.3910445687484971
dcm_port_bitrate{port="2",type="output"} 1.1142085469740357
etc...

# HELP dcm_port_input provide the input bitrate of the dcm ports
# TYPE dcm_port_input gauge
dcm_port_input{port="1"} 0.7328738276550926
dcm_port_input{port="2"} 1.3910445687484971
dcm_port_input{port="3"} 0.9834983043261549
dcm_port_input{port="4"} 0.6341242094397557
etc...

# HELP dcm_port_output provide the output bitrate of the dcm ports
# TYPE dcm_port_output gauge
dcm_port_output{port="1"} 0.7593847218267118
dcm_port_output{port="2"} 1.1142085469740357
dcm_port_output{port="3"} 2.2806853081082092
dcm_port_output{port="4"} 1.1702753107384605
etc...

```

if `PREFIX` provided in the configuration then the jobs name will be:
```
prefix_dcm_port_bitrate ...
prefix_dcm_port_input ...
prefix_dcm_port_output ...
```

## Grafana

This exporter provide basic dashbord for his job.  
just import the json file from `grafana/dcm-dashbord.json` to your grafana and config the data source and you are ready!
