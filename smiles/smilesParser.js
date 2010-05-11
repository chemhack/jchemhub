/*
 * Copyright [2010] [Mark Rijnbeek] 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
 * 
 * Unless required by applicable law or agreed to in writing, software distributed under the License 
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
 * See the License for the specific language governing permissions and limitations under the License.
 */

goog.provide('jchemhub.smiles.SmilesParser');
goog.require('goog.array');
goog.require('jchemhub.model.Atom');
goog.require('jchemhub.model.Atom.Hybridizations');
goog.require('jchemhub.model.PseudoAtom');
goog.require('jchemhub.model.Molecule');
goog.require('jchemhub.model.Bond');
goog.require('jchemhub.model.SingleBond');
goog.require('jchemhub.model.DoubleBond');
goog.require('jchemhub.model.TripleBond');
goog.require('jchemhub.model.QuadrupleBond');
goog.require('jchemhub.util.BondUtil');
goog.require('jchemhub.util.BondUtil.Orders');


/*  
 * SMILES parsing.
 * For more on SMILES, see: http://www.daylight.com/dayhtml_tutorials/languages/smiles/index.html
 * This parser is more or less a Java->Javascript port of the CDK's SMILES parser.
 * See: http://cdk.git.sourceforge.net/git/gitweb.cgi?p=cdk/cdk;a=summary
 * 
 * @author Mark Rijnbeek (markr@ebi.ac.uk)
 */


//TODO - why is stereo information ignored in the parser??

jchemhub.smiles.SmilesParser = function(){
	alert("jchemhub.smiles.SmilesParser = function()")
}

/**
 * Parse a SMILES String into a jchemhub.model.Molecule.
 */
