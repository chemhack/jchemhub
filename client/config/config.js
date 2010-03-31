goog.provide('chem.config.RenderParams');

chem.config.RenderParams=function(){

};

chem.config.RenderParams.get=function(){
	return chem.config.RenderParams.defaultValue;
	//TODO implement config persistence with cookies
}
chem.config.RenderParams.defaultValue= {
        zoomFactor: 0.8,
        margin: 0.05,
		bondDistance:3,
		showExplicitHydrogens:true,
		showImplicitHydrogens:false,
		drawEndCarbon:true,
		backgroundFill:new goog.graphics.SolidFill('white'),
		bondStroke:new goog.graphics.Stroke(2, 'black'),
		bondHighlightStroke:new goog.graphics.Stroke(2, 'blue'),
		atomFont:new goog.graphics.Font(10, 'Times'),
		atomLabelStroke:null,
		atomLabelFill:new goog.graphics.SolidFill('black'),
		atomTransparentCircleSize:9,
		atomHighlightStroke:new goog.graphics.Stroke(2, 'blue'),
		transparentFill:new goog.graphics.SolidFill('blue',0.00001) //This is a closure library bug. Transparent can not set to zero. I've submitted a patch, waiting for their fix.
};
