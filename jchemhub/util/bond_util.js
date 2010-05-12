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

goog.provide('jchemhub.util.BondUtil');
goog.provide('jchemhub.util.BondUtil.Orders');

goog.require('jchemhub.model.Atom');
goog.require('jchemhub.model.PseudoAtom');
goog.require('jchemhub.model.Bond');
goog.require('jchemhub.model.SingleBond');
goog.require('jchemhub.model.DoubleBond');
goog.require('jchemhub.model.TripleBond');
goog.require('jchemhub.model.QuadrupleBond');


jchemhub.util.BondUtil = function(){
}

/*
 * Return a bond of the correct subclass given the input arguments.
 * TODO: extend with stereo types.
 */
jchemhub.util.BondUtil.getBond = function(atom1, atom2, bondOrder){
    bond=null;
    switch (bondOrder) {
        case jchemhub.util.BondUtil.Orders.SINGLE:
            bond = new jchemhub.model.SingleBond(atom1,atom2);
            break;
        case jchemhub.util.BondUtil.Orders.DOUBLE:
            bond = new jchemhub.model.DoubleBond(atom1,atom2);
            break;
        case jchemhub.util.BondUtil.Orders.TRIPLE:
            bond = new jchemhub.model.TripleBond(atom1,atom2);
            break;
        case jchemhub.util.BondUtil.Orders.QUADRUPLE:
            bond = new jchemhub.model.QuadrupleBond(atom1,atom2);
            break;
    }
    return bond;
}


/**
 * Bond orders to map to bond type subclasses
 * @enum {number}
 */
jchemhub.util.BondUtil.Orders = {
        SINGLE :1,
        DOUBLE :2,
        TRIPLE :3,
        QUADRUPLE :4
};
