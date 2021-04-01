const formats = {

}

function getCivName(civ) {
    civ = civ.split("CIVILIZATION_")[1].replace(/\_/g, " ");

    return civ.toLowerCase().split(" ").map(c => c[0].toUpperCase() + c.slice(1)).join(" ");
}

function getEra(era) {
    era = era.split("ERA_")[1].toLowerCase();

    return era[0].toUpperCase() + era.slice(1);
}

function formatMoment(moment) {
    moment = moment.split("MOMENT_")[1].replace(/\_/g, " ");

    moment = moment.startsWith("GAME ERA STARTED WITH") ? moment.split("GAME ")[1] : moment;

    return moment.toLowerCase().split(" ").map(m => m[0].toUpperCase() + m.slice(1)).join(" ");
}