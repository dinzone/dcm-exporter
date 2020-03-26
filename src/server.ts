import express from 'express';
import { register, Gauge } from 'prom-client';
import { DcmQuery } from './dcm-query-service';

const INTERVAL = process.env.INTERVAL ? parseInt(process.env.INTERVAL) : undefined,
    DCM_URL = process.env.DCM_URL || undefined,
    RESULT_PREFIX = process.env.RESULT_PREFIX ? `${process.env.RESULT_PREFIX}_` : ''

const dcmService = new DcmQuery({
    intervalRequestInSeconds: INTERVAL,
    dcmUrl: DCM_URL
});

const portsGauge = new Gauge({
    name: `${RESULT_PREFIX}dcm_port_bitrate`,
    help: 'provide the bitrate of the dcm ports',
    labelNames: ['port', 'type']
});

const inputPortsGauge = new Gauge({
    name: `${RESULT_PREFIX}dcm_port_input`,
    help: 'provide the input bitrate of the dcm ports',
    labelNames: ['port']
});

const outputPortsGauge = new Gauge({
    name: `${RESULT_PREFIX}dcm_port_output`,
    help: 'provide the output bitrate of the dcm ports',
    labelNames: ['port']
});

const app = express();

app.get('/metrics', async (req, res) => {
    const { force } = req.query;
    await getMatrics((force || force === '') ? true : false);
    res.set('Content-Type', register.contentType);
    res.end(register.metrics());
});

app.listen(5555, async () => {
    await getMatrics();
    console.log('server listen');
});

async function getMatrics(force?: boolean) {
    let result = await dcmService.getBitrate(force);
    result.forEach((result) => {
        portsGauge.set({ port: result.port, type: 'input' }, result.input);
        portsGauge.set({ port: result.port, type: 'output' }, result.output);
        inputPortsGauge.set({ port: result.port }, result.input);
        outputPortsGauge.set({ port: result.port }, result.output);
    });
}