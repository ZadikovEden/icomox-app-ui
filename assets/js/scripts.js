//global variable
function setToken(token) {
    localStorage.setItem('token', token);
}

function setTickets(tickets) {
    localStorage.setItem('tickets', JSON.stringify(tickets));
}

function setAlertLevel(alert_level) {
    localStorage.setItem('alert_level', alert_level);
}

function setTotalSeverity() {
    const tickets = getTickets();
    var total_severity = {
        "normal_operation": 0,
        "medium_level_alerts": 0,
        "high_level_alerts": 0,
    }

    total_severity.normal_operation = tickets.normal_operation.length;
    total_severity.medium_level_alerts = tickets.medium_level_alerts.length;
    total_severity.high_level_alerts = tickets.high_level_alerts.length;

    localStorage.setItem('total_severity', JSON.stringify(total_severity));
}

function getToken() {
    return localStorage.getItem('token');
}

function getTickets() {
    return JSON.parse(localStorage.getItem('tickets'));
}

function getALertLevel() {
    return localStorage.getItem('alert_level');
}

function getTotalSeverity() {
    return JSON.parse(localStorage.getItem('total_severity'));
}

function setHeight(id) {
    const screen_height = window.screen.height + "px";
    const header_height = 260 + "px";
    const body_height = "calc(" + screen_height + " - " + header_height + ")";
    document.getElementById(id).style.height = body_height;
}

function setHeader(total_assets, severity) {
    document.getElementById("custom_header").innerText = severity;
}

function getQueryParam(param) {
    var urlParams = new URLSearchParams(window.location.search);
    return paramValue = urlParams.get(param);
}

function nevigate(show, param, text) {
    let href = show + ".html";
    param != "" ? href += `?alert-level=${param}` :null;
    window.location.assign(href);
}

function setBreadcrumb(alert_level) {
    let breadcrumbObj = {
        "high_level_alerts":"High Level Alerts",
        "medium_level_alerts":"Medium Level Alerts",
        "normal_operation":"Normal Operation",
    }
    document.getElementById("nav_last_child").innerText = breadcrumbObj[alert_level];
}

function showLoader(showFlag) {
    showFlag ? document.getElementById("loader_over_layout").style = "display:block" :
        document.getElementById("loader_over_layout").style = "display:none";
}

function setTotalSeverityInHtml(total_severity) {
    document.getElementById("high_level_alerts_label").innerText = total_severity.high_level_alerts + " Assets";
    document.getElementById("medium_level_alerts_label").innerText = total_severity.medium_level_alerts + " Assets";
    document.getElementById("normal_operation_label").innerText = total_severity.normal_operation + " Assets";
}

function login() {
    const USERNAME = document.getElementById("username").value;
    const PASSWORD = document.getElementById("password").value;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "password");
    urlencoded.append("client_id", "login-app");
    urlencoded.append("username", USERNAME);
    urlencoded.append("password", PASSWORD);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    fetch("https://icomox.poc.icomoxlive.net/auth/realms/icomox/protocol/openid-connect/token", requestOptions)
        .then(response => {
            if (response.ok)
                return response.json()
            return Promise.reject(response)
        })
        .then(result => {
            setToken(result.access_token)
            fetchData();
            showLoader(true);
        })
        .catch(error => {
            error.status === 401 ? handleError("Username or password is incorrect.") :
                console.log('error', error)
        });
}

function fetchData() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch(`https://fast-garden-32068.herokuapp.com/tickets/opened/${getToken()}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            setTickets(result);
            setTotalSeverity();
            resetLoginPage();
            showLoader(false);
            nevigate("home_page", "", "ALERTS MANAGEMENT");
        })
        .catch(error => console.log('error', error));
}

function logout() {
    localStorage.clear();
    window.location.assign("index.html");   
}

function resetLoginPage() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("error-label-form").classList.remove("has-error");
}

function handleError(err) {
    document.getElementById("error-label-form").classList.add("has-error");
}

function focusInput(e) {
    e.parentElement.classList.add("after-color");
}

function focusOut(e) {
    e.parentElement.classList.remove("after-color");
}

function buildTable(alert_level, ticketsArray) {
    ticketsArray = ticketsArray[alert_level];
    colorsObj = {
        "high_level_alerts": "#EF5350",
        "medium_level_alerts": "#ffd740",
        "normal_operation": "#81C784"
    }

    ticketsArray.map(ticket => {
        var row = ` <div class="row margin-bottom">
                <div class="col s12">
                    <div class="card white new">
                        <div class="card-content padding-bottom">
                            <div class="row margin-bottom">
                                <div class="col s1">
                                    <div class="row margin-bottom">
                                        <div class="col s12" style="height:74px;
                                        margin-left:10px; width:1px; border-radius: 2px;
                                        background: ${colorsObj[alert_level]}; padding: 3px; margin-bottom: 10px;"></div>
                                    </div>
                                </div>
                                <div class="col s11" style="padding: 0px;">
                                    <div class="col s8">
                                        <span class="card-title date-time ">
                                            <span>
                                            <span  style="border-right: 2px solid #cfd8dc;  padding-right: 4px;"> ${ticket.created.slice(0, 10)}</span>
                                                <span style="  padding-right: 4px;"> ${ticket.created.slice(11, 19)}</span>
                                        </span>
                                    </div>
                                    <div class="col s4" style="padding: 0px;">
                                        <span class="card-title date-time" style="background-color:#eeeeee; color: black; justify-items: center;
                                        display: grid; border-radius: 9px 0 0 9px;"> ${ticket.state}</span>
                                    </div>
                                    <div class="col s12">
                                        <span class="card-title asset" style="margin-bottom: 0px!important;"> ${ticket.asset.name}</span>
                                    </div>
                                    <div class="col s12" style="padding-top:5px">
                                        <span class="card-title body"> ${ticket.alertType}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        $("#cards").append(row)
    })
}

function resetAlertsCards() {
    $("#cards").empty();
    $("#totalCards").empty();
}

function resetNoSearchMsg() {
    document.getElementById('no_search_results_msg_parent').style = "display:none;"
}

function resetSearchValue() {
    $("#search").val("");
}

function search(value, severity) {
    value = value.toLowerCase();
    var severity_tickets = getTickets()[severity];
    severity_tickets = severity_tickets.filter(ticket => {
        return (ticket.asset.name.toLowerCase()).includes(value);
    })
    var ticketsObj = {
        [severity]: severity_tickets,
    }
    resetAlertsCards();
    totalAssets(severity, ticketsObj);
    if (ticketsObj[severity].length == 0) {
        setNoResultsMsg('No results found for- "' + value + '"');
        document.getElementById("no_search_results_msg_parent").style = "display:block;";
    } else {
        buildTable(severity, ticketsObj);
        document.getElementById("no_search_results_msg_parent").style = "display:none;";
        setNoResultsMsg("");
    }
}

function totalAssets(alert_level, ticketsObj) {
    let ticketsObjLength = ticketsObj[alert_level].length;
    var row = `<span style="font-weight: 600; font-size:15px; padding-left: 10px; color:#263238"> Total Assets: ${ticketsObjLength}</span>`;
    $("#totalCards").append(row);
}

function setPageHeader(page_header_text) {
    document.getElementById("page_header").innerText = page_header_text;
}
function setNoResultsMsg(msg) {
    document.getElementById("no_search_results_msg").innerText = msg;
}