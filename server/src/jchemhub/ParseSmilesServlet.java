package jchemhub;

import net.sf.json.JSONObject;
import org.openscience.cdk.DefaultChemObjectBuilder;
import org.openscience.cdk.aromaticity.CDKHueckelAromaticityDetector;
import org.openscience.cdk.exception.CDKException;
import org.openscience.cdk.interfaces.IMolecule;
import org.openscience.cdk.io.MDLWriter;
import org.openscience.cdk.layout.StructureDiagramGenerator;
import org.openscience.cdk.smiles.SmilesParser;
import org.openscience.cdk.tools.manipulator.AtomContainerManipulator;

import java.io.IOException;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

public class ParseSmilesServlet extends javax.servlet.http.HttpServlet {
    protected void doPost(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
    //NO POST
    }

    protected void doGet(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        String callback=request.getParameter("callback");
        String smiles=request.getParameter("smiles");
        Map map = new HashMap();
        try {
            SmilesParser sp = new SmilesParser(DefaultChemObjectBuilder.getInstance());
            StructureDiagramGenerator sdg = new StructureDiagramGenerator();
            IMolecule molecule = sp.parseSmiles(smiles);
            AtomContainerManipulator.percieveAtomTypesAndConfigureAtoms(molecule);
            CDKHueckelAromaticityDetector.detectAromaticity(molecule);
            
            sdg.setMolecule(molecule);
            sdg.generateCoordinates();
            molecule = sdg.getMolecule();

            StringWriter stringWriter=new StringWriter();
            MDLWriter mdlWriter = new MDLWriter(stringWriter);
            mdlWriter.write(molecule);
            mdlWriter.close();
            map.put( "molfile", stringWriter.toString());
        }  catch (Exception e) {
            e.printStackTrace();
            map.put("exception",e.toString());
        }
        JSONObject jsonObject = JSONObject.fromObject( map );
        System.out.println(jsonObject);
        response.setContentType("text/javascript");
        response.getWriter().write(callback+"("+jsonObject+");");
    }
}
