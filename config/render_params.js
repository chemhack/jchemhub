goog.provide('jchemhub.config.RenderParams');

goog.require("goog.graphics");
goog.require('goog.graphics.SolidFill');
goog.require('goog.graphics.Stroke');
goog.require('goog.graphics.Font');

jchemhub.config.RenderParams=function(){

};

jchemhub.config.RenderParams.get=function(){
	return jchemhub.config.RenderParams.defaultValue;
	//TODO implement config persistence with cookies
}
jchemhub.config.RenderParams.defaultValue = {
    zoomFactor: 0.8,
    margin: 0.05,
    bondDistance:3,
    showExplicitHydrogens:true,
    showImplicitHydrogens:true,
    drawEndCarbon:true,
    backgroundFill:new goog.graphics.SolidFill('#F0FFF0'),
    bondStroke:new goog.graphics.Stroke(2, 'black'),
    upBondStroke:new goog.graphics.Stroke(1, 'black'),
    upBondFill:new goog.graphics.SolidFill('black'),
    downBondStroke:new goog.graphics.Stroke(1, 'black'),
    downBondFill:null,
    upOrDownBondStroke:new goog.graphics.Stroke(1, 'black'),
    upOrDownBondFill:null,    
    bondHighlightStroke:new goog.graphics.Stroke(2, 'blue'),
    atomFont:new goog.graphics.Font(0, 'Times'),     //Font size is dynamic
    atomSubFont:new goog.graphics.Font(0, 'Times'), //Font size is dynamic
    atomLabelStroke:null,
    atomLabelFill:{"C":new goog.graphics.SolidFill('black'),
        "N":new goog.graphics.SolidFill('blue'),
        "O":new goog.graphics.SolidFill('red')
    },
    atomTransparentCircleSize:9,
    atomHighlightStroke:new goog.graphics.Stroke(2, 'blue'),
    transparentFill:new goog.graphics.SolidFill('blue', 0.00001) //This is a closure library bug. Transparent can not set to zero. I've submitted a patch, waiting for their fix.
};
