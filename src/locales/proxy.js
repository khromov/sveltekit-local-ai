import * as _w_c_server_0_ from './en.compiled.server.js';
import * as _w_c_server_1_ from './es.compiled.server.js';
import * as _w_c_server_2_ from './ja.compiled.server.js';
import * as _w_c_server_3_ from './sv.compiled.server.js';
import * as _w_c_server_4_ from './uk.compiled.server.js';
const catalogs = {
	server: {
		en: _w_c_server_0_,
		es: _w_c_server_1_,
		ja: _w_c_server_2_,
		sv: _w_c_server_3_,
		uk: _w_c_server_4_
	}
};
export const loadCatalog = (loadID, locale) => catalogs[loadID][locale];

export const loadIDs = ['server'];
export const key = 'server';
