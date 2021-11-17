/*
 * Copyright (c) 2021 EdgerOS Team.
 * All rights reserved.
 *
 * Detailed license information can be found in the LICENSE file.
 *
 * File: camera_src.js camera source module.
 *
 * Author: Cheng.yongbin
 *
 */
const Device = require('device');
const MediaDecoder = require('mediadecoder');
const facenn = require('facenn');
const handnn = require('handnn');

const FlvSrc = require('webmedia/source/flv');
const util = require('util');

const extend = util.extend;
const clone = util.clone;

/* Pixel format. */
const MEDIA_PIXEL_FORMAT = MediaDecoder.PIX_FMT_BGR24;
const HANDNN_PIXEL_FORMAT = handnn.PIX_FMT_BGR24;

let light = undefined;
let lightId = '';
Device.list(true, function (error, list) {
	if (list && list.length === 1) {
		let dev = list[0];
		Device.info(dev.devid, function (error, info) {
			if (info &&
				info.report.name === 'light') {
				light = new Device();
				light.request(dev.devid, function (error) {
					if (error) {
						console.error('light request error: ');
						light = undefined;
					} else {
						lightId = dev.devid;
						light.send({ query: true, attrs: ['channel0'] }, function (error) {
							if (error) {
								console.error('Query light error:', error.message);
							} else {
								console.log('Query light Ok!');
							}
						}, 3);
					}
				});
			}
		});
	}
});

Device.on('lost', function (devid) {
	if (lightId && lightId === devid) {
		lightId = '';
		if (light) {
			lightRemove();
		}
	}
});

Device.on('join', function (devid, info) {
	if (info.report.name === 'light' && info.report.model === 'port' && lightId === '') {
		light = new Device();
		light.request(devid, function (error) {
			if (error) {
				console.error('light request error: ');
				light = undefined;
			} else {
				lightId = devid;
				light.send({ query: true, attrs: ['channel0'] }, function (error) {
					if (error) {
						console.error('Query light error:', error.message);
					} else {
						console.log('Query light Ok!');
					}
				}, 3);
			}
		});
	}
});

function lightRemove() {
	if (light) {
		light.release();
	}
}

/* Default input options. */
const DEF_IN_OPTS = {
	protocol: 'tcp',
	host: null,
	port: 554,
	path: '/',
	user: 'admin',
	pass: 'admin',
}

/* Default face detec view setting. */
const DEF_DETEC_VIEW = {
	disable: false,
	width: 640,
	height: 320,
	fps: 1,
	noDrop: false,
	pixelFormat: MEDIA_PIXEL_FORMAT,
}

/*
 * CameraSource.
 * op: start, stop.
 * emit: start, stop, stream, data, end, error.
 * Data protocol:
 * 	media: Push media info data first.
 *  	opts: {type: 'media'}
 * 		data: {width: {Integer}, height: {Integer}, fps: {Integer}}
 * 	face: Face detec output info.
 * 		opts: {type: 'face'}
 * 		data: [{x0: {Integer}, y0: {Integer}, x1: {Integer}, y1: {Integer}}, ...]
 */
class CameraSource extends FlvSrc {
	/* 
	 * constructor(ser, mode, inOpts[, outOpts])
	 * inOpts:
	 * 	host {String}
	 * 	[port] {Integer} Default: 10000
	 * 	[path] {String} Default: '/'
	 * 	[user] {String} Default: 'admin'
	 * 	[pass] {String} Default: 'admin'
	 */
	constructor(ser, mode, inOpts, outOpts) {
		super(ser, mode, inOpts, outOpts);

		if (typeof inOpts !== 'object') {
			throw new TypeError('Argument error.');
		}
		var input = clone(DEF_IN_OPTS);
		extend(input, inOpts);
		if (!input.host) {
			throw new TypeError('Argument inOpts.host error.');
		}

		this.inOpts = input;
		this._netcam = null;
		this.mediaInfo = { width: 0, height: 0, fps: 0 }; /* Origin media size. */
	}

