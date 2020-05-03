// (C) Wolfgang Huber 2010-2011

// Script parameters - these are set up by R in the function 'writeReport' when copying the 
//   template for this script from arrayQualityMetrics/inst/scripts into the report.

var highlightInitial = [ false, false, false, false, false, true, false, false, false, false, false, false ];
var arrayMetadata    = [ [ "1", "WT.sham.1", "Wild-type CA1 /sham, biological rep1", "CA1 sample from wild-type mouse brain in sham group", "genotype: wild-type", "group: sham", "Gene expression data from wild-type sham mouse brain", "wild-type", "sham" ], [ "2", "WT.sham.2", "Wild-type CA1 /sham, biological rep2", "CA1 sample from wild-type mouse brain in sham group", "genotype: wild-type", "group: sham", "Gene expression data from wild-type sham mouse brain", "wild-type", "sham" ], [ "3", "WT.sham.3", "Wild-type CA1 /sham, biological rep3", "CA1 sample from wild-type mouse brain in sham group", "genotype: wild-type", "group: sham", "Gene expression data from wild-type sham mouse brain", "wild-type", "sham" ], [ "4", "WT.isc.1", "Wild-type CA1 /ischemia, biological rep1", "CA1 sample from wild-type mouse brain in ischemia group", "genotype: wild-type", "group: ischemia", "Gene expression data from wild-type ischemia mouse brain", "wild-type", "ischemia" ], [ "5", "WT.isc.2", "Wild-type CA1 /ischemia, biological rep2", "CA1 sample from wild-type mouse brain in ischemia group", "genotype: wild-type", "group: ischemia", "Gene expression data from wild-type ischemia mouse brain", "wild-type", "ischemia" ], [ "6", "WT.isc.3", "Wild-type CA1 /ischemia, biological rep3", "CA1 sample from wild-type mouse brain in ischemia group", "genotype: wild-type", "group: ischemia", "Gene expression data from wild-type ischemia mouse brain", "wild-type", "ischemia" ], [ "7", "Trans.sham.1", "transgenic CA1 /sham, biological rep1", "CA1 sample from SUMO-KD transgenic mouse brain in sham group", "genotype: SUMO-KD", "group: sham", "Gene expression data from SUMO-KD sham mouse brain", "SUMO-KD", "sham" ], [ "8", "Trans.sham.2", "transgenic  CA1 /sham, biological rep2", "CA1 sample from SUMO-KD transgenic mouse brain in sham group", "genotype: SUMO-KD", "group: sham", "Gene expression data from SUMO-KD sham mouse brain", "SUMO-KD", "sham" ], [ "9", "Trans.sham.3", "transgenic  CA1 /sham, biological rep3", "CA1 sample from SUMO-KD transgenic mouse brain in sham group", "genotype: SUMO-KD", "group: sham", "Gene expression data from SUMO-KD sham mouse brain", "SUMO-KD", "sham" ], [ "10", "Trans.isc.1", "transgenic CA1 /ischemia, biological rep1", "CA1 sample from SUMO-KD transgenic mouse brain in ischemia group", "genotype: SUMO-KD", "group: ischemia", "Gene expression data from SUMO-KD ischemia mouse brain", "SUMO-KD", "ischemia" ], [ "11", "Trans.isc.2", "transgenic  CA1 /ischemia, biological rep2", "CA1 sample from SUMO-KD transgenic mouse brain in ischemia group", "genotype: SUMO-KD", "group: ischemia", "Gene expression data from SUMO-KD ischemia mouse brain", "SUMO-KD", "ischemia" ], [ "12", "Trans.isc.3", "transgenic CA1 /ischemia, biological rep3", "CA1 sample from SUMO-KD transgenic mouse brain in ischemia group", "genotype: SUMO-KD", "group: ischemia", "Gene expression data from SUMO-KD ischemia mouse brain", "SUMO-KD", "ischemia" ] ];
var svgObjectNames   = [ "pca", "dens" ];

var cssText = ["stroke-width:1; stroke-opacity:0.4",
               "stroke-width:3; stroke-opacity:1" ];

// Global variables - these are set up below by 'reportinit'
var tables;             // array of all the associated ('tooltips') tables on the page
var checkboxes;         // the checkboxes
var ssrules;


