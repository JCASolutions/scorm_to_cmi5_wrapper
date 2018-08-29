function makeBasicStatement(stmtActor, verb, activityID) {
    var stmt = new ADL.XAPIStatement(stmtActor, verb, activityID);
    stmt.timestamp = (new Date()).toISOString();
    stmt.generateId();
    return stmt;
}

function makeFailedStatement(stmtActor, activityID, scaledScore) {
    var stmt = makeBasicStatement(stmtActor, ADL.verbs.failed, activityID);
    stmt.result = {};
    stmt.result.duration = "PT0H0M27S";
    stmt.result.success = false;
    if (scaledScore !== "") {
        stmt.result.score = {
            "scaled": scaledScore
        }
    }
    addCmi5DefinedToStatement(stmt);
    return stmt;
}

function makeCompletedStatement(stmtActor, activityID) {
    var stmt = makeBasicStatement(stmtActor, ADL.verbs.completed, activityID);
    stmt.result = {};
    stmt.result.duration = "PT0H0M27S";
    stmt.result.completion = true;
    // Can't set score on completed statements, only passed and failed.
    addCmi5DefinedToStatement(stmt);
    stmt.context.contextActivities.category.push(
    {
        "id": "https://w3id.org/xapi/cmi5/context/categories/moveon"
    });
    return stmt;
}

function makePassedStatement(stmtActor, activityID, scaledScore) {
    var stmt = makeBasicStatement(stmtActor, ADL.verbs.passed, activityID);
    stmt.result = {};
    stmt.result.duration = "PT0H0M27S";
    stmt.result.success = true;
    if (scaledScore !== "") {
        stmt.result.score = {
            "scaled": scaledScore
        }
    }
    addCmi5DefinedToStatement(stmt);
    stmt.context.contextActivities.category.push(
    {
        "id": "https://w3id.org/xapi/cmi5/context/categories/moveon"
    });
    return stmt;
}

function addCmi5DefinedToStatement(stmt) {
    stmt.context = launchData.contextTemplate;
    stmt.context.contextActivities.category = [];
    stmt.context.contextActivities.category.push(
    {
        "id": "https://w3id.org/xapi/cmi5/context/categories/cmi5"
    });
}

var activityID = ADL.XAPIWrapper.lrs.extended.activityId;
var actor = JSON.parse(ADL.XAPIWrapper.lrs.actor);
var registration = ADL.XAPIWrapper.lrs.registration;
var fetchURL = ADL.XAPIWrapper.lrs.extended.fetch;

var launchData = {};
var suspendData = {};

(async () => {
    const fetchAuthToken = async () => {
        const response = await fetch(fetchURL, {
            method: "POST"});
        const json = await response.json();
        console.log(json);
        return json["auth-token"];
    }
    var authToken = await fetchAuthToken();
    console.log("authToken", authToken);

    endPointConfig = {
        // "endpoint": endPoint,
        "auth": "Basic " + authToken
    };
    ADL.XAPIWrapper.changeConfig(endPointConfig);

    //var activityID = "http://cmi5wrapper.example/activity1"
    console.log("actor", actor);
    launchData = ADL.XAPIWrapper.getState(activityID, actor, "LMS.LaunchData", registration);
    console.log("launchData", launchData);
    suspendData = ADL.XAPIWrapper.getState(activityID, actor, "cmi.suspend_data", registration);
    console.log("suspendData", suspendData);
})();