	/*
	 * start()
	 */
	start() {
		var netcam = new MediaDecoder();
		this._netcam = netcam;
		var self = this;
		var input = this.inOpts;
		var url = `rtsp://${input.user}:${input.pass}@${input.host}:${input.port}${input.path}`;
		var name = `${input.host}:${input.port}${input.path}`;

		new Promise((resolve, reject) => {
			netcam.open(url, { proto: 'tcp', name: name }, 10000, (err) => {
				if (err) {
					console.error('Open netcam fail:', url, err);
					reject(err);
				} else {
					netcam.destVideoFormat(DEF_DETEC_VIEW);
					netcam.destAudioFormat({ disable: true });
					netcam.remuxFormat({ enable: true, enableAudio: true, format: 'flv' });

					netcam.on('remux', self.onStream.bind(self));
					netcam.on('header', self.onStream.bind(self));
					netcam.on('eof', self.onEnd.bind(self));
					netcam.on('video', self.onVideo.bind(self));
					resolve(netcam);
				}
			});
		})
		.then((netcam) => {
			super.start.call(self);
			netcam.start();
			var info = netcam.srcVideoFormat();
			self.mediaInfo = { width: info.width, height: info.height, fps: Math.round(info.fps) };
			self.sendDataHeader({ type: 'media' }, self.mediaInfo); /* {width, height, fps} */
		})
		.catch((err) => {
			console.error('Open netcam fail:', url, err);
			this.end();
		});
	}

	/*
	 * stop()
	 */
	stop() {
		console.info('Src stop');
		if (this._netcam) {
			this._netcam.close();
			this._netcam = null;
		}
		Task.nextTick(() => {
			super.stop.call(this);
		})
	}

	/*
	 * onVideo(frame)
	 * Face detec output info: [{x0, y0, x1, y1}]
	 */
	onVideo(frame) {
		var buf = new Buffer(frame.arrayBuffer);
		const view = DEF_DETEC_VIEW;
    // jsre手势监控api, 监控到的手势信息数组
		var handInfo = handnn.detect(buf, { width: view.width, height: view.height, pixelFormat: HANDNN_PIXEL_FORMAT });
		var ret = []; /* Empty array - clear. */
		for (var i = 0; i < handInfo.length; i++) {
			var info = handInfo[i];
			if (info.prob > 0.9) {
        // jsre手势监控api, 手势详情，包含手指伸缩情况
				var hand = handnn.identify(buf, {width: view.width, height: view.height, pixelFormat: HANDNN_PIXEL_FORMAT}, info);
				if (hand) {
					var fingers = hand.fingers;
					var num = 0;
					for (var j = 0; j < fingers.length; j++) {
						if (!fingers[j].curl){
							num++
						}
					}
          // 如果说手指全部收回，则关灯
					if (num === 0) {
						console.log('关灯');
						if (light) {
							var l = new Device()
							console.log('发送信号');
              // 向智能灯发送关灯信号
							light.send({
								channel0: false,
							}, function (error) {
								if (error) {
									console.error('Send message to light error:', error.message);
								}
							}, 3);
						} else {
							console.log('Light is not connected ！')
						}
					}
          // 如果说手指全部展开，则开灯
					if (num === 5) {
						console.log('开灯');
						if (light) {
							console.log('发送信号');
              // 向智能灯发送开灯信号
							light.send({
								channel0: true,
							}, function (error) {
								if (error) {
									console.error('Send message to light error:', error.message);
								}
							}, 3);
						} else {
							console.log('Light is not connected ！')
						}
					}
				}
			}
		}
	}

	/*
	 * onStream(frame)
	 */
	onStream(frame) {
		if (!this._netcam) {
			return;
		}
		var buf = Buffer.from(frame.arrayBuffer);
		try {
			this.pushStream(buf);
		} catch (e) {
			console.error(e);
			this.stop();
		}
	}

	/*
	 * onEnd()
	 */
	onEnd() {
		console.info('Src end');
		this.end();
	}
}




/*
 * Export module.
 */
module.exports = CameraSource;
