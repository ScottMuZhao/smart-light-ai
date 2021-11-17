/*
 * Copyright (c) 2021 EdgerOS Team.
 * All rights reserved.
 *
 * Detailed license information can be found in the LICENSE file.
 *
 * File: util.js util module.
 *
 * Author: Cheng.yongbin
 *
 */

const advnwc = require('advnwc');
const permission = require('permission');

/*
 * Check permission.
 */
function checkPerm(keys) {
	return new Promise((resolve, reject) => {
		let perms = keys.reduce((ret, key) => {
			ret[key] = true;
			return ret;
		}, {});

		permission.check(perms, function(result) {
			console.log(`Check permission ${perms} is ${result}.`);
			if (result) {
				resolve(true);
			} else {
				reject(new Error('Need permission.'));
			}
		});
	});
}

/*
 * Get ifnames.
 */
function getIfnames() {
	return new Promise((resolve, reject) => {
		advnwc.netifs(true, function(error, list) {
			if (error) {
				reject(error);
			} else {
				console.log('LAN port interface:', list);
				resolve(list[0]);
			}
		});
	})
	.then((ifname) => {
		return new Promise((resolve, reject) => {
			advnwc.netifs(false, function(error, list) {
				if (error) {
					reject(error);
				} else {
					console.log('WAN port interface:', list);
					resolve({lan: ifname, wan: list[0]});
				}
			});
		});
	});
}

module.exports = {
	checkPerm,
	getIfnames
};
