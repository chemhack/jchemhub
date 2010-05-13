goog.provide("jchemhub.io.smiles");
goog.require('jchemhub.model.Molecule');
goog.require('jchemhub.model.Atom');
goog.require('jchemhub.model.Bond');
goog.require('jchemhub.model.Reaction');
goog.require('jchemhub.model.SingleBond');
goog.require('jchemhub.model.SingleBondUp');
goog.require('jchemhub.model.SingleBondDown');
goog.require('jchemhub.model.SingleBondUpOrDown');
goog.require('jchemhub.model.DoubleBond');
goog.require('jchemhub.model.TripleBond');
goog.require('jchemhub.model.QuadrupleBond');
goog.require('jchemhub.model.DoubleBond');
goog.require('jchemhub.model.AromaticBond');

/**
 * enum for bond types
 *
 * @enum {string}
 */
jchemhub.io.smiles.BondType = {
                NONE:"NONE",
                SINGLE_BOND:"-",
                DOUBLE_BOND:"=",
                TRIPLE_BOND:"#",
                QUAD_BOND:"$",
                AROMATIC_BOND:":",
                ANY:"~"
};

/**
 * enum for stereo types
 *
 * @enum {string}
 */
jchemhub.io.smiles.BondStereo = {
                NONE:"NONE",
                CLOCKWISE:"@",
                COUNTER_CLOCKWISE:"@@"
};


jchemhub.io.smiles.punctuation = {
 nobond:      '.',
 openbranch:  '(',
 closebranch: ')',
 singlebond:  jchemhub.io.smiles.BondType.SINGLE_BOND,
 doublebond:  jchemhub.io.smiles.BondType.DOUBLE_BOND,
 triplebond:  jchemhub.io.smiles.BondType.TRIPLE_BOND,
 quadbond:    jchemhub.io.smiles.BondType.QUAD_BOND,
 aromaticbond:jchemhub.io.smiles.BondType.AROMATIC_BOND,
 ringclosure: '%',
 cis:         '/',
 trans:       '\\',
};

