var scormVersion = g_scorm_version;
var SCORM_findAPITries = 0;
var SCORM_objAPI = null;
var windowObjectToFind = "";
if(scormVersion == "12")
{
windowObjectToFind = "API";
}else{
windowObjectToFind ="API_1484_11";
}
/*******************************************************************************
**
** FileName: APIWrapper.js
**
*******************************************************************************/

/*******************************************************************************
**
** Concurrent Technologies Corporation (CTC) grants you ("Licensee") a non-
** exclusive, royalty free, license to use, modify and redistribute this
** software in source and binary code form, provided that i) this copyright
** notice and license appear on all copies of the software; and ii) Licensee does
** not utilize the software in a manner which is disparaging to CTC.
**
** This software is provided "AS IS," without a warranty of any kind.  ALL
** EXPRESS OR IMPLIED CONDITIONS, REPRESENTATIONS AND WARRANTIES, INCLUDING ANY
** IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR NON-
** INFRINGEMENT, ARE HEREBY EXCLUDED.  CTC AND ITS LICENSORS SHALL NOT BE LIABLE
** FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING, MODIFYING OR
** DISTRIBUTING THE SOFTWARE OR ITS DERIVATIVES.  IN NO EVENT WILL CTC  OR ITS
** LICENSORS BE LIABLE FOR ANY LOST REVENUE, PROFIT OR DATA, OR FOR DIRECT,
** INDIRECT, SPECIAL, CONSEQUENTIAL, INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER
** CAUSED AND REGARDLESS OF THE THEORY OF LIABILITY, ARISING OUT OF THE USE OF
** OR INABILITY TO USE SOFTWARE, EVEN IF CTC  HAS BEEN ADVISED OF THE POSSIBILITY
** OF SUCH DAMAGES.
**
*******************************************************************************/

/*******************************************************************************
** This file is part of the ADL Sample API Implementation intended to provide
** an elementary example of the concepts presented in the ADL Sharable
** Content Object Reference Model (SCORM).
**
** The purpose in wrapping the calls to the API is to (1) provide a
** consistent means of finding the LMS API implementation within the window
** hierarchy and (2) to validate that the data being exchanged via the
** API conforms to the defined CMI data types.
**
** This is just one possible example for implementing the API guidelines for
** runtime communication between an LMS and executable content components.
** There are several other possible implementations.
**
** Usage: Executable course content can call the API Wrapper
**      functions as follows:
**
**    javascript:
**          var result = doLMSInitialize();
**          if (result != true) 
**          {
**             // handle error
**          }
**
**    authorware
**          result := ReadURL("javascript:doLMSInitialize()", 100)
**
*******************************************************************************/

var _Debug = false;  // set this to false to turn debugging off
                     // and get rid of those annoying alert boxes.

// Define exception/error codes
var _NoError = 0;
var _GeneralException = 101;
var _ServerBusy = 102;
var _InvalidArgumentError = 201;
var _ElementCannotHaveChildren = 202;
var _ElementIsNotAnArray = 203;
var _NotInitialized = 301;
var _NotImplementedError = 401;
var _InvalidSetValue = 402;
var _ElementIsReadOnly = 403;
var _ElementIsWriteOnly = 404;
var _IncorrectDataType = 405;


// local variable definitions
var apiHandle = null;
var API = null;
var findAPITries = 0;


/*******************************************************************************
**
** Function: doLMSInitialize()
** Inputs:  None
** Return:  CMIBoolean true if the initialization was successful, or
**          CMIBoolean false if the initialization failed.
**
** Description:
** Initialize communication with LMS by calling the LMSInitialize
** function which will be implemented by the LMS.
**
*******************************************************************************/
function doLMSInitialize()
{
   var api = getAPIHandle();
   if (api == null)
   {
      if(_Debug)alert("Unable to locate the LMS's API Implementation.\nLMSInitialize was not successful.");
      return "false";
   }

  if(scormVersion == "2004")
  {
	  var result = api.Initialize("");
	}else{
		var result = api.LMSInitialize("");  
  }

   if (result.toString() != "true")
   {
      var err = ErrorHandler();
   }

   return result.toString();
}

