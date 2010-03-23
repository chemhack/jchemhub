//Licence and copyright

goog.provide('chem.io.Molfile');

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
    var mol_lines = molfile.split(lineDelimiter); //TODO support windows LR "\r\n" 

    mol.setName(mol_lines[0]);
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
	   	bondStereoType = parseFloat(line.substr( 9,3));

	    bond = new chem.core.Bond(sourceAtom,targetAtom,bondType);
		bond.stereoType=bondStereoType;
        mol.addBond(bond);
		
    }
	
	//TODO parse Charge, SuperAtom groups, Properties....

    return mol;

}



/**
 * Static method for writing molfile
 * @param {String} molecule to write
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

}