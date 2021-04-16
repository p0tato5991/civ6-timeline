$(document).ready(function () {
    let params = new URLSearchParams(window.location.search);

    if (params.get("timeline")) {
        try {
            let players = JSON.parse(window.localStorage.getItem("players"));
            let moments = JSON.parse(window.localStorage.getItem("moments"));

            let options = { goodyhuts: true, details: true, tooltips: false };
            optionTitles.map(o => {
                if (window.localStorage.getItem(o)) {
                    options[o] = JSON.parse(window.localStorage.getItem(o));
                } else {
                    window.localStorage.setItem(o, options[o].toString());
                }
            });

            if (players && moments) {
                let finished = generateTimeline(players, 0, moments, options);
                if (finished.failed) {
                    window.localStorage.removeItem("players");
                    window.localStorage.removeItem("moments");
                    window.location.href = window.location.pathname;
                    return;
                }
            } else {
                window.location.href = window.location.pathname;
            }
        } catch {
            return;
        }
    }
});