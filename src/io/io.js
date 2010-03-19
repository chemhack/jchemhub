//Licence and copyright

goog.provide('chem.io.Molfile');

/**
 * @fileoverview Core classes including Atom, Bond and Molecule
 *
 */

/**
 * Static method for reading molfile
 * @param {String} molfile Content of molfile to read.
 */
chem.io.Molfile.read=function(molfile)
{
	var mol=new chem.core.Molecule();
    var mol_lines = molfile.split("\n"); //TODO support windows LR "\r\n" 
    // Counts line at line 4
    var atom_count = parseInt(mol_lines[3].substr(0,3));
    var bond_count = parseInt(mol_lines[3].substr(3,3));

    for(i=1; i<=atom_count; i++) {
    	var line = mol_lines[i+3];
		var symbol=line.substr(30,4).replace(/(^\s*)|(\s*$)/g, "");
        
		var atom = new chem.core.Atom(symbol);
		atom.x = parseFloat(line.substr( 0,10));
        atom.y = parseFloat(line.substr(10,10));
        atom.z = parseFloat(line.substr(20,10));
        mol.addAtom(atom);
    }

    for(i=1; i<=bond_count; i++) {
        var line = mol_lines[i+3+atom_count];
    
		//Don't forget to -1 because molfile numbering from 1 instead of 0  
	    sourceAtom =mol.getAtom(parseFloat(line.substr( 0,3))-1);
        targetAtom= mol.getAtom(parseFloat(line.substr( 3,3))-1);
		bondType = parseFloat(line.substr( 6,3));
	   	bondSteroType = parseFloat(line.substr( 9,3));

	    bond = new chem.core.Bond(sourceAtom,targetAtom,bondType);
		bond.steroType=bondSteroType;
        mol.addBond(bond);
		
    }
	
	//TODO parse Charge, SuperAtom groups, Properties....

    return mol;

}

