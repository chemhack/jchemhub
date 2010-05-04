goog.provide('jchemhub.io.JSONReaction');

goog.require('jchemhub.model.Reaction');


/**
 * Static method for reading JSON representation of reaction object. import data
 * into reaction object
 * 
 * @param {Object}
 *            The JSON object string, or object itself
 */
jchemhub.io.JSONReaction.read = function(arg) {
	var jrxn;
	if (arg.constructor == String) {
		jrxn = JSON.parse(arg);
	} else {
		jrxn = arg;
	}
	var rxn = new jchemhub.model.Reaction();
	rxn.header = jrxn.header;
	for (var i in jrxn.reactants) {
		rxn.reactants.push(jchemhub.io.JSONMolecule.read(jrxn.reactants[i]));
	}
	for (var i in jrxn.products) {
		rxn.products.push(jchemhub.io.JSONMolecule.read(jrxn.products[i]));
	}
	return rxn;
}

/**
 * export data from reaction object
 * returns The JSON representation of reaction object.
 */
jchemhub.model.Reaction.prototype.toString = function () {
	var jstring = '{"header":"' + this.header + '"';
	jstring += ', "reactants":[';
	for (i in this.reactants) {
		jstring += this.reactants[i].toString() + ',';
	}
	jstring += ']';
	jstring += ', "products":[';
	for (var i in this.products) {
		jstring += this.products[i].toString() + ',';
	}
	jstring += ']';
	
	jstring += '}';
	return jstring;
};
jchemhub.io.JSONReaction.write = function(rxn) {
	return rxn.toString();
};