// globals
var optionTitles = ["tooltips", "goodyhuts", "details"];
var statisticsModal = null;
var scrolltoDivPopover = null;

// timeline rendering
function readFile(input) {
    if (input.files && input.files[0]) {

        // create FileReader
        var reader = new FileReader();


        // call function after file is read
        reader.onload = function (e) {
            try {
                // decode result into Unicode (the JSON file is base64 encoded)
                var res = b64DecodeUnicode(e.target.result.split("base64,")[1]);

                // parse decoded result
                var json = JSON.parse(res);

                // filter players and moments
                let players = json.Players.filter(p => p.CivilizationDescription.includes("Empire"));
                let moments = json.Moments.filter(m => m.EraScore > 0 || m.Type.startsWith("MOMENT_GAME_ERA_STARTED_WITH"));

                // add players and moments to localstorage
                window.localStorage.setItem("players", JSON.stringify(players));
                window.localStorage.setItem("moments", JSON.stringify(moments));

                let options = { goodyhuts: true, details: true, tooltips: true };
                optionTitles.map(o => {
                    if (window.localStorage.getItem(o)) {
                        options[o] = JSON.parse(window.localStorage.getItem(o));
                    } else {
                        window.localStorage.setItem(o, options[o].toString());
                    }
                });

                // generate timeline
                window.location.href = `${window.location.href}?timeline=1`;
                generateTimeline(players, 0, moments, options);
            } catch (e) {
                console.log(e)
                // catch errors
                new jBox('Notice', {
                    content: "Invalid file format, it must be a JSON file",
                    color: "red"
                });

                // return false;
            }
        };

        // read result
        reader.readAsDataURL(input.files[0]);
    }
}

function generateTimelineSettings(players, selectedPlayerID) {
    // scroll to era
    var scrollTo = $(`
        <button class="timelineSettingsButton" id="timeline-scrollto-trigger" type="button" data-bs-toggle="popover">
            <svg x="0px" y="0px" viewBox="0 0 330 330">
                <path d="${scrollIcon}" />
            </svg>
        </button>
        `);

    // player selection
    var playerSelect = $(`<select id="select-player" class="select-player" onchange="regenTimeline(); setScrolltoPopover();">
        ${players.map(player => {
        return `<option value="${"KEY_" + player.Id}" ${player.Id == selectedPlayerID ? "selected" : ""}>
            ${getCivName(player.Civilization) + (player.Id === 0 ? " (You)" : "")}
            </option>`
    })}
        </select>`);

    // timeline options
    var timelineOptions = $(`
        <button class="timelineSettingsButton" id="timeline-options-trigger" type="button" data-bs-toggle="popover"
        onclick="$('#timeline-options-trigger').toggleClass('open')">
            <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="${settingsIcon}"/>
            </svg>
        </button>
        `)
    var timelineOptionsPopover = getTimelineOptionsCheckboxes();

    // timeline settings parent
    var timelineSettingsParent;

    // if timeline has not been created yet
    if ($("#timeline-settings").length == 0) {
        timelineSettingsParent = $('<div id="timeline-settings"></div>')

        // append settings
        $("#app").empty()
            .append(timelineSettingsParent)
            .append(scrollTo)
            .append(playerSelect)
            .append(timelineOptions)

        // set options popover html
        $("#timeline-options").attr("data-bs-content", timelineOptionsPopover);
        new bootstrap.Popover(document.getElementById("timeline-options-trigger"), {
            html: true,
            content: timelineOptionsPopover,
            placement: "left",
            sanitize: false,
        });
    } else {
        // if timeline has already been created
        regenTimeline();
    }

    // set scrollto era div popover
    setScrolltoPopover();
    let scrolltoTrigger = $("#timeline-scrollto-trigger");
    scrolltoTrigger.on('click', function () {
        if (!scrolltoTrigger.hasClass("open")) {
            $("#timeline-scrollto-trigger").addClass("open");
        } else {
            scrolltoTrigger.removeClass("open")
        }
    });
}

