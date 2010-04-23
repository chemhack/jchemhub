goog.provide('jchemhub.model.Bond');

/**
 * Creates a new Bond.
 * @constructor
 */
jchemhub.model.Bond=function(sourceAtom,targetAtom,bondType)
{
    this.source=sourceAtom;
    this.target=targetAtom;
	this.bondType=bondType;
	this.stereoType=jchemhub.model.Bond.StereoType.NoStereo;
};



/**
 * Bond Types, values in molfile spec. Values 4 through 8 are for SSS queries only.
 */
jchemhub.model.Bond.BondType={
	Single:1,
	Double:2,
	Triple:3,
	Aromatic:4,
	SingleOrDouble:5,
	SingleOrAromatic:6,
	DoubleOrAromatic:7,
	Any:8
};

/**
 * Bond StereoTypes, values in molfile spec. 
 */
jchemhub.model.Bond.StereoType={
	Single:{
		NotStereo:0,
		Up:1,
		Down:6,
		Either:4	
	},
	Double:{
		DetectByCoords:0,
		Either:	3		
	}
};
