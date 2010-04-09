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