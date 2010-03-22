goog.provide('chem.render.Geometry');
goog.require('goog.graphics'); 	

/**
 * @fileoverview Ported from CDK's GeometryTool
 *
 */


/**
 * Calculates the center of the given atoms and returns it as a object.
 * Use return value by result.x and result.y
 * 
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

/**
 * Returns the minimum and maximum X and Y coordinates of the atoms in the Molecule
 * Use return value by result.minX, result.maxX, result.minY and result.maxY
 * 
 * @param {chem.core.Molecule} mol Molecule to calculate maximum X and Y.
 */

chem.render.Geometry.getMinMax = function(mol){
	var obj={
		minX:Number.MAX_VALUE,
		maxX:-Number.MAX_VALUE,
		minY:Number.MAX_VALUE,
		maxY:-Number.MAX_VALUE	
	}
	for(var i=0,il=mol.countAtoms();i<il;i++){
		var atom = mol.getAtom(i);
		if(atom.x>obj.maxX){
			obj.maxX=atom.x;
		}
		if(atom.x<obj.minX){
			obj.minX=atom.x;
		}
		if(atom.y>obj.maxY){
			obj.maxY=atom.y;
		}
		if(atom.y<obj.minY){
			obj.minY=atom.y;
		}
	}
	return obj;
}

/**
 * Translates the given molecule by the given x and y.
 * 
 * @param {chem.core.Molecule} mol Molecule to translate.
 * @param {number} transX translation in x direction
 * @param {number} transY translation in y direction
 */

chem.render.Geometry.translate2D=function(mol,transX,transY){
	for (var i = 0, il = mol.countAtoms(); i < il; i++) {
		var atom = mol.getAtom(i);
		atom.x+=transX;
		atom.y+=transY;
	}
}

/*
 * TODO: To migrate
 *  public static void center(Molecule molecule, Dimension areaDim) {
        Dimension molDim = get2DDimension(molecule);
        int transX = (areaDim.width - molDim.width) / 2;
        int transY = (areaDim.height - molDim.height) / 2;
        translateAllPositive(molecule);
        translate2D(molecule, transX, transY);
    }
    public static Dimension get2DDimension(Molecule molecule) {
        double[] minmax = getMinMax(molecule);
        double maxX = minmax[2];
        double maxY = minmax[3];
        double minX = minmax[0];
        double minY = minmax[1];
        return new Dimension((int) (maxX - minX + 1), (int) (maxY - minY + 1));
    }
 */

/**
 *  Adds an automatically calculated offset to the coordinates of all atoms
 *  such that all coordinates are positive and the smallest x or y coordinate
 *  is exactly zero.
 *
 *	@param {chem.core.Molecule} mol Molecule for which all the atoms are translated to positive coordinates
 */

chem.render.Geometry.translateAllPositive=function(mol){
		var minX=Number.MAX_VALUE,minY=Number.MAX_VALUE;
		for(var i=0,il=mol.countAtoms();i<il;i++){
			var atom = mol.getAtom(i);	
			if (atom.x < minX) {
                minX = atom.x;
            }
            if (atom.y < minY) {
                minY = atom.y;
            }
		}
		chem.render.Geometry.translate2D(mol, minX * -1, minY * -1);
}   

/**
 *  Adds an automatically calculated offset to the coordinates of all atoms
 *  such that all coordinates are positive and the smallest x or y coordinate
 *  is exactly zero.
 *	TODO:params docs
 *	@param {chem.core.Molecule} mol Molecule to createTransform
 */
chem.render.Geometry.createTransform=function(mol,renderParams){
	var minMax=chem.render.Geometry.getMinMax(mol);
/*		
	console.debug("maxX:"+minMax.maxX);
	console.debug("minX:"+minMax.minX);
	console.debug("maxY:"+minMax.maxY);
	console.debug("minY:"+minMax.minY);
*/
	var factor = renderParams.zoomFactor * (1.0 - renderParams.margin * 2.0);
/*		
	console.debug("factor:"+factor);
*/
	var contextBounds={
		width:minMax.maxX - minMax.minX,
		height:minMax.maxY - minMax.minY
	}
/*		
	console.debug("contextBounds.width:"+contextBounds.width);
	console.debug("contextBounds.height:"+contextBounds.height);
*/
	var canvasSize=renderParams.canvasSize;
    var transform = new goog.graphics.AffineTransform();

	var scaleX = factor * canvasSize.width / contextBounds.width;
   	var scaleY = factor * canvasSize.height / contextBounds.height;

/*		
	console.debug("scaleX:"+scaleX);
	console.debug("scaleY:"+scaleY);
*/
    var scale=Math.min(scaleX,scaleY);
	transform.scale(scale, -scale);
	
    var dx = minMax.minX * scale + 0.5 * (canvasSize.width - contextBounds.width * scale);
    var dy = minMax.minY * scale - 0.5 * (canvasSize.height + contextBounds.width * scale);
	transform.translate(dx / scale, dy / scale);

/*		
	console.debug("dx:"+dx);
	console.debug("dy:"+dy);
*/

	//Extend goog.graphics.AffineTransform to transform point directly
	if (goog.graphics.AffineTransform.prototype.transformPoint == undefined) {
		goog.graphics.AffineTransform.prototype.transformPoint = function(x, y){
			var srcPt = [x, y];
			var dstPt = [];
			transform.transform(srcPt, 0, dstPt, 0, 1);
			//TODO optimaze performance by calling matrix directly
			return {
				x: dstPt[0],
				y: dstPt[1]
			};
		};
	};
	return transform;
}   