jchemhub.smiles.SmilesParser.parse = function(smiles){

    //Initialization before parse 
    var bond = new jchemhub.model.Bond;
    var nodeCounter = 0;
    var bondOrder = null;  
    var bondOrderForRingClosure = jchemhub.util.BondUtil.Orders.SINGLE;
    var bondIsAromatic = false; 
    var bondExists = true;
    var thisRing = -1;
    var currentSymbol = null;
    var molecule=new jchemhub.model.Molecule;
    var position = 0;
    var rings = new Array();  // array with atoms
    var ringbonds = new Array(); // array with bonds 
    var mychar = 'X';
    var chars = new Array(); // char[1];
    var lastNode = null; //Atom
    var atomStack = new Array(); // stack with atoms
    var bondStack = new Array(); // stack with bond orders
    var atom = null;

    //Parser loep
	do {
        mychar = smiles.charAt(position);

        if ((mychar >= 'A' && mychar <= 'Z') || (mychar >= 'a' && mychar <= 'z') ||(mychar == '*'))
        {
            status = 1;
            atom = null;
			// A star means a pseudo atom 
            if (mychar == '*') {
                currentSymbol = "*";
                atom = new jchemhub.model.PseudoAtom("*",0,0);
            }
			else {
                currentSymbol = this.getSymbolForOrganicSubsetElement(smiles,position);
				//alert(currentSymbol);
				if (currentSymbol != null) {
                    if (currentSymbol.length == 1) {
                        if (currentSymbol.toUpperCase() != currentSymbol ) { 
                            currentSymbol = currentSymbol.toUpperCase();
                            atom = new jchemhub.model.Atom(currentSymbol);
							atom.hybridization=jchemhub.model.Atom.Hybridizations.SP2;
                        } 
						else
                            atom = new jchemhub.model.Atom(currentSymbol);
                    } 
					else
                        atom = new jchemhub.model.Atom(currentSymbol);
                } else
                     throw "Found element which is not a 'organic subset' element. You must use [" + mychar + "].";
            }
			molecule.addAtom(atom); 

            if ((lastNode != null) && bondExists) {
				bond = jchemhub.util.BondUtil.getBond (atom, lastNode,bondOrder);
                if (bondIsAromatic) {
                    bond.aromatic=true;
                }
                molecule.addBond(bond);
            }
            bondOrder = jchemhub.util.BondUtil.Orders.SINGLE;
            lastNode = atom;
            nodeCounter++;
            position = position + currentSymbol.length;
            bondExists = true;
            bondIsAromatic = false;
        } 

        else if (mychar == '=') {
			//alert(mychar);
            position++;
            if (status == 2 || !((smiles.charAt(position) >= '0' && smiles.charAt(position) <= '9') || smiles.charAt(position) == '%'))
                bondOrder = jchemhub.util.BondUtil.Orders.DOUBLE;
            else
                bondOrderForRingClosure = jchemhub.util.BondUtil.Orders.DOUBLE;
        } 
    	else if (mychar == '#') {
            //alert(mychar);
            position++;
            if (status == 2 || !((smiles.charAt(position) >= '0' && smiles.charAt(position) <= '9') || smiles.charAt(position) == '%')) 
                bondOrder = jchemhub.util.BondUtil.Orders.TRIPLE;
            else 
                bondOrderForRingClosure = jchemhub.util.BondUtil.Orders.TRIPLE;
        } 
		else if (mychar == '(') {
            //alert(mychar);
            atomStack.push(lastNode);
            bondStack.push(bondOrder);
            position++;
        }
		else if (mychar == ')' ) {
            //alert(mychar);
            lastNode = atomStack.pop();
            bondOrder = bondStack.pop();
            position++;
        } 
		else if (mychar >= '0' && mychar <= '9') {
            status = 2;
            chars[0] = mychar;
            currentSymbol = mychar; //new String(chars);
            thisRing = currentSymbol;

            //Handle ring__________			 
			var bondOrd = bondOrderForRingClosure;
			if (ringbonds[thisRing] > bondOrd) 
			    bondOrd = ringbonds[thisRing];
			ringBond = null;
			ringPartner = null;
			ringNode = rings[thisRing];
			if (ringNode != null) {
			    ringPartner = ringNode;
			    ringBond = jchemhub.util.BondUtil.getBond(lastNode, ringPartner, bondOrd);
			    if (bondIsAromatic) {
			        ringBond.setFlag(CDKConstants.ISAROMATIC, true);
			    }
			    molecule.addBond(ringBond);
			    bondIsAromatic = false;
			    rings[thisRing] = null;
			    ringbonds[thisRing] = null;
			} 
			else {
			    rings[thisRing] = lastNode;
			    ringbonds[thisRing] = bondOrderForRingClosure;
			}
			bondOrderForRingClosure = jchemhub.util.BondUtil.Orders.SINGLE;
            //______________________
            position++;

        }
		else if (mychar == '%')
        {
            pos=position+1;
	        if (pos >= smiles.length - 1)
	            throw "Percent sign ring closure numbers must be two-digit.";
	
	        currentSymbol = smiles.substring(pos, pos + 2);
	
	        if (currentSymbol.charAt(0) < '0' || currentSymbol.charAt(0) > '9' || 
	            currentSymbol.charAt(1) < '0' || currentSymbol.charAt(1) > '9')
	            throw "Percent sign ring closure numbers must be two-digit.";

            thisRing = currentSymbol;

            //Handle ring_______________            
            var bondOrd = bondOrderForRingClosure;
            if (ringbonds[thisRing] > bondOrd) 
                bondOrd = ringbonds[thisRing];
            ringBond = null;
            ringPartner = null;
            ringNode = rings[thisRing];
            if (ringNode != null) {
                ringPartner = ringNode;
                ringBond = jchemhub.util.BondUtil.getBond(lastNode, ringPartner, bondOrd);
                if (bondIsAromatic) {
                    ringBond.setFlag(CDKConstants.ISAROMATIC, true);
                }
                molecule.addBond(ringBond);
                bondIsAromatic = false;
                rings[thisRing] = null;
                ringbonds[thisRing] = null;
            } 
            else {
                rings[thisRing] = lastNode;
                ringbonds[thisRing] = bondOrderForRingClosure;
            }
            bondOrderForRingClosure = jchemhub.util.BondUtil.Orders.SINGLE;
			//_____________

            position += currentSymbol.length + 1;
        } 
		else if (mychar == '[')  {
            currentSymbol = this.getAtomString(smiles, position);
            atom = this.assembleAtom(currentSymbol);
            molecule.addAtom(atom);
            if (lastNode != null && bondExists) {
                bond = jchemhub.util.BondUtil.getBond (atom, lastNode,bondOrder);
                if (bondIsAromatic) {
                    bond.aromatic=true;
                }
                molecule.addBond(bond);
            }
            bondOrder = jchemhub.util.BondUtil.Orders.SINGLE;
            bondIsAromatic = false;
            lastNode = atom;
            nodeCounter++;
            position = position + currentSymbol.length + 2;

            //TODO change atom class
            //if (atom.getHydrogenCount() == null) {
                // zero implicit hydrogens is implied when the Hx syntax is not used
            //    atom.setHydrogenCount(0);
            //}
            bondExists = true;
        }
		else if (mychar == '.')
        {
            bondExists = false;
            position++;
        } else if (mychar == '-')
        {
            bondExists = true;
            position++;
        } else if (mychar == ':') {
            bondExists = true;
            bondIsAromatic = true;
            position++;
        } else if (mychar == '/' || mychar == '\\')
        {
            position++;
        } else if (mychar == '@')
        {
            if (position < smiles.length - 1 && smiles.charAt(position + 1) == '@')
            {
                position++;
            }
            position++;
        } else
        {
            throw "Invalid SMILES: found unexpected char: " + mychar;
        }
        
	}
	while (position < smiles.length)
    return molecule;
}


/**
 *  Gets the element symbol for an element in the 'organic subset' for which
 *  brackets may be omitted.
 *
 */
