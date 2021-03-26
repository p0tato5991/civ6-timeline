function readURL(input) {
    if (input.files && input.files[0]) {

        var reader = new FileReader();

        reader.onload = function (e) {
            try {
                var res = atob(e.target.result.split("base64,")[1]);

                var json = JSON.parse(res);

                generateTimeline(json.Players, json.Moments);
            } catch {
                new jBox('Notice', {
                    content: "Invalid file format, it must be a JSON file",
                    color: "red"
                });

                return false;
            }
        };

        reader.readAsDataURL(input.files[0]);
    }
}

async function generateTimeline(players, moments) {
    players = players.filter(p => p.CivilizationDescription.includes("Empire"));

    moments = moments.filter(m => m.EraScore > 0);

    console.log(moments);
}