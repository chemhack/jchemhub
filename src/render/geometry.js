goog.provide('chem.render.Geometry');

/**
 * Static method for calculating geometry center
 * @param {chem.core.Molecule} mol Molecule to calculate geometry center.
 */

chem.render.Geometry.getGeometryCenter=function(mol){
        var totalX=0;
        var totalY=0;
		var atomCount=mol.countAtoms()
        for(var i=0;i<atomCount;i++){
            var atom = mol.getAtom(i);
            totalX+=atom.x;
            totalY+=atom.y;
        }
		return {x:(totalX/atomCount),y:(totalY/atomCount)};
}