/*******************************************************************************
**
** Function doLMSFinish()
** Inputs:  None
** Return:  CMIBoolean true if successful
**          CMIBoolean false if failed.
**
** Description:
** Close communication with LMS by calling the LMSFinish
** function which will be implemented by the LMS
**
*******************************************************************************/
function doLMSFinish()
{
   var api = getAPIHandle();
   if (api == null)
   {
      if(_Debug)alert("Unable to locate the LMS's API Implementation.\nLMSFinish was not successful.");
      return "false";
   }
   else
   {
      // call the LMSFinish function that should be implemented by the API
	  if(scormVersion == "2004")
	  {
		  var result = api.Terminate("");
	  	}else{
			var result = api.LMSFinish("");  
	  }
      
      if (result.toString() != "true")
      {
         var err = ErrorHandler();
      }

   }
   return result.toString();
}

/*******************************************************************************
**
** Function doLMSGetValue(name)
** Inputs:  name - string representing the cmi data model defined category or
**             element (e.g. cmi.core.student_id)
** Return:  The value presently assigned by the LMS to the cmi data model
**       element defined by the element or category identified by the name
**       input value.
**
** Description:
** Wraps the call to the LMS LMSGetValue method
**
*******************************************************************************/
function doLMSGetValue(name)
{
   var api = getAPIHandle();
   if (api == null)
   {
      if(_Debug)alert("Unable to locate the LMS's API Implementation.\nLMSGetValue was not successful.");
      return "";
   }
   else
   {
      if(scormVersion == "2004")
	  {
	  	   //convert data model elements from SCORM 1.2 to 2004
		switch(name)
		{
			case "cmi.core.lesson_status"://there is not lesson_status in SCORM 2004 it was replaced with completion_status and success_status
				name = "cmi.completion_status";
			break;
		
			case "cmi.core.session_time":
				name = "cmi.session_time";
			break;
			case "cmi.core.lesson_location":
				name = "cmi.location";
			break;
			case "cmi.core.student_name":
				name ="cmi.learner_name";
			break;
		}
		
		var value = api.GetValue(name);
      	var errCode = api.GetLastError().toString();		  
	  }else{  
	  	var value = api.LMSGetValue(name);
      	var errCode = api.LMSGetLastError().toString();
	  }
	  if (errCode != _NoError)
      {
         // an error was encountered so display the error description
		if(scormVersion == "2004")
	  	{
			var errDescription = api.GetErrorString(errCode);
			if(_Debug)alert("GetValue("+name+") failed. \n"+ errDescription);   
		}else{
			var errDescription = api.LMSGetErrorString(errCode);
			if(_Debug)alert("LMSGetValue("+name+") failed. \n"+ errDescription);
		}
		return "";
      }
      else
      {
         
         return value.toString();
      }
   }
}

/*******************************************************************************
**
** Function doLMSSetValue(name, value)
** Inputs:  name -string representing the data model defined category or element
**          value -the value that the named element or category will be assigned
** Return:  CMIBoolean true if successful
**          CMIBoolean false if failed.
**
** Description:
** Wraps the call to the LMS LMSSetValue function
**
*******************************************************************************/
function doLMSSetValue(name, value)
{
   
   var api = getAPIHandle();
   if (api == null)
   {
      if(_Debug)alert("Unable to locate the LMS's API Implementation.\nLMSSetValue was not successful.");
      return;
   }
   else
   {
      if(scormVersion == "2004")
	  {
		//convert data model elements from SCORM 1.2 to 2004
		switch(name)
		{
			case "cmi.core.lesson_status"://there is not lesson_status in SCORM 2004 it was replaced with completion_status and success_status
				if( (value == "passed") || (value == "failed") )
				{
					name = "cmi.success_status";
				}
				if( (value == "completed") || (value == "incomplete") )
				{
					name = "cmi.completion_status";
				}
				
			break;
		
			case "cmi.core.session_time":
				if(value.indexOf(":") != -1)
				{
					value = ConvertToDuration(value);
					}
				name = "cmi.session_time";
			break;
			case "cmi.core.lesson_location":
				name = "cmi.location";
			break;
			case "cmi.core.exit":
				name ="cmi.exit";
			break;
			case "cmi.core.score.raw":
				name="cmi.score.raw";
			break;
		}
		
		var result = api.SetValue(name, value);
	  
	  }else{
		  var result = api.LMSSetValue(name, value);
	  }
	  if (result.toString() != "true")
      {
         var err = ErrorHandler();
      }
   }

   return;
}

