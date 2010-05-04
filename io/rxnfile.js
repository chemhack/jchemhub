goog.provide('jchemhub.io.Rxnfile');



/**
 * Static method for reading rxnfile
 * 
 * @param {String}
 *            rxnfile to read
 */
jchemhub.io.Rxnfile.read = function(rxnfile) {
	var lineDelimiter = rxnfile.indexOf("\r\n") > 0 ? "\r\n" : "\n";
	var rxn_lines = rxnfile.split(lineDelimiter, 5);// only need first 5 lines
	if (rxn_lines[0].indexOf("$RXN") < 0) {
		throw "not a RXN file";
	}
	var reaction = new jchemhub.model.Reaction();
	reaction.header = rxn_lines[2] + lineDelimiter + rxn_lines[3];
	var reactant_count = parseInt(rxn_lines[4].substr(0, 3));
	var product_count = parseInt(rxn_lines[4].substr(3, 3));
	var rxn_blocks = rxnfile.split("$MOL" + lineDelimiter);
	for ( var i = 1, il = reactant_count; i <= il; i++) {
		var mol = jchemhub.io.Molfile.read(rxn_blocks[i]);
		reaction.addReactant(mol);
	}
	for ( var i = 1, il = product_count; i <= il; i++) {
		var mol = jchemhub.io.Molfile.read(rxn_blocks[i + reactant_count]);
		reaction.addProduct(mol);
	}
	return reaction;

};