function scrolltoDivDocumentClickFunc(e) {
    let target = $(e.target);

    let scrolltoTrigger = $("#timeline-scrollto-trigger");
    if (scrolltoTrigger.hasClass('open') && !target.closest("#timeline-scrollto-trigger").length) {
        scrolltoTrigger.removeClass('open');
        scrolltoDivPopover.hide();
    }
}

function setScrolltoPopover() {
    if (scrolltoDivPopover) {
        // dispose old popover if it exists
        scrolltoDivPopover.dispose();
    }

    // create html
    let scrolltohtml = `<div class="scrolltoErasContainer">
            <div class="popoverTitle">Scroll to:</div>
            ${Object.entries(getCurrentGameEras(parseInt($("#select-player").val().split("_")[1]))).map(era => {
        return `<div class="scrolltoEra" onclick="
            document.getElementById('${era[0]}_DIV').scrollIntoView({
                block: 'center',
                inline: 'center',
                behavior: 'smooth',
            });
            $('#timeline-scrollto-trigger').trigger('click');
        ">${era[1]}</div>`
    }).join("")}
        </div>`;

    // create popover and set to global var
    $("#timeline-scrollto-trigger").attr("data-bs-content", scrolltohtml);
    scrolltoDivPopover = new bootstrap.Popover(document.getElementById("timeline-scrollto-trigger"), {
        html: true,
        content: scrolltohtml,
        placement: "right",
        sanitize: false,
    });
}

function regenTimelineSettings() {
    // get players and moments
    let players = JSON.parse(window.localStorage.getItem("players"));
    let moments = JSON.parse(window.localStorage.getItem("moments"));
    let selectedPlayer = $("#select-player").val().split("_")[1];

    // keep options
    var options = getTimelineOptions();
    var timelineOptionsPopover = getTimelineOptionsCheckboxes();

    $("#timeline-options-trigger").attr("data-bs-content", timelineOptionsPopover);

    setScrolltoPopover();

    generateTimeline(players, selectedPlayer, moments, options);
}

function regenTimeline() {
    // select player to view timeline for
    let selectedPlayer = $("#select-player").val().split("_")[1];

    // get players, moments, options
    let players = JSON.parse(window.localStorage.getItem("players"));
    let moments = JSON.parse(window.localStorage.getItem("moments"));

    var options = getTimelineOptions();
    var timelineOptionsPopover = getTimelineOptionsCheckboxes();

    $("#timeline-options-trigger").attr("data-bs-content", timelineOptionsPopover);

    // generate timeline
    generateTimeline(players, selectedPlayer, moments, options);
}

function generateTimeline(players, selectedPlayerID, moments, options) {
    try {
        // empty app children if no timeline, and show loading spinner
        var parent;
        if ($("#timeline").length == 0) {
            // generate settings
            generateTimelineSettings(players, selectedPlayerID, options);
            parent = "app";
        } else {
            parent = "timeline";
        }

        // select player 0 (you) if no player has been selected yet
        if (!selectedPlayerID) {
            selectedPlayerID = players[0].Id;
        }

        // filter moments
        moments = moments.filter(m => m.ActingPlayer == selectedPlayerID);
        if (!options.goodyhuts) {
            moments = moments.filter(m => m.Type != "MOMENT_GOODY_HUT_TRIGGERED");
        }

        // timeline
        var timeline = $('<div id="timeline" class="timeline"></div>');
        let current;
        moments.forEach(moment => {
            if (current != moment.GameEra) {
                timeline.append(`<div class="eraDivider" id="${moment.GameEra}_DIV">${getEra(moment.GameEra)}  Era</div>`)
            }
            current = moment.GameEra;

            timeline.append(`<div id="moment_${moment.Id}" class="moment">
                <p class="momentTitle">${formatMoment(moment.Type)}</p>
                <p class="momentDescription">${moment.InstanceDescription}</p>
                ${options.tooltips ? `<div class="momentTooltip">${formatMomentTooltip(moment.Type)}</div>` : ""}
                ${options.details ? `<div class="momentDetails">
                    <p>Turn ${moment.Turn.toString()}</p>
                    <p> | ${getEra(moment.GameEra)} Era</p>
                    ${moment.EraScore > 0 ? `<p> | +${moment.EraScore.toString()} Era Score</p>` : ""}
                </div>` : ""}
            </div>`);
        });

        // add timeline to DOM
        if (parent === "timeline") {
            $("#timeline").replaceWith(timeline);
        } else {
            $(`#app`).append(timeline);
        }

        // add civ history info and upload new timeline buttons
        if ($("#uploadNew").length == 0) {
            $("#app").append($(`
                <button class="btn btn-info" id="statistics">Civilization History Info</button>
            `));

            $("#app").append($(`<button class="btn btn-warning" id="uploadNew" onclick="window.location.href=window.location.pathname">
                Upload another timeline
            </button>`));
        } else {
            statisticsModal.destroy();
        }

        // civ history info modal
        statisticsModal = new jBox('Modal', {
            attach: "#statistics",
            width: 400,
            title: `Civilization History Info - ${getCivName(getCivNameByID(parseInt($("#select-player").val().split("_")[1])).Civilization)}`,
            draggable: "title",
            content: getStats(),
            overlay: false,
            offset: { y: -35 },
        });

        // tooltips if option is on
        if (options.tooltips) {
            function createTooltip(id) {
                let moment = document.getElementById(`moment_${id}`);

                let tooltip = document.querySelector(`#moment_${id} .momentTooltip`);

                function fn(e) {
                    tooltip.style.top = `${e.pageY + 10}px`;
                    tooltip.style.left = `${e.pageX + 20}px`;

                    let rectangle = tooltip.getBoundingClientRect();

                    if ((rectangle.x + rectangle.width) > window.innerWidth) {
                        tooltip.style.left = `${e.pageX - rectangle.width * 1.5}px`;
                    }
                }

                moment.addEventListener("mouseenter", fn);
                moment.addEventListener("mousemove", fn);
            }

            moments.forEach(moment => {
                createTooltip(moment.Id, moment.Type);
            });
        }
        // add timeline horizontal scrolling
        function scrollHorizontally(e) {
            e = window.event || e;
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            let timesRun = 0;
            var interval = setInterval(function () {
                timesRun++;
                if (timesRun == 30) {
                    clearInterval(interval);
                }
                document.getElementById('timeline').scrollLeft -= (delta * 20);
            }, 2.5);
            e.preventDefault();
        }
        if (document.getElementById('timeline').addEventListener) {
            document.getElementById('timeline').addEventListener("mousewheel", scrollHorizontally, false);
            document.getElementById('timeline').addEventListener("DOMMouseScroll", scrollHorizontally, false);
        } else {
            document.getElementById('timeline').attachEvent("onmousewheel", scrollHorizontally);
        }

        // initialize player selection dropdown
        $("#select-player").prettyDropdown({
            hoverIntent: -1,
        });
    } catch (e) {
        console.log(e);

        new jBox("Notice", {
            color: "red",
            content: "Encountered an error while attempting to load timeline"
        });

        setTimeout(() => {
            window.location.reload();
        }, 3000);

        return { failed: true };
    }
}