/*******************************************************************************
**
** Function doLMSCommit()
** Inputs:  None
** Return:  None
**
** Description:
** Call the LMSCommit function 
**
*******************************************************************************/
function doLMSCommit()
{
   var api = getAPIHandle();
   if (api == null)
   {
      if(_Debug)alert("Unable to locate the LMS's API Implementation.\nLMSCommit was not successful.");
      return "false";
   }
   else
   {
      if(scormVersion == "2004")
	  {
		  var result = api.Commit("");
	  }else{
	  	var result = api.LMSCommit("");
	  }
	  if (result != "true")
      {
         var err = ErrorHandler();
      }
   }

   return result.toString();
}

/*******************************************************************************
**
** Function doLMSGetLastError()
** Inputs:  None
** Return:  The error code that was set by the last LMS function call
**
** Description:
** Call the LMSGetLastError function 
**
*******************************************************************************/
function doLMSGetLastError()
{
   var api = getAPIHandle();
   if (api == null)
   {
      if(_Debug)alert("Unable to locate the LMS's API Implementation.\nLMSGetLastError was not successful.");
      //since we can't get the error code from the LMS, return a general error
      return _GeneralError;
   }
      if(scormVersion == "2004")
	  {
	return api.GetLastError().toString();
		}else{
   			return api.LMSGetLastError().toString();
		}
}

/*******************************************************************************
**
** Function doLMSGetErrorString(errorCode)
** Inputs:  errorCode - Error Code
** Return:  The textual description that corresponds to the input error code
**
** Description:
** Call the LMSGetErrorString function 
**
********************************************************************************/
function doLMSGetErrorString(errorCode)
{
   var api = getAPIHandle();
   if (api == null)
   {
      if(_Debug)alert("Unable to locate the LMS's API Implementation.\nLMSGetErrorString was not successful.");
   }
      if(scormVersion == "2004")
	  {return api.GetErrorString(errorCode).toString();}else{
   return api.LMSGetErrorString(errorCode).toString();
   }
}

/*******************************************************************************
**
** Function doLMSGetDiagnostic(errorCode)
** Inputs:  errorCode - Error Code(integer format), or null
** Return:  The vendor specific textual description that corresponds to the 
**          input error code
**
** Description:
** Call the LMSGetDiagnostic function
**
*******************************************************************************/
function doLMSGetDiagnostic(errorCode)
{
   var api = getAPIHandle();
   if (api == null)
   {
      if(_Debug)alert("Unable to locate the LMS's API Implementation.\nLMSGetDiagnostic was not successful.");
   }
      if(scormVersion == "2004")
	  {
		  return api.GetDiagnostic(errorCode).toString();
		  }else{
   		return api.LMSGetDiagnostic(errorCode).toString();
	  }
}

/*******************************************************************************
**
** Function LMSIsInitialized()
** Inputs:  none
** Return:  true if the LMS API is currently initialized, otherwise false
**
** Description:
** Determines if the LMS API is currently initialized or not.
**
*******************************************************************************/
function LMSIsInitialized()
{
   // there is no direct method for determining if the LMS API is initialized
   // for example an LMSIsInitialized function defined on the API so we'll try
   // a simple LMSGetValue and trap for the LMS Not Initialized Error

   var api = getAPIHandle();
   if (api == null)
   {
      if(_Debug)alert("Unable to locate the LMS's API Implementation.\nLMSIsInitialized() failed.");
      return false;
   }
   else
   {
      
      if(scormVersion == "2004")
	  {
		var value = api.GetValue("cmi.student_name");
      	var errCode = api.GetLastError().toString();		  
	  }else{
	  	var value = api.LMSGetValue("cmi.core.student_name");
      	var errCode = api.LMSGetLastError().toString();
	  }
	  if (errCode == _NotInitialized)
      {
         return false;
      }
      else
      {
         return true;
      }
   }
}

