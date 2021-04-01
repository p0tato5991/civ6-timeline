// globals
var optionTitles = ["tooltips", "goodyhuts", "details"];

function readFile(input) {
    if (input.files && input.files[0]) {

        // create FileReader
        var reader = new FileReader();

        // call function after file is read
        reader.onload = function (e) {
            try {
                // decode result (the JSON file is base64 encoded)
                var res = atob(e.target.result.split("base64,")[1]);

                // parse decoded result
                var json = JSON.parse(res);

                // filter players and moments
                let players = json.Players.filter(p => p.CivilizationDescription.includes("Empire"));
                let moments = json.Moments.filter(m => m.EraScore > 0 || m.Type.startsWith("MOMENT_GAME_ERA_STARTED_WITH"));

                // add players and moments to localstorage
                window.localStorage.setItem("players", JSON.stringify(players));
                window.localStorage.setItem("moments", JSON.stringify(moments));

                let defaults = { goodyhuts: true, details: true, tooltips: false };
                optionTitles.map(o => {
                    window.localStorage.setItem(o, defaults[o].toString());
                });

                // generate timeline
                window.location.href = `${window.location.href}?timeline=1`;
                generateTimeline(players, 0, moments, defaults);
            } catch {
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
        <button id="timeline-options-trigger" type="button" data-bs-toggle="popover">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 \
                1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 \
                3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 \
                1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 \
                3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 \
                3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 \
                3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 \
                2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/>
            </svg>
        </button>
        `)
    var timelineOptionsPopover = getTimelineOptionsCheckboxes();

    // timeline settings parent
    var timelineSettingsParent;
    if ($("#timeline-settings").length == 0) {
        timelineSettingsParent = $('<div id="timeline-settings"></div>')

        $("#app").empty()
            .append(timelineSettingsParent)
            .append(playerSelect)
            .append(timelineOptions);

        $("#timeline-options").attr("data-bs-content", timelineOptionsPopover);
        new bootstrap.Popover(document.getElementById("timeline-options-trigger"), {
            html: true,
            content: timelineOptionsPopover,
            placement: "top",
            sanitize: false,
        })
        $("#timeline-options-trigger").on("click", function () {
            $("#timeline-options-trigger").toggleClass("open");
        });
    } else {
        regenTimeline();
    }
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

function getTimelineOptions() {
    let options = {};

    optionTitles.map(o => {
        options[o] = JSON.parse(window.localStorage.getItem(o));
    });

    return options;
}

function saveOption(option) {
    window.localStorage.setItem(option, $(`input[value="${option}"]:checked`).length > 0);
}

function getTimelineOptionsCheckboxes() {
    // get options
    let options = {};
    optionTitles.map(o => {
        options[o] = JSON.parse(window.localStorage.getItem(o));
    });

    console.log(options)

    // return html
    return `<form onchange="[${optionTitles.map(o => "'" + o + "'").join(",")}].map(o => {
        saveOption(o);
    }); regenTimelineSettings();" id="timeline-options">
        <label class="optionLabel">
            <input type="checkbox" value="tooltips" ${options["tooltips"] ? "checked" : ""}>
            Show tooltips</label>
        
        <label class="optionLabel">
            <input type="checkbox" value="goodyhuts" ${options["goodyhuts"] ? "checked" : ""}>
            Show goody hut triggered moments</label>
        
        <label class="optionLabel">
            <input type="checkbox" value="details" ${options["details"] ? "checked" : ""}>
            Show moment details</label>
        </form>`;
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
                timeline.append(`<div class="eraDivider">${getEra(moment.GameEra)}  Era</div>`)
            }
            current = moment.GameEra;

            timeline.append(`<div id="moment_${moment.Id}" class="moment">
                <p class="momentTitle">${formatMoment(moment.Type)}</p>
                <p class="momentDescription">${moment.InstanceDescription}</p>
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
            moments.forEach(moment => {
                $(`#moment_${moment.Id}`).jBox("Mouse", {
                    content: formatMoment(moment.Type),
                    fade: false,
                    animation: "zoomIn"
                });
            });
        }

        // add timeline horizontal scrolling
        function scrollHorizontally(e) {
            e = window.event || e;
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            document.getElementById('timeline').scrollLeft -= (delta * 300);
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