////////////////////////////////
// HELPER FUNCTIONS
////////////////////////////////
function b64DecodeUnicode(str) {
    // going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function saveOption(option) {
    // save option to localstorage
    window.localStorage.setItem(option, $(`input[value="${option}"]:checked`).length > 0);
}

function getTimelineOptions() {
    // get options from localstorage
    let options = {};

    optionTitles.map(o => {
        options[o] = JSON.parse(window.localStorage.getItem(o));
    });

    return options;
}

function getTimelineOptionsCheckboxes() {
    // get options
    let options = {};
    optionTitles.map(o => {
        options[o] = JSON.parse(window.localStorage.getItem(o));
    });

    // return html
    return `<form onchange="[${optionTitles.map(o => "'" + o + "'").join(",")}].map(o => {
        saveOption(o);
    }); regenTimelineSettings();" id="timeline-options">
        <div class="popoverTitle">Settings</div>
        <label class="optionLabel">
            <input type="checkbox" value="tooltips" ${options["tooltips"] ? "checked" : ""}>
            Show tooltips</label>
        
        <label class="optionLabel">
            <input type="checkbox" value="goodyhuts" ${options["goodyhuts"] ? "checked" : ""}>
            Show tribal village moments</label>
        
        <label class="optionLabel">
            <input type="checkbox" value="details" ${options["details"] ? "checked" : ""}>
            Show moment details</label>
        </form>`;
}