/*******************************************************************************
**
** Function ErrorHandler()
** Inputs:  None
** Return:  The current value of the LMS Error Code
**
** Description:
** Determines if an error was encountered by the previous API call
** and if so, displays a message to the user.  If the error code
** has associated text it is also displayed.
**
*******************************************************************************/
function ErrorHandler()
{
   var api = getAPIHandle();
   if (api == null)
   {
      if(_Debug)alert("Unable to locate the LMS's API Implementation.\nCannot determine LMS error code.");
      return;
   }
      if(scormVersion == "2004")
	  {
		   // check for errors caused by or from the LMS
		   var errCode = api.GetLastError().toString();
		   if (errCode != _NoError)
		   {
			  // an error was encountered so display the error description
			  var errDescription = api.GetErrorString(errCode);
		
			  if (_Debug == true)
			  {
				 errDescription += "\n";
				 errDescription += api.GetDiagnostic(null);
				 // by passing null to LMSGetDiagnostic, we get any available diagnostics
				 // on the previous error.
			  }
		
			  if(_Debug)alert(errDescription);
		   }
	  }else{
	  		   // check for errors caused by or from the LMS
		   var errCode = api.LMSGetLastError().toString();
		   if (errCode != _NoError)
		   {
			  // an error was encountered so display the error description
			  var errDescription = api.LMSGetErrorString(errCode);
		
			  if (_Debug == true)
			  {
				 errDescription += "\n";
				 errDescription += api.LMSGetDiagnostic(null);
				 // by passing null to LMSGetDiagnostic, we get any available diagnostics
				 // on the previous error.
			  }
		
			  if(_Debug)alert(errDescription);
		   }
	  
	  }

   return errCode;
}
function ConvertToDuration(hms) {
//Convert duration from milliseconds to 0000:00:00.00 format

	
	//then convert hms to a timeinterval format
	//P[yY][mM][dD][T[hH][mM][s[.s]S]
	//example: PT1H5M (1 hour 5 miutes)

	aryPieces = hms.split(":");
	strHour = aryPieces[0];
	strMin = aryPieces[1];
	strSec = aryPieces[2];
	
	newTime = "PT" + strHour + "H" + strMin + "M" + strSec + "S" ;
	//hms="PT1H5M";
	return newTime
}

function WriteToDebug(a)
{
//if(_Debug)alert(a)
}

function getAPIHandle()
{
	//Brian Caudill
	//Since the customers LMS documentation states that they accept Articulate courses to run on their LMS I have included the API lookup funcitons
	//from the Articulate tool within this file to see if that fixes the issue.
	//connects the CTC SCORM API Wrapper with the lookup algorythm from the Articulate \lms\SCORMFunctions.js code written by Mike Rustici
	return SCORM_GrabAPI()
}

function SCORM_GrabAPI(){
	
	WriteToDebug("In SCORM_GrabAPI");
	
	//if we haven't already located the API, find it using our improved ADL algorithm
	if (typeof(SCORM_objAPI) == "undefined" || SCORM_objAPI == null){
		WriteToDebug("Searching with improved ADL algorithm");
		SCORM_objAPI = SCORM_GetAPI();
	}		
	
	//if it's still not found, look in every concievable spot...some older LMS's bury it in wierd places
	//drop this because it can cause problems when the content is launched in a cross domain envrionment...for instance the 
	//standard detection algorithm could come upon a frame from a different domain using this algorithm when the content is
	//launched under AICC
	
	//TODO: a better solution might be to wrap this in a try/catch block
	
	//if (typeof(SCORM_objAPI) == "undefined" || SCORM_objAPI == null){
	//	WriteToDebug("Searching everywhere with Rustici Software algorithm");
	//	SCORM_objAPI = SCORM_SearchForAPI(window);
	//}
	
	WriteToDebug("SCORM_GrabAPI, returning");
	
	return SCORM_objAPI;
	
}


function SCORM_SearchForAPI(wndLookIn){
	
	WriteToDebug("SCORM_SearchForAPI");
	
	var objAPITemp = null;
	var strDebugID = "";
	
	strDebugID = "Name=" + wndLookIn.name + ", href=" + wndLookIn.location.href
	
	objAPITemp = eval("wndLookIn." + windowObjectToFind);
	
	if (SCORM_APIFound(objAPITemp)){
		WriteToDebug("Found API in this window - "  + strDebugID);
		return objAPITemp;
	}
	
	if (SCORM_WindowHasParent(wndLookIn)){
		WriteToDebug("Searching Parent - "  + strDebugID);
		objAPITemp = SCORM_SearchForAPI(wndLookIn.parent);
	}

	if (SCORM_APIFound(objAPITemp)){
		WriteToDebug("Found API in a parent - "  + strDebugID);
		return objAPITemp;
	}

	if (SCORM_WindowHasOpener(wndLookIn)){
		WriteToDebug("Searching Opener - "  + strDebugID);
		objAPITemp = SCORM_SearchForAPI(wndLookIn.opener);
	}

	if (SCORM_APIFound(objAPITemp)){
		WriteToDebug("Found API in an opener - "  + strDebugID);
		return objAPITemp;
	}	
	
	//look in child frames individually, don't call this function recursively
	//on them to prevent an infinite loop when it looks back up to the parents
	WriteToDebug("Looking in children - "  + strDebugID);
	objAPITemp = SCORM_LookInChildren(wndLookIn);

	if (SCORM_APIFound(objAPITemp)){
		WriteToDebug("Found API in Children - "  + strDebugID);
		return objAPITemp;
	}
	
	WriteToDebug("Didn't find API in this window - "  + strDebugID);
	return null;
}


