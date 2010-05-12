/**
 * @fileoverview Remote service class for CDK services
 *
 */
goog.provide('jchemhub.remote.CDK');
goog.require('goog.net.Jsonp');

jchemhub.remote.CDK=function(_url) {
    this.serverUrl = _url ? _url : "http://localhost:8080/";
}

/**
 * Sends the given payload to the URL specified at the construction
 * time. The reply is delivered to the given replyCallback. If the
 * errorCallback is specified and the reply does not arrive within the
 * timeout period set on this channel, the errorCallback is invoked
 * with the original payload.
 *
 * @param {Object}  params TODO write doc.
 *
 * @param {Function=} replyCallback A function expecting one
 *     argument, called when the reply arrives, with the response data.
 *
 * @param {Function=} errorCallback A function expecting one
 *     argument, called on timeout, with the payload.
 *
 * @return {Object} A request descriptor that may be used to cancel this
 *     transmission, or null, if the message may not be cancelled.
 */

jchemhub.remote.CDK.prototype.smilesToMolfile=function(params,replyCallback,errorCallback){
    var jsonp = new goog.net.Jsonp(new goog.Uri(this.serverUrl+'parseSmiles'));
    return jsonp.send(params,replyCallback,errorCallback);
};