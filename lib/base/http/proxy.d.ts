/// <reference types="node" />
/// <reference types="node" />
import http from 'http';
import https from 'https';
type ProxyServer = http.Server | https.Server;
interface ProxyOptions {
    name: string;
}
/**
 * Sets up an `http.Server` or `https.Server` instance with the necessary
 * "request" and "connect" event listeners in order to make the server act as an
 * HTTP proxy.
 *
 * @param {http.Server|https.Server} proxyServer
 * @param {Object} proxyOptions
 * @api public
 */
export declare function setup(proxyServer: ProxyServer, proxyOptions: ProxyOptions): ProxyServer;
export {};
