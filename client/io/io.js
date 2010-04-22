//Licence and copyright

goog.provide('chem.io.Molfile');
goog.provide('chem.io.Rxnfile');
goog.require('chem.core.Reaction');
goog.provide('chem.io.JSONMolecule');
goog.provide('chem.io.JSONReaction');

/**
 * @fileoverview IO classes
 *
 */

/**
 * Static method for reading molfile
 * @param {String} molfile Content of molfile to read.
 */
chem.io.Molfile.read=function(molfile)
{
	var mol=new chem.core.Molecule();
	var lineDelimiter=molfile.indexOf("\r\n")>0?"\r\n":"\n";
    var mol_lines = molfile.split(lineDelimiter); 

    mol.setName(mol_lines[0]);
    var atom_count = parseInt(mol_lines[3].substr(0,3));
    var bond_count = parseInt(mol_lines[3].substr(3,3));

    for(var i=1; i<=atom_count; i++) {
        var line = mol_lines[i + 3];
        var symbol = line.substr(30, 4).replace(/(^\s*)|(\s*$)/g, "");

        var atom = new chem.core.Atom(symbol);
        atom.x = parseFloat(line.substr(0, 10));
        atom.y = parseFloat(line.substr(10, 10));
        atom.z = parseFloat(line.substr(20, 10));
        //see page 15 of ctfile for details http://www.symyx.com/downloads/public/ctfile/ctfile.pdf
        var ctfile_dd = parseInt(line.substr(34, 2)); //TODO implement isotopic support
        var ctfile_ccc = parseInt(line.substr(36, 3));
        //TODO support old-fashioned M ISO

        if (ctfile_ccc == 0) {
        } else if (ctfile_ccc == 1) {
            atom.charge = 3;
        } else if (ctfile_ccc == 2) {
            atom.charge = 2;
        } else if (ctfile_ccc == 3) {
            atom.charge = 1;
        } else if (ctfile_ccc == 4) {
            //TODO support doublet radical
        } else if (ctfile_ccc == 5) {
            atom.charge = -1;
        } else if (ctfile_ccc == 6) {
            atom.charge = -2;
        } else if (ctfile_ccc == 7) {
            atom.charge = -3;
        }
        mol.addAtom(atom);
    }

    for(var i=1; i<=bond_count; i++) {
        var line = mol_lines[i+3+atom_count];
		//Don't forget to -1 because molfile numbering from 1 instead of 0
	    sourceAtom =mol.getAtom(parseFloat(line.substr( 0,3))-1);
        targetAtom= mol.getAtom(parseFloat(line.substr( 3,3))-1);
		bondType = parseFloat(line.substr( 6,3));
	   	bondStereoType = parseFloat(line.substr( 9,3));

	    bond = new chem.core.Bond(sourceAtom,targetAtom,bondType);
		bond.stereoType=bondStereoType;
        mol.addBond(bond);
		
    }

    //Read M CHG
    var i=4+atom_count+bond_count,il=mol_lines.length;
    var superseded=false;
    while(true) {
        var line = mol_lines[i++];
        if(i==il||line.indexOf("M  END")>=0){
            break;
        }
        if(line.indexOf("M  CHG")>=0){
            /* TODO Charge  [Generic]
             M  CHGnn8 aaa vvv ...
             vvv: -15 to +15. Default of 0 = uncharged atom. When present, this property supersedes
             all charge and radical values in the atom block, forcing a 0 charge on all atoms not
             listed in an M  CHG or M  RAD line.
             *
             * */
            if(!superseded){
                for(var j=0,jl=mol.countAtoms();j<jl;j++){
                    mol.getAtom(j).charge=0;    
                }
                superseded=true;
            }
            var nn=parseInt(line.substr(6,3));
            for (var k = 0; k < nn; k++) {
                var atomNum=parseInt(line.substr(10+8*k,3));
//                console.debug(atomNum);
                var charge = parseInt(line.substr(14+8*k,3));
//                console.debug(charge);
                mol.getAtom(atomNum-1).charge=charge;
            }

        }
//		console.debug(line);
    }

	//TODO parse Charge, SuperAtom groups, Properties....

    return mol;

};



/**
 * Static method for writing molfile
 * @param {chem.core.Molecule} molecule to write
 */
chem.io.Molfile.write=function(mol)
{
    var molFile=new String();
	var headerBlock=new String();
    var countsLine=new String();
    var atomBlock=new String();
    var bondBlock=new String();

    // Header block
    // Line 1: Molecule name
    // Line 2: This line has the format: IIPPPPPPPPMMDDYYHHmmddSSssssssssssEEEEEEEEEEEERRRRRR
    // Line 3: A line for comments. If no comment is entered, a blank line must be present.
    var now = new Date();
	var line1=mol.getName()+"\n";
	var line2 = " "+"JChemHub" + now.format("molFileTime")+"\n";
    var line3 = "\n";
	var headerBlock=line1+line2+line3;

    // Counts line
    var atomCount = pad(new String(mol.countAtoms()),3,' ',STR_PAD_LEFT);  
    var bondCount = pad(new String(mol.countBonds()),3,' ',STR_PAD_LEFT);  
    // TODO complete lll, fff, ccc, sss
	countsLine = atomCount+bondCount+"  0  0  0  0            999 V2000\n";  


    // Atom block
    for (i = 0; i < mol.countAtoms(); i++) {
	   var atom =mol.getAtom(i);
	   var xPos=pad(new String((atom.x).toFixed(4)),10,' ',STR_PAD_LEFT);
       var yPos=pad(new String((atom.y).toFixed(4)),10,' ',STR_PAD_LEFT);
       var zPos=pad(new String( (0).toFixed(4)),10,' ',STR_PAD_LEFT);
	   var atomSymbol=pad(atom.symbol,3,' ',STR_PAD_LEFT);
	   //TODO: fill in more details on rest of atom line
       var filler="  0  0  0  0  0  0  0  0  0  0  0  0";
	   atomBlock+= xPos+yPos+zPos+atomSymbol+"\n";
	}
	
	// Bond Block 
    for (i = 0; i < mol.countBonds(); i++) {
	   var bond=mol.getBond(i);
	   var firstAtomNumber= mol.indexOfAtom(bond.source)+ 1;
	   var firstAtomString= pad(new String(firstAtomNumber),3,' ',STR_PAD_LEFT);
       var secondAtomNumber=mol.indexOfAtom(bond.target)+1;
       var secondAtomString= pad(new String(secondAtomNumber),3,' ',STR_PAD_LEFT);
       var bondTypeString= pad(new String(bond.bondType),3,' ',STR_PAD_LEFT);
       var stereoTypeString= pad(new String(bond.stereoType),3,' ',STR_PAD_LEFT);
       bondBlock+= firstAtomString+secondAtomString+bondTypeString+stereoTypeString+"\n";
    }

	molFile=headerBlock+countsLine+atomBlock+bondBlock;
	//alert(molFile);
    return molFile;

};

