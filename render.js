// globals
var optionTitles = ["tooltips", "goodyhuts", "details"];

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

                return false;
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
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	            viewBox="0 0 330 330" style="enable-background:new 0 0 330 330;" xml:space="preserve">
                <path id="XMLID_29_" d="${scrollIcon}" />
            </svg>
        </button>
        `)

    // player selection
    var playerSelect = $(`<select id="select-player" class="select-player" onchange="regenTimeline()">
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
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
            .append(timelineOptions);

        // set popover html
        $("#timeline-options").attr("data-bs-content", timelineOptionsPopover);
        new bootstrap.Popover(document.getElementById("timeline-options-trigger"), {
            html: true,
            content: timelineOptionsPopover,
            placement: "left",
            sanitize: false,
        })
        // if timeline has already been created
    } else {
        regenTimeline();
    }

    // set scroll to era div popover html
    let scrolltohtml = `<div class="scrolltoErasContainer"><div class="scrolltoErasContainerTitle">Scroll to:</div>
            ${Object.entries(getCurrentGameEras()).map(era => {
        return `<div class="scrolltoEra" onclick="
            document.getElementById('${era[0]}').scrollIntoView({
                block: 'center',
                inline: 'center',
                behavior: 'smooth',
            });
            $('#timeline-scrollto-trigger').trigger('click');
        ">${era[1]}</div>`
    }).join("")}
        </div>`
    $("#timeline-scrollto-trigger").attr("data-bs-content", scrolltohtml);
    let scrolltoPopover = new bootstrap.Popover(document.getElementById("timeline-scrollto-trigger"), {
        html: true,
        content: scrolltohtml,
        placement: "right",
        sanitize: false,
        trigger: 'focus',
    });

    // set scroll to era div dynamic classes
    let scrolltoTrigger = $("#timeline-scrollto-trigger");
    scrolltoTrigger.on('click', function () {
        if (!scrolltoTrigger.hasClass("open")) {
            $("#timeline-scrollto-trigger").addClass("open");
        } else {
            scrolltoPopover.dispose();
            scrolltoTrigger.removeClass("open")
        }
    });

    $(document).on('click', function (e) {
        let target = $(e.target);

        if (scrolltoTrigger.hasClass('open') && !target.closest("#timeline-scrollto-trigger").length) {
            scrolltoTrigger.removeClass('open');
        }
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

        if ($("#uploadNew").length == 0)
            $("#app").append($(`<button class="btn btn-warning" id="uploadNew" onclick="window.location.href=window.location.pathname">
                Upload another timeline
            </button>`));

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
        $("select").prettyDropdown({
            hoverIntent: -1,
        });
    } catch (e) {
        console.log(e);

        // catch errors
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



////////////////////
// HELPER FUNCTIONS
////////////////////
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

function getCurrentGameEras() {
    let moments = JSON.parse(window.localStorage.getItem("moments"));

    if (!moments) return false;

    let eras = {};
    moments.forEach(moment => {
        if (!eras[moment.GameEra]) {
            eras[moment.GameEra + "_DIV"] = getEra(moment.GameEra) + " Era";
        }
    });

    return eras;
}