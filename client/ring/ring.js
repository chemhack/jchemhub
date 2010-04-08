/*
 * Licence TODO
 * Copyright (c) 2010 Mark Rijnbeek (markr@ebi.ac.uk)
 *
 * Ring
 *
 */
goog.provide('chem.ring.Ring');

goog.require('goog.array');
goog.require('goog.structs.Map');

//_____________________________________________________________________________
// Ring
//_____________________________________________________________________________
/**
 * Creates a new Ring
 * @constructor
 */
chem.ring.Ring=function(_atoms,_bonds)
{
    this.atoms=_atoms;
    this.bonds=_bonds;

    var avgX=0;
	var avgY=0;
    for (var j = 0, jl = _atoms.length; j < jl; j++) {
        avgX += _atoms[j].x;
        avgY += _atoms[j].y;
    }
    this.ringCenter=new Array(avgX/_atoms.length,avgY/_atoms.length);
}
