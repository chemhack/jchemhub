/*
 * Licence TODO
 * Copyright (c) 2010 Mark Rijnbeek (markr@ebi.ac.uk)
 *
 * Ring
 *
 */
goog.provide('jchemhub.ring.Ring');

goog.require('goog.array');
goog.require('goog.structs.Map');

//_____________________________________________________________________________
// Ring
//_____________________________________________________________________________
/**
 * Creates a new Ring
 * @constructor
 */
jchemhub.ring.Ring=function(_atoms,_bonds)
{
    this.atoms=_atoms;
    this.bonds=_bonds;

    var avgX=0;
	var avgY=0;
    for (var j = 0, jl = _atoms.length; j < jl; j++) {
        avgX += _atoms[j].coord.x;
        avgY += _atoms[j].coord.y;
    }
    this.ringCenter=new goog.math.Coordinate(avgX/_atoms.length, avgY/_atoms.length);
}