jchemhub.smiles.SmilesParser.getSymbolForOrganicSubsetElement = function(s, pos){
    var possibleSymbol="";
	if (pos < s.length - 1){
        possibleSymbol = s.substring(pos, pos + 2);
        if (("ClBr".indexOf(possibleSymbol) >= 0)){
            return possibleSymbol;
        }
    }
    if ("BCcNnOoFPSsI".indexOf((s.charAt(pos))) >= 0){
        return s.substring(pos, pos + 1);
    }
    if ("fpi".indexOf((s.charAt(pos))) >= 0){
        return s.substring(pos, pos + 1);
    }
    alert("SMILES parser problem: subset element not found at position "+pos);
    return null;
}


jchemhub.smiles.SmilesParser.getAtomString = function(smiles, pos) {
    atomString = "";
    for (f=pos+1; f<smiles.length; f++) {
        character = smiles.charAt(f);
        if (character == ']')
           break;
        else
           atomString+=character;
    }
    return atomString;
}


jchemhub.smiles.SmilesParser.getElementSymbol = function(s,pos) {
    // Try to match elements not in the organic subset.
    // first, the two char elements
    if (pos < s.length - 1)
    {
        possibleSymbol = s.substring(pos, pos + 2);
        if (("HeLiBeNeNaMgAlSiClArCaScTiCrMnFeCoNiCuZnGaGeAsSe".indexOf(possibleSymbol) >= 0) ||
            ("BrKrRbSrZrNbMoTcRuRhPdAgCdInSnSbTeXeCsBaLuHfTaRe".indexOf(possibleSymbol) >= 0) ||
            ("OsIrPtAuHgTlPbBiPoAtRnFrRaLrRfDbSgBhHsMtDs".indexOf(possibleSymbol) >= 0))
            return possibleSymbol;
    }

    // if that fails, the one char elements
    possibleSymbol = s.substring(pos, pos + 1);
    if (("HKUVYW".indexOf(possibleSymbol) >= 0))
        return possibleSymbol;

    // if that failed too, then possibly a organic subset element
    return this.getSymbolForOrganicSubsetElement(s, pos);
}



jchemhub.smiles.SmilesParser.getImplicitHydrogenCount = function(s,position) {
    count = 0;  
    if (s.charAt(position) == 'H') {
        multiplier = "";
        while (position < (s.length - 1) && isDigit(s.charAt(position + 1))){
            multiplier+=s.charAt(position + 1);
            position++;
        }
        if (multiplier.length > 0) {
            count = parseInt(multiplier);
        } 
		else count = -1; 
    }
    return count;
}


jchemhub.smiles.SmilesParser.assembleAtom = function(s) {
    atom = null;
    position = 0;
    currentSymbol = null;
    isotopicNumber = "";
    mychar='';
    do {
        mychar = s.charAt(position);
        if ((mychar >= 'A' && mychar <= 'Z') || (mychar >= 'a' && mychar <= 'z'))
        {
            currentSymbol = this.getElementSymbol(s, position);
            if (currentSymbol == null) {
                throw "Expected element symbol, found null!";
            } 
			else {
                position = position + currentSymbol.length;
                if (currentSymbol.length == 1){
                    if ( currentSymbol.toUpperCase()!=currentSymbol ) {
                        currentSymbol = currentSymbol.toUpperCase();
                        atom = new jchemhub.model.Atom(currentSymbol);
                        atom.hybridization=jchemhub.model.Atom.Hybridizations.SP2;
                        //TODO here: hydrogen count

                    } else
                        atom = new jchemhub.model.Atom(currentSymbol);
                } else
                        atom = new jchemhub.model.Atom(currentSymbol);
            }
            break;

        } else if (mychar >= '0' && mychar <= '9'){
            isotopicNumber+=mychar;
            position++;
        } else if (mychar == '*') {
            currentSymbol = "*";
            atom = new jchemhub.model.PseudoAtom("*",0,0);
            position++;
            break;
        } else
            throw "Invalid SMILES: found unexpected char: " + mychar;
    } 
	while (position < s.length);


    //TODO >>> change atom class
    //if (isotopicNumber.toString().length() > 0)
    //{
    //   atom.setMassNumber(Integer.parseInt(isotopicNumber.toString()));
    //}
	
    charge = 0;
    implicitHydrogens = 0;
    while (position < s.length)
    {
        mychar = s.charAt(position);
        if (mychar == 'H')
        {
            implicitHydrogens = this.getImplicitHydrogenCount(s, position);
            position++;
            if (implicitHydrogens >= 0) {
                position++;
            }
            //TODO >> change atom class                     
            //if (implicitHydrogens == -1) implicitHydrogens = 1;
            //  atom.setHydrogenCount(implicitHydrogens);
        } else if (mychar == '+' || mychar == '-')
        {
            charge = getCharge(s, position);
            position++; 
            while (position < s.length && isDigit(s.charAt(position))) {
                position++;
            }
            //TODO >> change atom class                     
            atom.setFormalCharge(charge);
        } else if (mychar == '@')
        {
            if (position < s.length- 1 && s.charAt(position + 1) == '@'){
                position++;
            }
            position++;
        } else
        {
            throw "Invalid SMILES: found unexpected char: " + mychar;
        }
    }
    return atom;
}