function highlightMoment(id) {
    setTimeout(function () {
        $(`#moment_${id}`).addClass("highlighted");
    }, 250);

    setTimeout(function () {
        $(`#moment_${id}`).removeClass("highlighted");
    }, 1250);
}

function getStats() {
    // moments and players
    let selectedPlayerID = parseInt($("#select-player").val().split("_")[1]);
    let allPlayers = JSON.parse(window.localStorage.getItem("players"));
    let selectedPlayer = allPlayers.find(p => p.Id == selectedPlayerID);

    let allMoments = JSON.parse(window.localStorage.getItem("moments"));
    let moments = allMoments.filter(m => m.ActingPlayer === selectedPlayerID);

    // statistics vars
    let totalScore = 0;
    let firstCiv = null;
    let defeatedBy = null;
    let defeatedCivs = [];
    let darkAges = 0;
    let goldenAges = 0;
    let bestEraData = {};
    let firstNaturalWonder = null;
    let worldWonders = [];
    let moreWorldWonders = 0;
    // let totalWorldWonders = 0;
    let totalGreatPeople = 0;

    // set eras
    Object.keys(getCurrentGameEras(selectedPlayerID)).forEach(era => bestEraData[era] = 0);

    // loop through selected player's moments
    moments.forEach(moment => {
        // add era score to total
        totalScore += moment.EraScore;

        // add era score to era
        bestEraData[moment.GameEra] = bestEraData[moment.GameEra] + moment.EraScore;

        // check for the first civ the player has met
        if (moment.Type === "MOMENT_PLAYER_MET_MAJOR" && !firstCiv) {
            firstCiv = {
                Id: moment.Id,
                name: moment.InstanceDescription.split("the people of")[1].trim().slice(0, -1)
            }
        }

        // check for the first natural wonder the player has found
        if (!firstNaturalWonder) {
            if (moment.Type === "MOMENT_FIND_NATURAL_WONDER_FIRST_IN_WORLD") {
                firstNaturalWonder = {
                    Id: moment.Id,
                    name: moment.InstanceDescription.split("set eyes on")[1].trim().slice(0, -1)
                }
            }
            if (moment.Type === "MOMENT_FIND_NATURAL_WONDER") {
                firstNaturalWonder = {
                    Id: moment.Id,
                    name: moment.InstanceDescription.split("the majesty of")[1].trim().slice(0, -1)
                }
            }
        }

        // check for the first world wonder the player has built
        if (moment.Type.includes("MOMENT_BUILDING_CONSTRUCTED") && moment.Type.includes("ERA_WONDER")) {
            // if (worldWonders.length < 6) {
            worldWonders.push({
                Id: moment.Id,
                name: moment.InstanceDescription.split("Standing in the")[1].split(", the citizens of")[0].trim()
            });
            // } else {
            //     moreWorldWonders++;
            // }
        }

        // add great person to total
        if (moment.Type.includes("MOMENT_GREAT_PERSON")) {
            totalGreatPeople++;
        }

        // add dark/golden/heroic ages to total
        if (moment.Type === "MOMENT_GAME_ERA_STARTED_WITH_DARK_AGE") {
            darkAges++;
        } else if (moment.Type === "MOMENT_GAME_ERA_STARTED_WITH_HEROIC_AGE" || moment.Type === "MOMENT_GAME_ERA_STARTED_WITH_GOLDEN_AGE") {
            goldenAges++;
        }

        // check if the selected player defeated another civ
        if (moment.Type.endsWith("PLAYER_DEFEATED")) {
            defeatedCivs.push({
                Id: moment.Id,
                name: allPlayers.find(p => p.Id === moment.ExtraData[0].Value).CivilizationShortDescription
            })
        }
    });

    // loop through all game moments
    allMoments.forEach(moment => {
        if (moment.Type.endsWith("PLAYER_DEFEATED")) {
            // check if the selected player has been defeated
            if (moment.InstanceDescription === `${selectedPlayer.CivilizationShortDescription} will not stand the test of time.`) {
                defeatedBy = allPlayers.find(p => p.Id === moment.ActingPlayer).CivilizationShortDescription;
            }
        }
    });

    // function to generate the scrollIntoView function
    function generateScrollJS(id) {
        return `document.getElementById(&quot;moment_${id}&quot;).scrollIntoView({
            block: &quot;center&quot;,
            inline: &quot;center&quot;,
            behavior: &quot;smooth&quot;,
        }); statisticsModal.close(); highlightMoment(${id});`;
    }

    // world wonders HTML
    var wwHTML = worldWonders.map(ww => `<span onclick='${generateScrollJS(ww.Id)}'>${ww.name}</span>`).join(', ');

    // return html 
    return `
    <div class="statisticsDiv">
        <div class="group">
            <div class="stat">First civilization met: ${firstCiv ?
            `<span onclick="${generateScrollJS(firstCiv.Id)}">${firstCiv.name}</span>` : "None"}</div>
            
            <div class="stat">First Natural Wonder found: ${firstNaturalWonder ?
            `<span onclick="${generateScrollJS(firstNaturalWonder.Id)}">${firstNaturalWonder.name}</span>` : "None"}</div>
            
            <div class="stat">World Wonders built:
                ${worldWonders.length > 0 ? (
            worldWonders.length > 3 ? `<div id="showHideToggle" class="hidden" onclick="worldWondersToggle(\`${wwHTML}\`)">Show all</div>`
                : wwHTML) : "None"}
                    <div id="showHide"></div>
            </div>
            
            <div class="stat">Total Great People Recruited: <span>${totalGreatPeople}</span></div>
        </div>
        <div class="group">
            <div class="stat">Golden/Heroic Ages: <span>${goldenAges}</span></div>
            <div class="stat">Dark Ages: <span>${darkAges}</span></div>

            ${defeatedCivs.length > 0 ? `<div class="stat">Defeated Civs: 
                ${defeatedCivs.map(c => `<span onclick="${generateScrollJS(c.Id)}">${c.name}</span>`).join(", ")}</div>` : ""}
            ${defeatedBy ? `<div class="stat">Defeated By: <span>${defeatedBy}</span></div>` : ""}
        </div>

        <div class="group mt-4">
            <div class="stat">Total era score: <span>${totalScore}</span></div>

            <div class="stat allEras">
                ${Object.entries(bestEraData).map(era => {
                    return `${getEra(era[0])} Era: <span>${era[1]}</span>`;
                }).join("<br />")}
            </div>
            <div style="font-size: 11px;" class="mt-2">Era score totals do not include dedications.<br/></div>
        </div>
    </div>`;
}

function worldWondersToggle(html) {
    if ($('#showHideToggle').hasClass('hidden')) {
        $('#showHide').html(html);
        $('#showHideToggle').removeClass('hidden').html('Show less');
    } else {
        $('#showHide').html('');
        $('#showHideToggle').addClass('hidden').html('Show all');
    }
}