/**
 * Static method for reading rxnfile
 * @param {String} rxnfile to read
 */
chem.io.Rxnfile.read=function(rxnfile)
{
    var lineDelimiter=rxnfile.indexOf("\r\n")>0?"\r\n":"\n";
    var rxn_lines = rxnfile.split(lineDelimiter,5);//only need first 5 lines
    if(rxn_lines[0].indexOf("$RXN")<0){
        throw "not a RXN file";
    }
    var reaction=new chem.core.Reaction();
    reaction.header=rxn_lines[2]+lineDelimiter+rxn_lines[3];
    var reactant_count = parseInt(rxn_lines[4].substr(0,3));
    var product_count = parseInt(rxn_lines[4].substr(3,3));
    var rxn_blocks=rxnfile.split("$MOL"+lineDelimiter);
    for(var i=1,il=reactant_count;i<=il;i++){
        var mol=chem.io.Molfile.read(rxn_blocks[i]);
        reaction.addReactant(mol);
    }
    for(var i=1,il=product_count;i<=il;i++){
        var mol=chem.io.Molfile.read(rxn_blocks[i+reactant_count]);
        reaction.addProduct(mol);
    }
    return reaction;

};

/**
 uses JSON.parse and .stringify;  needs def for IE and ??
 This allows for a JSON external representation that uses bond atom-index
  instead of atom objects.  So, there are 3 types of things of import here:
  1. The actual Molecule object (typically mol here)
  2. The object (typically jmol here) in which bond's atom objects are recast as atom indexes
  3. The string representaion of jmol
  There is not use for the JSON string represention of the actual Molecule object.
*/

/**
 * Static method for reading JSON representation of mol object.
 * import data into mol object
 * @param {Object} The JSON object string or object itself
 */
chem.io.JSONMolecule.read = function(arg)
{
	var jmol;
	if (arg.constructor == String) {
		jmol = JSON.parse(arg);
	} else {
		jmol = arg;
	}
	var mol = new chem.core.Molecule();
    mol.name=jmol.name;
    for (i in jmol.atoms) {
	    var a = jmol.atoms[i];
	    var newatom = new chem.core.Atom();
	    newatom.symbol = a.symbol;
	    newatom.x = a.x;
	    newatom.y = a.y;
	    newatom.z = a.z;
	    newatom.charge = a.charge;
	    mol.addAtom(newatom);
    }
    var atoms = mol.atoms;
    for (i in jmol.bondindex) {
	    var b = jmol.bondindex[i];
	    var newbond = new chem.core.Bond();
	    newbond.source = atoms[b.source];
	    newbond.target = atoms[b.target];
	    newbond.bondType = b.type;
	    newbond.stereoType = b.stereo;
	    mol.addBond(newbond);
    }
    return mol;
};
/**
 * export data from mol object
 * returns The JSON representation of mol object.
 */
chem.io.JSONMolecule.write = function(mol) {
	var atoms = new Array();
	for (i in mol.atoms) {
		var a = mol.atoms[i];
		atoms.push({symbol: a.symbol, x: a.x, y: a.y, z: a.z, charge: a.charge});
	}
	var bonds = new Array();
	for (i in mol.bonds) {
		var b = mol.bonds[i];
		bonds.push( {source: mol.indexOfAtom(b.source), target: mol.indexOfAtom(b.target), type: b.bondType, stereo:b.stereoType} );
	}
	return JSON.stringify( {name: mol.name, atoms: atoms, bondindex: bonds} );
};

/**
 * Static method for reading JSON representation of reaction object.
 * import data into reaction object
 * @param {Object} The JSON object string, or object itself
 */
chem.io.JSONReaction.read = function(arg) {
	var jrxn;
	if (arg.constructor == String) {
		jrxn = JSON.parse(arg);
	} else {
		jrxn = arg;
	}
	var rxn = new chem.core.Reaction();
	rxn.header = jrxn.header;
	for (i in jrxn.reactants) {
		rxn.reactants.push(chem.io.JSONMolecule.read(jrxn.reactants[i]));
	}
	for (i in jrxn.products) {
		rxn.products.push(chem.io.JSONMolecule.read(jrxn.products[i]));
	}
	return rxn;
}

/**
 * export data from reaction object
 * returns The JSON representation of reaction object.
 */
chem.io.JSONReaction.write = function(rxn) {
	return JSON.stringify(rxn);
};