function reportinit() 
{
 
    var a, i, status;

    /*--------find checkboxes and set them to start values------*/
    checkboxes = document.getElementsByName("ReportObjectCheckBoxes");
    if(checkboxes.length != highlightInitial.length)
	throw new Error("checkboxes.length=" + checkboxes.length + "  !=  "
                        + " highlightInitial.length="+ highlightInitial.length);
    
    /*--------find associated tables and cache their locations------*/
    tables = new Array(svgObjectNames.length);
    for(i=0; i<tables.length; i++) 
    {
        tables[i] = safeGetElementById("Tab:"+svgObjectNames[i]);
    }

    /*------- style sheet rules ---------*/
    var ss = document.styleSheets[0];
    ssrules = ss.cssRules ? ss.cssRules : ss.rules; 

    /*------- checkboxes[a] is (expected to be) of class HTMLInputElement ---*/
    for(a=0; a<checkboxes.length; a++)
    {
	checkboxes[a].checked = highlightInitial[a];
        status = checkboxes[a].checked; 
        setReportObj(a+1, status, false);
    }

}


function safeGetElementById(id)
{
    res = document.getElementById(id);
    if(res == null)
        throw new Error("Id '"+ id + "' not found.");
    return(res)
}

/*------------------------------------------------------------
   Highlighting of Report Objects 
 ---------------------------------------------------------------*/
function setReportObj(reportObjId, status, doTable)
{
    var i, j, plotObjIds, selector;

    if(doTable) {
	for(i=0; i<svgObjectNames.length; i++) {
	    showTipTable(i, reportObjId);
	} 
    }

    /* This works in Chrome 10, ssrules will be null; we use getElementsByClassName and loop over them */
    if(ssrules == null) {
	elements = document.getElementsByClassName("aqm" + reportObjId); 
	for(i=0; i<elements.length; i++) {
	    elements[i].style.cssText = cssText[0+status];
	}
    } else {
    /* This works in Firefox 4 */
    for(i=0; i<ssrules.length; i++) {
        if (ssrules[i].selectorText == (".aqm" + reportObjId)) {
		ssrules[i].style.cssText = cssText[0+status];
		break;
	    }
	}
    }

}

/*------------------------------------------------------------
   Display of the Metadata Table
  ------------------------------------------------------------*/
function showTipTable(tableIndex, reportObjId)
{
    var rows = tables[tableIndex].rows;
    var a = reportObjId - 1;

    if(rows.length != arrayMetadata[a].length)
	throw new Error("rows.length=" + rows.length+"  !=  arrayMetadata[array].length=" + arrayMetadata[a].length);

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = arrayMetadata[a][i];
}

function hideTipTable(tableIndex)
{
    var rows = tables[tableIndex].rows;

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = "";
}


/*------------------------------------------------------------
  From module 'name' (e.g. 'density'), find numeric index in the 
  'svgObjectNames' array.
  ------------------------------------------------------------*/
function getIndexFromName(name) 
{
    var i;
    for(i=0; i<svgObjectNames.length; i++)
        if(svgObjectNames[i] == name)
	    return i;

    throw new Error("Did not find '" + name + "'.");
}


/*------------------------------------------------------------
  SVG plot object callbacks
  ------------------------------------------------------------*/
function plotObjRespond(what, reportObjId, name)
{

    var a, i, status;

    switch(what) {
    case "show":
	i = getIndexFromName(name);
	showTipTable(i, reportObjId);
	break;
    case "hide":
	i = getIndexFromName(name);
	hideTipTable(i);
	break;
    case "click":
        a = reportObjId - 1;
	status = !checkboxes[a].checked;
	checkboxes[a].checked = status;
	setReportObj(reportObjId, status, true);
	break;
    default:
	throw new Error("Invalid 'what': "+what)
    }
}

/*------------------------------------------------------------
  checkboxes 'onchange' event
------------------------------------------------------------*/
function checkboxEvent(reportObjId)
{
    var a = reportObjId - 1;
    var status = checkboxes[a].checked;
    setReportObj(reportObjId, status, true);
}


/*------------------------------------------------------------
  toggle visibility
------------------------------------------------------------*/
function toggle(id){
  var head = safeGetElementById(id + "-h");
  var body = safeGetElementById(id + "-b");
  var hdtxt = head.innerHTML;
  var dsp;
  switch(body.style.display){
    case 'none':
      dsp = 'block';
      hdtxt = '-' + hdtxt.substr(1);
      break;
    case 'block':
      dsp = 'none';
      hdtxt = '+' + hdtxt.substr(1);
      break;
  }  
  body.style.display = dsp;
  head.innerHTML = hdtxt;
}
