var API = {
    cacheScore: {raw: "", min: "0", max: "100"},
    
    LMSInitialize: function(k) {
        var stmt = makeBasicStatement(actor, ADL.verbs.initialized, activityID);
        addCmi5DefinedToStatement(stmt);
        var respObj = ADL.XAPIWrapper.sendStatement(stmt);
        console.log(respObj);
        return "";
    },
    LMSGetValue: function(k) {
        // TODO Address fetching read-only or LMS-created properties (like cmi.interactions._count).
        var value = ADL.XAPIWrapper.getState(activityID, actor, k, registration);
        
        // XAPIWrapper automatically unwraps it inside XHR_Request.
        //return JSON.parse(value);
        return value;
    },
    LMSSetValue: function(k, v) {
        // You have to maintain the score so we can bake the score into the passed statement, optimally.
        if (k == "cmi.core.score.raw") {
            this.cacheScore.raw = "" + v;
        }
        else if (k == "cmi.core.score.min") {
            this.cacheScore.min = "" + v;
        }
        else if (k == "cmi.core.score.max") {
            this.cacheScore.max = "" + v;
        }
        
        if (k == "cmi.core.lesson_status") {
            if (v == "passed" || v == "failed") {
                var sendScore = "";
                var stmt;
                if (this.cacheScore.raw !== "") {
                    sendScore = (this.cacheScore.raw - this.cacheScore.min) / (this.cacheScore.max - this.cacheScore.min);
                }
                if (v == "passed") {
                    stmt = makePassedStatement(actor, activityID, sendScore);
                }
                else {
                    stmt = makeFailedStatement(actor, activityID, sendScore);
                }
                var respObj = ADL.XAPIWrapper.sendStatement(stmt);
            }
            else if (v == "completed") {
                var stmt = makeCompletedStatement(actor, activityID, sendScore);
                var respObj = ADL.XAPIWrapper.sendStatement(stmt);
            }
        }

        // Every SCORM value should become a state value.
        ADL.XAPIWrapper.sendState(activityID, actor, k, registration, JSON.stringify(v));
        return "";
    },
    LMSFinish: function(k) {
        var stmt = makeBasicStatement(actor, ADL.verbs.terminated, activityID);
        addCmi5DefinedToStatement(stmt);
        stmt.result = {};
        stmt.result.duration = "PT0H0M27S";
        var respObj = ADL.XAPIWrapper.sendStatement(stmt);
        console.log(respObj);
        return "";
    },
    LMSCommit: function(k) {
        return "";
    },
    LMSGetLastError: function() {
        return "";
    },
    LMSGetErrorString: function(errorCode) {
        return "";
    },
    LMSGetDiagnostic(errocCode) {
        return "";
    }
};