jchemhub.io.smiles.smiPattern =  new RegExp(/\[[^[]+\]|Br|B|Cl|C|N|F|O|P]|S|c|n|o|s|-|=|#|%[0-9][0-9]|[0-9]|\(|\)|./g);
jchemhub.io.smiles.atomPattern = new RegExp(/^\[([0-9]*)([A-Z][a-z]?|c|n|o|se|s|as)(@|@@)?(H)?([0-9])?([+-][\d]?)?\]$/);
jchemhub.io.smiles.specialAtoms = { C:1, c:1, N:1, n:1, O:1, o:1, S:1, s:1, P:1, F:1, Br:1, Cl:1, I:1, B:1 };
jchemhub.io.smiles.aromaticAtoms = { c:1, n:1, o:1, s:1, as:1, se:1 };

jchemhub.io.smiles.parse = function (smi) {
	items = smi.match(this.smiPattern);
	//console.log(items);
	//console.log(smi);
	var mol = new jchemhub.model.Molecule(smi);
	var natoms = 0;
	var previous_atom;
	var bond_type = jchemhub.io.smiles.BondType.NONE;
	var bond_stereo = jchemhub.io.smiles.BondStereo.NONE;
	var branch = new Array();
	var ring   = new Array();
	var errstr = "";
	for (var i in items) {
		var item = items[i];
		if (item == this.punctuation.nobond) {
		} else if (item == this.punctuation.openbranch) {
			branch.push(previous_atom);
		} else if (item == this.punctuation.closebranch) {
			if (branch.length) {
				previous_atom = branch.pop();
			} else {
				errstr = " unbalanced parens";
			}
		} else if (item == this.punctuation.singlebond) {
			bond_type = jchemhub.io.smiles.BondType.SINGLE_BOND;
		} else if (item == this.punctuation.doublebond) {
			bond_type = jchemhub.io.smiles.BondType.DOUBLE_BOND;
		} else if (item == this.punctuation.triplebond) {
			bond_type = jchemhub.io.smiles.BondType.TRIPLE_BOND;
		} else if (item == this.punctuation.quadbond) {
			bond_type = jchemhub.io.smiles.BondType.QUAD_BOND;
		} else if (item == this.punctuation.aromaticbond) {
			bond_type = jchemhub.io.smiles.BondType.AROMATIC_BOND
		} else if (item[0] == this.punctuation.ringclosure) {
			ringid = parseInt(item[1]+item[2]);
			ring_atom = ring[ringid];
			if (ring_atom) {
				//var bond_stereo = jchemhub.io.smiles.BondStereo.NONE;
				mol.addBond(this.createBond(bond_type, bond_stereo, previous_atom, ring_atom));
				bond_type = jchemhub.io.smiles.BondType.NONE;
				bond_stereo = jchemhub.io.smiles.BondStereo.NONE;
				ring[ringid] = null;
			} else {
				ring[ringid] = previous_atom;
			}
		} else if (item == this.punctuation.cis) {
		} else if (item == this.punctuation.trans) {
 		} else if (!isNaN(ringid = parseInt(item))) {
			ring_atom = ring[ringid];
			if (ring_atom) {
				//var bond_stereo = jchemhub.io.smiles.BondStereo.NONE;
				mol.addBond(this.createBond(bond_type, bond_stereo, previous_atom, ring_atom));
				bond_type = jchemhub.io.smiles.BondType.NONE;
				bond_stereo = jchemhub.io.smiles.BondStereo.NONE;
				ring[ringid] = null;
			} else {
				ring[ringid] = previous_atom;
			}
		} else {
  			smi_atom = this.parseAtom(item);
  			if (smi_atom.symbol) {
				natoms += 1;
				var atom = new jchemhub.model.Atom(smi_atom.symbol,0,0,smi_atom.charge,smi_atom.aromatic,smi_atom.isotope);
				if (previous_atom) {
					//var bond_stereo = jchemhub.io.smiles.BondStereo.NONE;
					//if (smi_atom.stereo) bond_stereo = smi_atom.stereo;
					mol.addBond(this.createBond(bond_type, bond_stereo, previous_atom, atom));
					bond_type = jchemhub.io.smiles.BondType.NONE;
					bond_stereo = jchemhub.io.smiles.BondStereo.NONE;
				}
				mol.addAtom(atom);
				bond_stereo = smi_atom.stereo; // bond to next atom specified in this atom spec
				previous_atom = atom;
			} else {
				errstr =  " unknown atom " + item;
			}
		}
		if (errstr) {
			throw new Error(smi + errstr);
			break;
		}
	}
	//console.log(natoms + " atoms");
	if (this.sanityCheck(branch, ring, bond_type, bond_stereo)) {
		return mol;
	} else {
		return null;
	}
};

jchemhub.io.smiles.sanityCheck = function (branch, ring, bond_type, bond_stereo) {
	if (branch.length) {
		throw new Error(smi + " unbalanced parens");
		return false;
	}
	for (var i=0; i<ring.length; ++i) {
		if (ring[i]) {
			throw new Error(smi + " unclosed rings");
			return false;
		}
	}
	if (bond_type != this.BondType.NONE) {
		throw new Error(smi + " unpaired bond " + bond_type);
		return false;
	}
	/*
	if (bond_stereo != this.BondStereo.NONE) {
		throw new Error(smi + " unpaired stereo " + bond_stereo);
		return false;
	}
	*/
	return true;
};

jchemhub.io.smiles.parseAtom = function (item) {
  var atom = {isotope:null, symbol:null, stereo:jchemhub.io.smiles.BondStereo.NONE, hcount:null, charge:null, aromatic:false};
  var atomProp = this.atomPattern.exec(item);
  if (atomProp) {
    atom.isotope = atomProp[1];

    // periodicTable has entries for c,n,o,s,as,se
    if (this.periodicTable[atomProp[2]]) atom.symbol = atomProp[2];
    
    if (atomProp[3] == jchemhub.io.smiles.BondStereo.CLOCKWISE) {
	    atom.stereo = atomProp[3];
	} else if (atomProp[3] == jchemhub.io.smiles.BondStereo.COUNTER_CLOCKWISE) {
	    atom.stereo = atomProp[3]; 
	} else {
		atom.stereo = jchemhub.io.smiles.BondStereo.NONE;
	}
    
    if (atomProp[4] == 'H') {
      if (atomProp[5]) {
        atom.hcount = atomProp[5];
      } else {
        atom.hcount = 1;
      }
    }
    
    if (atomProp[6] == "+") {
      atom.charge = 1;
    } else if (atomProp[6] == "-") {
      atom.charge = -1;
    } else {
      atom.charge = parseInt(atomProp[6]);
    }
  
    } else {
    if (this.specialAtoms[item]) {
      atom.symbol = item;
    }
  }
  if (this.aromaticAtoms[atom.symbol]) {
	  atom.aromatic = true;
	  if (atom.symbol.length == 1) {
		  atom.symbol = atom.symbol.toUpperCase();
	  } else {
		  atom.symbol = atom.symbol[0].toUpperCase() + atom.symbol[1];
	  }
  }
  return atom;
};

/**
 * factory method for bonds
 *
 * @param{jchemhub.io.smiles.BondType}type bond-type code
 * @param{jchemhub.io.smiles.BondStereo}stereo stereo-type code
 * @param{jchemhub.model.Atom} source atom at source end of bond
 * @param{jchemhub.model.Atom} target atom at target end of bond
 *
 * @return{jchemhub.model.Bond}
 */
jchemhub.io.smiles.createBond = function(type, stereo, source, target) {
		var atype = type;
		if (type == jchemhub.io.smiles.BondType.NONE) {
			if (source.aromatic && target.aromatic) {
				atype = jchemhub.io.smiles.BondType.AROMATIC_BOND;
			} else {
				atype = jchemhub.io.smiles.BondType.SINGLE_BOND;
			}
		}
        switch (atype) {
        
        case jchemhub.io.smiles.BondType.SINGLE_BOND:
                switch (stereo) {
                case jchemhub.io.smiles.BondStereo.CLOCKWISE:
                        return new jchemhub.model.SingleBondUp(source, target);
                case jchemhub.io.smiles.BondStereo.COUNTER_CLOCKWISE:
                        return new jchemhub.model.SingleBondDown(source, target);
                case jchemhub.io.smiles.BondStereo.NONE:
                        return new jchemhub.model.SingleBond(source, target);
                default:
                        throw new Error("invalid bond type/stereo [" + type + "]/["
                                        + stereo + "]");
                };
        case jchemhub.io.smiles.BondType.DOUBLE_BOND:
                return new jchemhub.model.DoubleBond(source, target);
        case jchemhub.io.smiles.BondType.TRIPLE_BOND:
                return new jchemhub.model.TripleBond(source, target);
        case jchemhub.io.smiles.BondType.AROMATIC_BOND:
                return new jchemhub.model.AromaticBond(source, target);
        case jchemhub.io.smiles.BondType.ANY:
        default:
                throw new Error("invalid bond type/stereo [" + type + "]/[" + stereo
                                + "]");
        };
};

jchemhub.io.smiles.periodicTable = {
H:{"number":1, "name":"Hydrogen"},
He:{"number":2, "name":"Helium"},
Li:{"number":3, "name":"Lithium"},
Be:{"number":4, "name":"Beryllium"},
B:{"number":5, "name":"Boron"},
C:{"number":6, "name":"Carbon"},
c:{"number":6, "name":"Carbon"},
N:{"number":7, "name":"Nitrogen"},
n:{"number":7, "name":"Nitrogen"},
O:{"number":8, "name":"Oxygen"},
o:{"number":8, "name":"Oxygen"},
F:{"number":9, "name":"Fluorine"},
Ne:{"number":10, "name":"Neon"},
Na:{"number":11, "name":"Sodium"},
Mg:{"number":12, "name":"Magnesium"},
Al:{"number":13, "name":"Aluminium"},
Si:{"number":14, "name":"Silicon"},
P:{"number":15, "name":"Phosphorus"},
S:{"number":16, "name":"Sulfur"},
s:{"number":16, "name":"Sulfur"},
Cl:{"number":17, "name":"Chlorine"},
Ar:{"number":18, "name":"Argon"},
K:{"number":19, "name":"Potassium"},
Ca:{"number":20, "name":"Calcium"},
Sc:{"number":21, "name":"Scandium"},
Ti:{"number":22, "name":"Titanium"},
V:{"number":23, "name":"Vanadium"},
Cr:{"number":24, "name":"Chromium"},
Mn:{"number":25, "name":"Manganese"},
Fe:{"number":26, "name":"Iron"},
Co:{"number":27, "name":"Cobalt"},
Ni:{"number":28, "name":"Nickel"},
Cu:{"number":29, "name":"Copper"},
Zn:{"number":30, "name":"Zinc"},
Ga:{"number":31, "name":"Gallium"},
Ge:{"number":32, "name":"Germanium"},
As:{"number":33, "name":"Arsenic"},
as:{"number":33, "name":"Arsenic"},
Se:{"number":34, "name":"Selenium"},
se:{"number":34, "name":"Selenium"},
Br:{"number":35, "name":"Bromine"},
Kr:{"number":36, "name":"Krypton"},
Rb:{"number":37, "name":"Rubidium"},
Sr:{"number":38, "name":"Strontium"},
Y:{"number":39, "name":"Yttrium"},
Zr:{"number":40, "name":"Zirconium"},
Nb:{"number":41, "name":"Niobium"},
Mo:{"number":42, "name":"Molybdenum"},
Tc:{"number":43, "name":"Technetium"},
Ru:{"number":44, "name":"Ruthenium"},
Rh:{"number":45, "name":"Rhodium"},
Pd:{"number":46, "name":"Palladium"},
Ag:{"number":47, "name":"Silver"},
Cd:{"number":48, "name":"Cadmium"},
In:{"number":49, "name":"Indium"},
Sn:{"number":50, "name":"Tin"},
Sb:{"number":51, "name":"Antimony"},
Te:{"number":52, "name":"Tellurium"},
I:{"number":53, "name":"Iodine"},
Xe:{"number":54, "name":"Xenon"},
Cs:{"number":55, "name":"Caesium"},
Ba:{"number":56, "name":"Barium"},
La:{"number":57, "name":"Lanthanum"},
Ce:{"number":58, "name":"Cerium"},
Pr:{"number":59, "name":"Praseodymium"},
Nd:{"number":60, "name":"Neodymium"},
Pm:{"number":61, "name":"Promethium"},
Sm:{"number":62, "name":"Samarium"},
Eu:{"number":63, "name":"Europium"},
Gd:{"number":64, "name":"Gadolinium"},
Tb:{"number":65, "name":"Terbium"},
Dy:{"number":66, "name":"Dysprosium"},
Ho:{"number":67, "name":"Holmium"},
Er:{"number":68, "name":"Erbium"},
Tm:{"number":69, "name":"Thulium"},
Yb:{"number":70, "name":"Ytterbium"},
Lu:{"number":71, "name":"Lutetium"},
Hf:{"number":72, "name":"Hafnium"},
Ta:{"number":73, "name":"Tantalum"},
W:{"number":74, "name":"Tungsten"},
Re:{"number":75, "name":"Rhenium"},
Os:{"number":76, "name":"Osmium"},
Ir:{"number":77, "name":"Iridium"},
Pt:{"number":78, "name":"Platinum"},
Au:{"number":79, "name":"Gold"},
Hg:{"number":80, "name":"Mercury"},
Tl:{"number":81, "name":"Thallium"},
Pb:{"number":82, "name":"Lead"},
Bi:{"number":83, "name":"Bismuth"},
Po:{"number":84, "name":"Polonium"},
At:{"number":85, "name":"Astatine"},
Rn:{"number":86, "name":"Radon"},
Fr:{"number":87, "name":"Francium"},
Ra:{"number":88, "name":"Radium"},
Ac:{"number":89, "name":"Actinium"},
Th:{"number":90, "name":"Thorium"},
Pa:{"number":91, "name":"Protactinium"},
U:{"number":92, "name":"Uranium"},
Np:{"number":93, "name":"Neptunium"},
Pu:{"number":94, "name":"Plutonium"},
Am:{"number":95, "name":"Americium"},
Cm:{"number":96, "name":"Curium"},
Bk:{"number":97, "name":"Berkelium"},
Cf:{"number":98, "name":"Californium"},
Es:{"number":99, "name":"Einsteinium"},
Fm:{"number":100, "name":"Fermium"},
Md:{"number":101, "name":"Mendelevium"},
No:{"number":102, "name":"Nobelium"},
Lr:{"number":103, "name":"Lawrencium"},
Rf:{"number":104, "name":"Rutherfordium"},
Db:{"number":105, "name":"Dubnium"},
Sg:{"number":106, "name":"Seaborgium"},
Bh:{"number":107, "name":"Bohrium"},
Hs:{"number":108, "name":"Hassium"},
Mt:{"number":109, "name":"Meitnerium"},
Ds:{"number":110, "name":"Darmstadtium"},
Rg:{"number":111, "name":"Roentgenium"},
Cn:{"number":112, "name":"Copernicium"},
};