function SCORM_LookInChildren(wnd){
	
	WriteToDebug("SCORM_LookInChildren");
	
	var objAPITemp = null;
	
	var strDebugID = "";
	
	strDebugID = "Name=" + wnd.name + ", href=" + wnd.location.href

	for (var i=0; i < wnd.frames.length; i++){
		
		WriteToDebug("Looking in child frame " + i);
		objAPITemp = eval("win.frames["+i+"]." + windowObjectToFind);
		
		if (SCORM_APIFound(objAPITemp)){
			WriteToDebug("Found API in child frame of " + strDebugID);
			return objAPITemp;
		}
		
		WriteToDebug("Looking in this child's children " + strDebugID);
		objAPITemp = SCORM_LookInChildren(wnd.frames[i]);

		if (SCORM_APIFound(objAPITemp)){
			WriteToDebug("API found in this child's children " + strDebugID);
			return objAPITemp;
		}		
	}
	
	return null;
}

function SCORM_WindowHasOpener(wnd){
	WriteToDebug("In SCORM_WindowHasOpener");
	if ((wnd.opener != null) && (wnd.opener != wnd) && (typeof(wnd.opener) != "undefined")){
		WriteToDebug("Window Does Have Opener");
		return true;
	}
	else{
		WriteToDebug("Window Does Not Have Opener");
		return false;
	}	
}

function SCORM_WindowHasParent(wnd){
	WriteToDebug("In SCORM_WindowHasParent");
	if ((wnd.parent != null) && (wnd.parent != wnd) && (typeof(wnd.parent) != "undefined")){
		WriteToDebug("Window Does Have Parent");
		return true;
	}
	else{
		WriteToDebug("Window Does Not Have Parent");
		return false;
	}
}


function SCORM_APIFound(obj){
	WriteToDebug("In SCORM_APIFound");
	if (obj == null || typeof(obj) == "undefined"){
		WriteToDebug("API NOT Found");
		return false;
	}
	else{
		WriteToDebug("API Found");
		return true;
	}
}

/*
ScanParentsForApi
-Searches all the parents of a given window until
 it finds an object named "API". If an
 object of that name is found, a reference to it
 is returned. Otherwise, this function returns null.
*/
function SCORM_ScanParentsForApi(win) 
{ 

	WriteToDebug("In SCORM_ScanParentsForApi, win=" + win.location);
	
	/*
	Establish an outrageously high maximum number of
	parent windows that we are will to search as a
	safe guard against an infinite loop. This is 
	probably not strictly necessary, but different 
	browsers can do funny things with undefined objects.
	*/
	var MAX_PARENTS_TO_SEARCH = 500; 
	var nParentsSearched = 0;
	
	/*
	Search each parent window until we either:
		 -find the API, 
		 -encounter a window with no parent (parent is null 
				or the same as the current window)
		 -or, have reached our maximum nesting threshold
	*/
	while ( (eval("win."+windowObjectToFind) == null || eval("win."+windowObjectToFind) === undefined) && 
			(win.parent != null) && (win.parent != win) && 
			(nParentsSearched <= MAX_PARENTS_TO_SEARCH) 
		  )
	{ 
				
		nParentsSearched++; 
		win = win.parent;
	} 
	
	/*
	If the API doesn't exist in the window we stopped looping on, 
	then this will return null.
	*/
	return eval("win."+windowObjectToFind); 
} 


/*
GetAPI
-Searches all parent and opener windows relative to the
 current window for the SCORM API Adapter.
 Returns a reference to the API Adapter if found or null
 otherwise.
*/
function SCORM_GetAPI() 
{ 
	WriteToDebug("In SCORM_GetAPI");
	
	var API = null; 
	
	//Search all the parents of the current window if there are any
	if ((window.parent != null) && (window.parent != window)) 
	{ 
		WriteToDebug("SCORM_GetAPI, searching parent");
		API = SCORM_ScanParentsForApi(window.parent); 
	} 
	
	/*
	If we didn't find the API in this window's chain of parents, 
	then search all the parents of the opener window if there is one
	*/
	if ((API == null) && (window.top.opener != null))
	{ 
		WriteToDebug("SCORM_GetAPI, searching opener");
		API = SCORM_ScanParentsForApi(window.top.opener); 
	} 
	
	return API;
}



