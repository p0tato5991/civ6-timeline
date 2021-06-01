function getCivName(civ) {
    civ = civ.split("CIVILIZATION_")[1].replace(/\_/g, " ");

    return civ.toLowerCase().split(" ").map(c => c[0].toUpperCase() + c.slice(1)).join(" ");
}

function getCivNameByID(id) {
    let civs = JSON.parse(window.localStorage.getItem("players"));

    return civs.find(c => c.Id === id);
}

function getEra(era) {
    era = era.split("ERA_")[1].toLowerCase();

    return era[0].toUpperCase() + era.slice(1);
}

function getCurrentGameEras(civID) {
    let moments = JSON.parse(window.localStorage.getItem("moments")).filter(m => m.ActingPlayer === civID);

    let eras = {};
    moments.forEach(moment => {
        if (!eras[moment.GameEra]) {
            eras[moment.GameEra] = getEra(moment.GameEra) + " Era";
        }
    });

    return eras;
}

function formatMoment(moment) {
    return moments[`LOC_${moment}`];
}

const icons = ["Citizen", "Governor", "Envoy", "GreatPerson", "GreatAdmiral", "GreatGeneral", "TradingPost", "Power", "Science", "Gold", "Faith", "Production", "Culture"];
function formatMomentTooltip(moment) {
    let tooltip = moments[`LOC_${moment}_DESCRIPTION`];

    for (const key of icons) {
        if (tooltip.includes(`[ICON_${key}]`)) {
            tooltip = tooltip.replace(`[ICON_${key}]`, `<img src="assets/icons/Civ6${key}.png">`);
        }
    }

    return tooltip;
}

const mainDLCs = ["Rise and Fall", "Gathering Storm"];
const dlcs = ["Rise and Fall", "Gathering Storm", "Australia", "Indonesia and Khmer", "Macedonia and Persia", "Nubia", "Poland", "Vikings Wonders"];
function getMomentImg(moment, text, era) {
    let img;
    mainDLCs.forEach(dlc => {
        if (typeof imageRefs[dlc][moment] !== "undefined") {
            let dlcImage = imageRefs[dlc][moment];
            if (dlcImage.endsWith(".png")) {
                img = `assets/historic moment images/large/${dlc}/${dlcImage}`;
            } else {
                img = dlcImage;
            }
        }
    });

    if (img) {
        if (img.endsWith(".png")) {
            return {
                type: "large",
                src: img,
            };
        } else if (img.endsWith(".customimage")) {
            let uniqueImg = getUniqueImg(img.replace(".customimage", ""), text, era);

            if (uniqueImg.endsWith(".png")) {
                return {
                    type: "large",
                    src: `assets/historic moment images/large/${uniqueImg}`
                };
            } else {
                return {
                    type: "small",
                    src: `assets/historic moment images/small/${uniqueImg}.png`
                };
            }
        } else {
            return {
                type: "small",
                src: `assets/historic moment images/small/${img}.png`,
            }
        }
    } else {
        return false;
    }
}

function getUniqueImg(illustration, text, era) {
    let obj = customImgRefs[illustration];

    if (obj.type === "era") {
        for (i = 0; i < obj.data.length; i++) {
            let value = obj.data[i];
            if (typeof value.era === "object" ? value.era.includes(era) : value.era === era) {
                return `${value.dlc}/${value.src}`;
            }
        }
        return obj.default;
    } else if (obj.type === "unique") {
        for (i = 0; i < obj.data.length; i++) {
            let value = obj.data[i];
            if (text.includes(value.find)) {
                return `${value.dlc}/${value.src}`;
            }
        }
        return obj.default;
    }
}

let moments = {
    // Rise and Fall
    "LOC_MOMENT_ARTIFACT_EXTRACTED": "Artifact Extracted",
    "LOC_MOMENT_ARTIFACT_EXTRACTED_DESCRIPTION": "An artifact has been uncovered, giving us insight into the past.",
    "LOC_MOMENT_ARTIFACT_EXTRACTED_SHIPWRECK_FIRST": "First Shipwreck Excavated",
    "LOC_MOMENT_ARTIFACT_EXTRACTED_SHIPWRECK_FIRST_DESCRIPTION": "Your archaeologists have excavated their first shipwreck.",
    "LOC_MOMENT_ARTIFACT_EXTRACTED_SHIPWRECK_FIRST_IN_WORLD": "World's First Shipwreck Excavated",
    "LOC_MOMENT_ARTIFACT_EXTRACTED_SHIPWRECK_FIRST_IN_WORLD_DESCRIPTION": "Your archaeologists have completed the world's first excavation of a shipwreck.",
    "LOC_MOMENT_BARBARIAN_CAMP_DESTROYED": "Barbarian Camp Destroyed",
    "LOC_MOMENT_BARBARIAN_CAMP_DESTROYED_DESCRIPTION": "A hostile barbarian camp was leveled to the ground by a unit, spreading peace through the area.",
    "LOC_MOMENT_BARBARIAN_CAMP_DESTROYED_NEAR_YOUR_CITY": "Threatening Camp Destroyed",
    "LOC_MOMENT_BARBARIAN_CAMP_DESTROYED_NEAR_YOUR_CITY_DESCRIPTION": "A hostile barbarian camp within 6 tiles of one of your cities was destroyed by a unit.",
    "LOC_MOMENT_BATTLE_FOUGHT": "Battle Fought",
    "LOC_MOMENT_BATTLE_FOUGHT_DESCRIPTION": "A battle was fought between adversaries. Used by the Archaeology system to potentially generate [ICON_RESOURCE_ANTIQUITY_SITE] Antiquity Site resources.",
    "LOC_MOMENT_BELIEF_ADDED_MAX_BELIEFS_REACHED": "Religion Adopts All Beliefs",
    "LOC_MOMENT_BELIEF_ADDED_MAX_BELIEFS_REACHED_DESCRIPTION": "Your Religion has added its final Belief and is now complete.",
    "LOC_MOMENT_BELIEF_ADDED_MAX_BELIEFS_REACHED_FIRST_IN_WORLD": "World's First Religion to Adopt All Beliefs",
    "LOC_MOMENT_BELIEF_ADDED_MAX_BELIEFS_REACHED_FIRST_IN_WORLD_DESCRIPTION": "Your Religion is the first in the world to add its final Belief and become complete.",
    "LOC_MOMENT_BUILDING_CONSTRUCTED_FIRST_UNIQUE": "Unique Building Constructed",
    "LOC_MOMENT_BUILDING_CONSTRUCTED_FIRST_UNIQUE_DESCRIPTION": "You have completed this unique building for the first time.",
    "LOC_MOMENT_BUILDING_CONSTRUCTED_FULL_AERODROME_FIRST": "First Aerodrome Fully Developed",
    "LOC_MOMENT_BUILDING_CONSTRUCTED_FULL_AERODROME_FIRST_DESCRIPTION": "You have completed every building in an Aerodrome district for the first time.",
    "LOC_MOMENT_BUILDING_CONSTRUCTED_FULL_ENCAMPMENT_FIRST": "First Encampment Fully Developed",
    "LOC_MOMENT_BUILDING_CONSTRUCTED_FULL_ENCAMPMENT_FIRST_DESCRIPTION": "You have completed every building in an Encampment district for the first time.",
    "LOC_MOMENT_BUILDING_CONSTRUCTED_FULL_ENTERTAINMENT_COMPLEX_FIRST": "First Entertainment Complex Fully Developed",
    "LOC_MOMENT_BUILDING_CONSTRUCTED_FULL_ENTERTAINMENT_COMPLEX_FIRST_DESCRIPTION": "You have completed every building in an Entertainment Complex district for the first time.",
    "LOC_MOMENT_BUILDING_CONSTRUCTED_FULL_WATER_ENTERTAINMENT_COMPLEX_FIRST": "First Water Park Fully Developed",
    "LOC_MOMENT_BUILDING_CONSTRUCTED_FULL_WATER_ENTERTAINMENT_COMPLEX_FIRST_DESCRIPTION": "You have completed every building in a Water Park district for the first time.",
    "LOC_MOMENT_BUILDING_CONSTRUCTED_GAME_ERA_WONDER": "World Wonder Completed",
    "LOC_MOMENT_BUILDING_CONSTRUCTED_GAME_ERA_WONDER_DESCRIPTION": "A world wonder is completed, showing our grandeur over other civilizations.",
    "LOC_MOMENT_BUILDING_CONSTRUCTED_PAST_ERA_WONDER": "Old World Wonder Completed",
    "LOC_MOMENT_BUILDING_CONSTRUCTED_PAST_ERA_WONDER_DESCRIPTION": "A World Wonder is completed. Even though it belongs to a bygone era, it will still show our grandeur over other civilizations.",
    "LOC_MOMENT_CITY_BUILT_BECAME_LARGEST_CIV_BY_MARGIN": "World's Largest Civilization",
    "LOC_MOMENT_CITY_BUILT_BECAME_LARGEST_CIV_BY_MARGIN_DESCRIPTION": "Your civilization has become the largest in the world, with at least 3 more cities than its next biggest rival.",
    "LOC_MOMENT_CITY_BUILT_NEAR_NATURAL_WONDER": "City of Awe",
    "LOC_MOMENT_CITY_BUILT_NEAR_NATURAL_WONDER_DESCRIPTION": "A city is placed within 2 tiles of a natural wonder.",
    "LOC_MOMENT_CITY_BUILT_NEAR_OTHER_CIV_CITY": "Aggressive City Placement",
    "LOC_MOMENT_CITY_BUILT_NEAR_OTHER_CIV_CITY_DESCRIPTION": "A city is placed within 5 tiles of another civilization's city.",
    "LOC_MOMENT_CITY_BUILT_NEW_CONTINENT": "City on New Continent",
    "LOC_MOMENT_CITY_BUILT_NEW_CONTINENT_DESCRIPTION": "A city is placed on a continent you have not yet settled.",
    "LOC_MOMENT_CITY_BUILT_ON_DESERT": "Desert City",
    "LOC_MOMENT_CITY_BUILT_ON_DESERT_DESCRIPTION": "A city is established on difficult Desert terrain, expanding your reach into the wilds.",
    "LOC_MOMENT_CITY_BUILT_ON_SNOW": "Snow City",
    "LOC_MOMENT_CITY_BUILT_ON_SNOW_DESCRIPTION": "A city is established on difficult Snow terrain, expanding your reach into the wilds.",
    "LOC_MOMENT_CITY_BUILT_ON_TUNDRA": "Tundra City",
    "LOC_MOMENT_CITY_BUILT_ON_TUNDRA_DESCRIPTION": "A city is established on difficult Tundra terrain, expanding your reach into the wilds.",
    "LOC_MOMENT_CITY_CHANGED_RELIGION_ENEMY_CITY_DURING_WAR": "Enemy City Adopts Our Religion",
    "LOC_MOMENT_CITY_CHANGED_RELIGION_ENEMY_CITY_DURING_WAR_DESCRIPTION": "An enemy city, despite being at war, has seen the light and adopted our Religion.",
    "LOC_MOMENT_CITY_CHANGED_RELIGION_OTHER_HOLY_CITY": "Rival Holy City Converted",
    "LOC_MOMENT_CITY_CHANGED_RELIGION_OTHER_HOLY_CITY_DESCRIPTION": "The Holy City of another Religion has converted to our Religion.",
    "LOC_MOMENT_CITY_SIZE_EXTRA_LARGE_FIRST": "First Gigantic City",
    "LOC_MOMENT_CITY_SIZE_EXTRA_LARGE_FIRST_DESCRIPTION": "A city has reached 25 [ICON_Citizen] Population for the first time in your civilization.",
    "LOC_MOMENT_CITY_SIZE_EXTRA_LARGE_FIRST_IN_WORLD": "World's First Gigantic City",
    "LOC_MOMENT_CITY_SIZE_EXTRA_LARGE_FIRST_IN_WORLD_DESCRIPTION": "A city has reached 25 [ICON_Citizen] Population for the first time in the world.",
    "LOC_MOMENT_CITY_SIZE_LARGE_FIRST": "First Enormous City",
    "LOC_MOMENT_CITY_SIZE_LARGE_FIRST_DESCRIPTION": "A city has reached 20 [ICON_Citizen] Population for the first time in your civilization.",
    "LOC_MOMENT_CITY_SIZE_LARGE_FIRST_IN_WORLD": "World's First Enormous City",
    "LOC_MOMENT_CITY_SIZE_LARGE_FIRST_IN_WORLD_DESCRIPTION": "A city has reached 20 [ICON_Citizen] Population for the first time in the world.",
    "LOC_MOMENT_CITY_SIZE_MEDIUM_FIRST": "First Large City",
    "LOC_MOMENT_CITY_SIZE_MEDIUM_FIRST_DESCRIPTION": "A city has reached 15 [ICON_Citizen] Population for the first time in your civilization.",
    "LOC_MOMENT_CITY_SIZE_MEDIUM_FIRST_IN_WORLD": "World's First Large City",
    "LOC_MOMENT_CITY_SIZE_MEDIUM_FIRST_IN_WORLD_DESCRIPTION": "A city has reached 15 [ICON_Citizen] Population for the first time in the world.",
    "LOC_MOMENT_CITY_SIZE_SMALL_FIRST": "First Bustling City",
    "LOC_MOMENT_CITY_SIZE_SMALL_FIRST_DESCRIPTION": "A city has reached 10 [ICON_Citizen] Population for the first time in your civilization.",
    "LOC_MOMENT_CITY_SIZE_SMALL_FIRST_IN_WORLD": "World's First Bustling City",
    "LOC_MOMENT_CITY_SIZE_SMALL_FIRST_IN_WORLD_DESCRIPTION": "A city has reached 10 [ICON_Citizen] Population for the first time in the world.",
    "LOC_MOMENT_CITY_TRANSFERRED_DISLOYAL_FOREIGN_CITY": "Foreign City Joins",
    "LOC_MOMENT_CITY_TRANSFERRED_DISLOYAL_FOREIGN_CITY_DESCRIPTION": "A foreign city has decided to pledge its loyalty to us instead, joining our empire.",
    "LOC_MOMENT_CITY_TRANSFERRED_DISLOYAL_FREE_CITY": "Free City Joins",
    "LOC_MOMENT_CITY_TRANSFERRED_DISLOYAL_FREE_CITY_DESCRIPTION": "A Free City has decided to pledge its loyalty to us, joining our empire.",
    "LOC_MOMENT_CITY_TRANSFERRED_FOREIGN_CAPITAL": "Foreign Capital Taken",
    "LOC_MOMENT_CITY_TRANSFERRED_FOREIGN_CAPITAL_DESCRIPTION": "You have taken control of a foreign power's original capital city.",
    "LOC_MOMENT_CITY_TRANSFERRED_PLAYER_DEFEATED": "Final Foreign City Taken",
    "LOC_MOMENT_CITY_TRANSFERRED_PLAYER_DEFEATED_DESCRIPTION": "You have taken control of a civilization's last remaining city.",
    "LOC_MOMENT_CITY_TRANSFERRED_TO_ORIGINAL_OWNER": "City Returns to Original Owner",
    "LOC_MOMENT_CITY_TRANSFERRED_TO_ORIGINAL_OWNER_DESCRIPTION": "A city has returned to its original owner.",
    "LOC_MOMENT_CIVIC_CULTURVATED_IN_ERA_FIRST": "First Civic of New Era",
    "LOC_MOMENT_CIVIC_CULTURVATED_IN_ERA_FIRST_DESCRIPTION": "You have completed your civilization's first civic from a new era of discovery.",
    "LOC_MOMENT_CIVIC_CULTURVATED_IN_ERA_FIRST_IN_WORLD": "World's First Civic of New Era",
    "LOC_MOMENT_CIVIC_CULTURVATED_IN_ERA_FIRST_IN_WORLD_DESCRIPTION": "You have completed the world's first civic from a new era of discovery.",
    "LOC_MOMENT_DISTRICT_CONSTRUCTED_FIRST_UNIQUE": "Unique District Completed",
    "LOC_MOMENT_DISTRICT_CONSTRUCTED_FIRST_UNIQUE_DESCRIPTION": "You have completed this unique district for the first time.",
    "LOC_MOMENT_DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_CAMPUS": "Splendid Campus Completed",
    "LOC_MOMENT_DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_CAMPUS_DESCRIPTION": "You have completed your civilization's first Campus with a starting adjacency bonus of 3 [ICON_Science] Science or higher.",
    "LOC_MOMENT_DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_COMMERCIAL_HUB": "Splendid Commercial Hub Completed",
    "LOC_MOMENT_DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_COMMERCIAL_HUB_DESCRIPTION": "You have completed your civilization's first Commercial Hub with a starting adjacency bonus of 4 [ICON_Gold] Gold or higher.",
    "LOC_MOMENT_DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_HARBOR": "Splendid Harbor Completed",
    "LOC_MOMENT_DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_HARBOR_DESCRIPTION": "You have completed your civilization's first Harbor with a starting adjacency bonus of 4 [ICON_Gold] Gold or higher.",
    "LOC_MOMENT_DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_HOLY_SITE": "Splendid Holy Site Completed",
    "LOC_MOMENT_DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_HOLY_SITE_DESCRIPTION": "You have completed your civilization's first Holy Site with a starting adjacency bonus of 3 [ICON_Faith] Faith or higher.",
    "LOC_MOMENT_DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_INDUSTRIAL_ZONE": "Splendid Industrial Zone Completed",
    "LOC_MOMENT_DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_INDUSTRIAL_ZONE_DESCRIPTION": "You have completed your civilization's first Industrial Zone with a starting adjacency bonus of 4 [ICON_Production] Production or higher.",
    "LOC_MOMENT_DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_THEATER_SQUARE": "Splendid Theater Square Completed",
    "LOC_MOMENT_DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_THEATER_SQUARE_DESCRIPTION": "You have completed your civilization's first Theater Square with a starting adjacency bonus of 3 [ICON_Culture] Culture or higher.",
    "LOC_MOMENT_DISTRICT_CONSTRUCTED_NEIGHBORHOOD_FIRST": "First Neighborhood Completed",
    "LOC_MOMENT_DISTRICT_CONSTRUCTED_NEIGHBORHOOD_FIRST_DESCRIPTION": "You have completed your civilization's first Neighborhood district.",
    "LOC_MOMENT_DISTRICT_CONSTRUCTED_NEIGHBORHOOD_FIRST_IN_WORLD": "World's First Neighborhood",
    "LOC_MOMENT_DISTRICT_CONSTRUCTED_NEIGHBORHOOD_FIRST_IN_WORLD_DESCRIPTION": "You have completed the world's first Neighborhood district.",
    "LOC_MOMENT_EMERGENCY_WON_AS_MEMBER": "Emergency Completed Successfully",
    "LOC_MOMENT_EMERGENCY_WON_AS_MEMBER_DESCRIPTION": "As a member, you have succeeded in an Emergency.",
    "LOC_MOMENT_EMERGENCY_WON_AS_TARGET": "Emergency Successfully Defended",
    "LOC_MOMENT_EMERGENCY_WON_AS_TARGET_DESCRIPTION": "As the target, you have succeeded in fighting off an Emergency against you.",
    "LOC_MOMENT_FIND_NATURAL_WONDER": "Discovery of a Natural Wonder",
    "LOC_MOMENT_FIND_NATURAL_WONDER_DESCRIPTION": "Your civilization discovers this natural wonder for the first time.",
    "LOC_MOMENT_FIND_NATURAL_WONDER_FIRST_IN_WORLD": "First Discovery of a Natural Wonder",
    "LOC_MOMENT_FIND_NATURAL_WONDER_FIRST_IN_WORLD_DESCRIPTION": "Our civilization's explorers are the first in the world to behold this natural wonder.",
    "LOC_MOMENT_FIND_NEW_CONTINENT_FIRST_IN_WORLD": "First Discovery of a New Continent",
    "LOC_MOMENT_FIND_NEW_CONTINENT_FIRST_IN_WORLD_DESCRIPTION": "Our civilization's explorers are the first in the world to find this continent.",
    "LOC_MOMENT_FORMATION_ARMADA_FIRST": "First Armada",
    "LOC_MOMENT_FORMATION_ARMADA_FIRST_DESCRIPTION": "Your civilization's first Armada is formed.",
    "LOC_MOMENT_FORMATION_ARMADA_FIRST_IN_WORLD": "World's First Armada",
    "LOC_MOMENT_FORMATION_ARMADA_FIRST_IN_WORLD_DESCRIPTION": "The world's very first Armada is formed, under your command.",
    "LOC_MOMENT_FORMATION_ARMY_FIRST": "First Army",
    "LOC_MOMENT_FORMATION_ARMY_FIRST_DESCRIPTION": "Your civilization's first Army is formed.",
    "LOC_MOMENT_FORMATION_ARMY_FIRST_IN_WORLD": "World's First Army",
    "LOC_MOMENT_FORMATION_ARMY_FIRST_IN_WORLD_DESCRIPTION": "The world's very first Army is formed, under your command.",
    "LOC_MOMENT_FORMATION_CORPS_FIRST": "First Corps",
    "LOC_MOMENT_FORMATION_CORPS_FIRST_DESCRIPTION": "Your civilization's first Corps is formed.",
    "LOC_MOMENT_FORMATION_CORPS_FIRST_IN_WORLD": "World's First Corps",
    "LOC_MOMENT_FORMATION_CORPS_FIRST_IN_WORLD_DESCRIPTION": "The world's very first Corps is formed, under your command.",
    "LOC_MOMENT_FORMATION_FLEET_FIRST": "First Fleet",
    "LOC_MOMENT_FORMATION_FLEET_FIRST_DESCRIPTION": "Your civilization's first Fleet is formed.",
    "LOC_MOMENT_FORMATION_FLEET_FIRST_IN_WORLD": "World's First Fleet",
    "LOC_MOMENT_FORMATION_FLEET_FIRST_IN_WORLD_DESCRIPTION": "The world's very first Fleet is formed, under your command.",
    "LOC_MOMENT_GAME_ERA_STARTED_WITH_DARK_AGE": "Dark Age Begins",
    "LOC_MOMENT_GAME_ERA_STARTED_WITH_DARK_AGE_DESCRIPTION": "The game enters a new era, and your civilization has the challenges of a Dark Age to overcome.",
    "LOC_MOMENT_GAME_ERA_STARTED_WITH_GOLDEN_AGE": "Golden Age Begins",
    "LOC_MOMENT_GAME_ERA_STARTED_WITH_GOLDEN_AGE_DESCRIPTION": "The game enters a new era, and your civilization has earned a Golden Age.",
    "LOC_MOMENT_GAME_ERA_STARTED_WITH_HEROIC_AGE": "Heroic Age Begins",
    "LOC_MOMENT_GAME_ERA_STARTED_WITH_HEROIC_AGE_DESCRIPTION": "The game enters a new era, and your civilization has earned a Heroic Age after overcoming past challenges.",
    "LOC_MOMENT_GAME_ERA_STARTED_WITH_NORMAL_AGE": "Normal Age Begins",
    "LOC_MOMENT_GAME_ERA_STARTED_WITH_NORMAL_AGE_DESCRIPTION": "The game enters a new era, and you have avoided a Dark Age.",
    "LOC_MOMENT_GOODY_HUT_TRIGGERED": "Tribal Village Contacted",
    "LOC_MOMENT_GOODY_HUT_TRIGGERED_DESCRIPTION": "A Tribal Village was contacted, giving strength to our budding cities.",
    "LOC_MOMENT_GOVERNMENT_ENACTED_TIER_1_FIRST": "First Tier 1 Government",
    "LOC_MOMENT_GOVERNMENT_ENACTED_TIER_1_FIRST_DESCRIPTION": "Your civilization adopts its first Tier 1 Government.",
    "LOC_MOMENT_GOVERNMENT_ENACTED_TIER_1_FIRST_IN_WORLD": "First Tier 1 Government in World",
    "LOC_MOMENT_GOVERNMENT_ENACTED_TIER_1_FIRST_IN_WORLD_DESCRIPTION": "Your civilization is the first to adopt a Tier 1 Government in the world.",
    "LOC_MOMENT_GOVERNMENT_ENACTED_TIER_2_FIRST": "First Tier 2 Government",
    "LOC_MOMENT_GOVERNMENT_ENACTED_TIER_2_FIRST_DESCRIPTION": "Your civilization adopts its first Tier 2 Government.",
    "LOC_MOMENT_GOVERNMENT_ENACTED_TIER_2_FIRST_IN_WORLD": "First Tier 2 Government in World",
    "LOC_MOMENT_GOVERNMENT_ENACTED_TIER_2_FIRST_IN_WORLD_DESCRIPTION": "Your civilization is the first to adopt a Tier 2 Government in the world.",
    "LOC_MOMENT_GOVERNMENT_ENACTED_TIER_3_FIRST": "First Tier 3 Government",
    "LOC_MOMENT_GOVERNMENT_ENACTED_TIER_3_FIRST_DESCRIPTION": "Your civilization adopts its first Tier 3 Government.",
    "LOC_MOMENT_GOVERNMENT_ENACTED_TIER_3_FIRST_IN_WORLD": "First Tier 3 Government in World",
    "LOC_MOMENT_GOVERNMENT_ENACTED_TIER_3_FIRST_IN_WORLD_DESCRIPTION": "Your civilization is the first to adopt a Tier 3 Government in the world.",
    "LOC_MOMENT_GOVERNOR_ALL_APPOINTED_FIRST": "All Governors Appointed",
    "LOC_MOMENT_GOVERNOR_ALL_APPOINTED_FIRST_DESCRIPTION": "You have appointed all available [ICON_Governor] Governors, securing the prosperity of many cities.",
    "LOC_MOMENT_GOVERNOR_FULLY_PROMOTED_FIRST": "Governor Fully Promoted",
    "LOC_MOMENT_GOVERNOR_FULLY_PROMOTED_FIRST_DESCRIPTION": "You have fully promoted a [ICON_Governor] Governor for the first time, unlocking powerful abilities to help a city.",
    "LOC_MOMENT_GREAT_PERSON_CREATED_GAME_ERA": "Great Person Recruited",
    "LOC_MOMENT_GREAT_PERSON_CREATED_GAME_ERA_DESCRIPTION": "A [ICON_GreatPerson] Great Person has traveled to our lands to share unique talents.",
    "LOC_MOMENT_GREAT_PERSON_CREATED_PAST_ERA": "Old Great Person Recruited",
    "LOC_MOMENT_GREAT_PERSON_CREATED_PAST_ERA_DESCRIPTION": "A [ICON_GreatPerson] Great Person has traveled to our lands. Though better suited to a past era, they will still contribute great things to our civilization.",
    "LOC_MOMENT_GREAT_PERSON_CREATED_PATRONAGE_FAITH_OVER_HALF": "Great Person Lured by Faith",
    "LOC_MOMENT_GREAT_PERSON_CREATED_PATRONAGE_FAITH_OVER_HALF_DESCRIPTION": "A [ICON_GreatPerson] Great Person has traveled to our lands to share unique talents, thanks to our use of [ICON_Faith] Faith to make up more than half their recruitment cost.",
    "LOC_MOMENT_GREAT_PERSON_CREATED_PATRONAGE_GOLD_OVER_HALF": "Great Person Lured by Gold",
    "LOC_MOMENT_GREAT_PERSON_CREATED_PATRONAGE_GOLD_OVER_HALF_DESCRIPTION": "A [ICON_GreatPerson] Great Person has traveled to our lands to share unique talents, thanks to our generous stipend of [ICON_Gold] Gold.",
    "LOC_MOMENT_IMPROVEMENT_CONSTRUCTED_FIRST_UNIQUE": "Unique Tile Improvement Built",
    "LOC_MOMENT_IMPROVEMENT_CONSTRUCTED_FIRST_UNIQUE_DESCRIPTION": "Your Builders have constructed this unique tile improvement for the first time.",
    "LOC_MOMENT_IMPROVEMENT_CONSTRUCTED_SEASIDE_RESORT_FIRST": "First Seaside Resort",
    "LOC_MOMENT_IMPROVEMENT_CONSTRUCTED_SEASIDE_RESORT_FIRST_DESCRIPTION": "You have completed your first Seaside Resort tile improvement.",
    "LOC_MOMENT_IMPROVEMENT_CONSTRUCTED_SEASIDE_RESORT_FIRST_IN_WORLD": "World's First Seaside Resort",
    "LOC_MOMENT_IMPROVEMENT_CONSTRUCTED_SEASIDE_RESORT_FIRST_IN_WORLD_DESCRIPTION": "You have completed the world's first Seaside Resort tile improvement.",
    "LOC_MOMENT_INQUISITION_LAUNCHED": "Inquisition Begins",
    "LOC_MOMENT_INQUISITION_LAUNCHED_DESCRIPTION": "Your Religion launches an inquisition.",
    "LOC_MOMENT_INQUISITION_LAUNCHED_FIRST_IN_WORLD": "World's First Inquisition",
    "LOC_MOMENT_INQUISITION_LAUNCHED_FIRST_IN_WORLD_DESCRIPTION": "Your Religion launches the world's first inquisition.",
    "LOC_MOMENT_NATIONAL_PARK_CREATED": "National Park Founded",
    "LOC_MOMENT_NATIONAL_PARK_CREATED_DESCRIPTION": "You have founded a National Park.",
    "LOC_MOMENT_NATIONAL_PARK_CREATED_FIRST_IN_WORLD": "World's First National Park",
    "LOC_MOMENT_NATIONAL_PARK_CREATED_FIRST_IN_WORLD_DESCRIPTION": "You have founded the world's first National Park.",
    "LOC_MOMENT_PANTHEON_FOUNDED": "Pantheon Founded",
    "LOC_MOMENT_PANTHEON_FOUNDED_DESCRIPTION": "Your people adopt Belief in a Pantheon.",
    "LOC_MOMENT_PANTHEON_FOUNDED_FIRST_IN_WORLD": "World's First Pantheon",
    "LOC_MOMENT_PANTHEON_FOUNDED_FIRST_IN_WORLD_DESCRIPTION": "Your people are the first in the world to adopt Belief in a Pantheon.",
    "LOC_MOMENT_PLAYER_GAVE_ENVOY_BECAME_SUZERAIN_FIRST_IN_WORLD": "City-State's First Suzerain",
    "LOC_MOMENT_PLAYER_GAVE_ENVOY_BECAME_SUZERAIN_FIRST_IN_WORLD_DESCRIPTION": "You have become the first Suzerain of this city-state.",
    "LOC_MOMENT_PLAYER_GAVE_ENVOY_CANCELED_LEVY": "Levied Army Stands Down",
    "LOC_MOMENT_PLAYER_GAVE_ENVOY_CANCELED_LEVY_DESCRIPTION": "Your use of [ICON_Envoy] Envoys has convinced this city-state's levied army to stand down.",
    "LOC_MOMENT_PLAYER_GAVE_ENVOY_CANCELED_SUZERAIN_DURING_WAR": "Enemy City-State Pacified",
    "LOC_MOMENT_PLAYER_GAVE_ENVOY_CANCELED_SUZERAIN_DURING_WAR_DESCRIPTION": "Your use of [ICON_Envoy] Envoys has toppled a hostile city-state's Suzerain, convincing it to end hostilities with you.",
    "LOC_MOMENT_PLAYER_LEVIED_MILITARY": "City-State Army Levied",
    "LOC_MOMENT_PLAYER_LEVIED_MILITARY_DESCRIPTION": "You have levied the military forces of a city-state.",
    "LOC_MOMENT_PLAYER_LEVIED_MILITARY_NEAR_ENEMY_CITY": "City-State Army Levied Near Enemy",
    "LOC_MOMENT_PLAYER_LEVIED_MILITARY_NEAR_ENEMY_CITY_DESCRIPTION": "You have levied the military forces of a city-state within striking distance of an enemy civilization.",
    "LOC_MOMENT_PLAYER_MET_ALL_MAJORS": "Met All Civilizations",
    "LOC_MOMENT_PLAYER_MET_ALL_MAJORS_DESCRIPTION": "You have met all living civilizations in the world.",
    "LOC_MOMENT_PLAYER_MET_ALL_MAJORS_FIRST_IN_WORLD": "World's First to Meet All Civilizations",
    "LOC_MOMENT_PLAYER_MET_ALL_MAJORS_FIRST_IN_WORLD_DESCRIPTION": "You are the first to meet all living civilizations in the world.",
    "LOC_MOMENT_PLAYER_MET_MAJOR": "Met New Civilization",
    "LOC_MOMENT_PLAYER_MET_MAJOR_DESCRIPTION": "You have made contact with a new civilization.",
    "LOC_MOMENT_PLAYER_OVERCAME_DARK_AGE": "Overcame Dark Age",
    "LOC_MOMENT_PLAYER_OVERCAME_DARK_AGE_DESCRIPTION": "Your civilization has earned enough Era Score to overcome its Dark Age early, and rise into a Normal Age! The next Golden Age you earn will be extra powerful.",
    "LOC_MOMENT_PROJECT_FOUNDED_MANHATTEN": "Manhattan Project Completed",
    "LOC_MOMENT_PROJECT_FOUNDED_MANHATTEN_DESCRIPTION": "Your scientists completed the Manhattan Project.",
    "LOC_MOMENT_PROJECT_FOUNDED_MARS": "Martian Colony Established",
    "LOC_MOMENT_PROJECT_FOUNDED_MARS_DESCRIPTION": "You have established a colony on Mars.",
    "LOC_MOMENT_PROJECT_FOUNDED_MARS_FIRST_IN_WORLD": "World's First Martian Colony Established",
    "LOC_MOMENT_PROJECT_FOUNDED_MARS_FIRST_IN_WORLD_DESCRIPTION": "You are the first in the world to establish a colony on Mars.",
    "LOC_MOMENT_PROJECT_FOUNDED_MOON_LANDING": "Landed on the Moon",
    "LOC_MOMENT_PROJECT_FOUNDED_MOON_LANDING_DESCRIPTION": "You send a successful mission to land on the moon.",
    "LOC_MOMENT_PROJECT_FOUNDED_MOON_LANDING_FIRST_IN_WORLD": "World's First Landing on the Moon",
    "LOC_MOMENT_PROJECT_FOUNDED_MOON_LANDING_FIRST_IN_WORLD_DESCRIPTION": "You are the first in the world to land on the moon.",
    "LOC_MOMENT_PROJECT_FOUNDED_OPERATION_IVY": "Operation Ivy Completed",
    "LOC_MOMENT_PROJECT_FOUNDED_OPERATION_IVY_DESCRIPTION": "Your scientists completed Operation Ivy.",
    "LOC_MOMENT_PROJECT_FOUNDED_SATELLITE_LAUNCH": "Satellite Launched Into Orbit",
    "LOC_MOMENT_PROJECT_FOUNDED_SATELLITE_LAUNCH_DESCRIPTION": "You launched your civilization's first satellite into orbit.",
    "LOC_MOMENT_PROJECT_FOUNDED_SATELLITE_LAUNCH_FIRST_IN_WORLD": "World's First Satellite in Orbit",
    "LOC_MOMENT_PROJECT_FOUNDED_SATELLITE_LAUNCH_FIRST_IN_WORLD_DESCRIPTION": "You launched the world's first satellite into orbit.",
    "LOC_MOMENT_RELIGION_FOUNDED": "Religion Founded",
    "LOC_MOMENT_RELIGION_FOUNDED_DESCRIPTION": "A Great Prophet founds a Religion, bringing light to your people.",
    "LOC_MOMENT_RELIGION_FOUNDED_FIRST_IN_WORLD": "World's First Religion",
    "LOC_MOMENT_RELIGION_FOUNDED_FIRST_IN_WORLD_DESCRIPTION": "Your people are the first to form a Religion, bringing light to the world at large!",
    "LOC_MOMENT_SHIP_SUNK": "Ship Sunk",
    "LOC_MOMENT_SHIP_SUNK_DESCRIPTION": "A naval unit was sunk in combat. Used by the Archaeology system to potentially generate [ICON_RESOURCE_SHIPWRECK] Shipwreck resources.",
    "LOC_MOMENT_SPY_MAX_LEVEL": "Master Spy Earned",
    "LOC_MOMENT_SPY_MAX_LEVEL_DESCRIPTION": "One of your Spies has reached its maximum promotion level.",
    "LOC_MOMENT_SPY_MAX_LEVEL_FIRST": "First Master Spy Earned",
    "LOC_MOMENT_SPY_MAX_LEVEL_FIRST_DESCRIPTION": "For the first time, one of your Spies has reached its maximum promotion level.",
    "LOC_MOMENT_TECH_RESEARCHED_IN_ERA_FIRST": "First Technology of New Era",
    "LOC_MOMENT_TECH_RESEARCHED_IN_ERA_FIRST_DESCRIPTION": "You have completed your civilization's first technology from a new era of discovery.",
    "LOC_MOMENT_TECH_RESEARCHED_IN_ERA_FIRST_IN_WORLD": "World's First Technology of New Era",
    "LOC_MOMENT_TECH_RESEARCHED_IN_ERA_FIRST_IN_WORLD_DESCRIPTION": "You have completed the world's first technology from a new era of discovery.",
    "LOC_MOMENT_TRADING_POST_CONSTRUCTED_IN_OTHER_CIV": "Trading Post Established in New Civilization",
    "LOC_MOMENT_TRADING_POST_CONSTRUCTED_IN_OTHER_CIV_DESCRIPTION": "You have established your first [ICON_TradingPost] Trading Post in this civilization, opening up access to new markets.",
    "LOC_MOMENT_TRADING_POST_CONSTRUCTED_IN_EVERY_CIV": "Trading Posts in All Civilizations",
    "LOC_MOMENT_TRADING_POST_CONSTRUCTED_IN_EVERY_CIV_DESCRIPTION": "You have established a [ICON_TradingPost] Trading Post in all civilizations.",
    "LOC_MOMENT_TRADING_POST_CONSTRUCTED_IN_EVERY_CIV_FIRST_IN_WORLD": "First Trading Posts in All Civilizations",
    "LOC_MOMENT_TRADING_POST_CONSTRUCTED_IN_EVERY_CIV_FIRST_IN_WORLD_DESCRIPTION": "You are the first in the world to establish a [ICON_TradingPost] Trading Post in all civilizations.",
    "LOC_MOMENT_UNIT_CREATED_FIRST_DOMAIN_AIR": "Taking Flight",
    "LOC_MOMENT_UNIT_CREATED_FIRST_DOMAIN_AIR_DESCRIPTION": "You own your first flying unit. People rejoice at the new possibilities this entails.",
    "LOC_MOMENT_UNIT_CREATED_FIRST_DOMAIN_AIR_IN_WORLD": "World's First Flight",
    "LOC_MOMENT_UNIT_CREATED_FIRST_DOMAIN_AIR_IN_WORLD_DESCRIPTION": "You own the world's first flying unit! People rejoice at the new possibilities this entails.",
    "LOC_MOMENT_UNIT_CREATED_FIRST_DOMAIN_SEA": "On the Waves",
    "LOC_MOMENT_UNIT_CREATED_FIRST_DOMAIN_SEA_DESCRIPTION": "You own your first seafaring unit. A world of possibility awaits on the horizon.",
    "LOC_MOMENT_UNIT_CREATED_FIRST_DOMAIN_SEA_IN_WORLD": "World's First Seafaring",
    "LOC_MOMENT_UNIT_CREATED_FIRST_DOMAIN_SEA_IN_WORLD_DESCRIPTION": "You own the world's first seafaring unit! A world of possibility awaits on the horizon.",
    "LOC_MOMENT_UNIT_CREATED_FIRST_REQUIRING_STRATEGIC": "Strategic Resource Potential Unleashed",
    "LOC_MOMENT_UNIT_CREATED_FIRST_REQUIRING_STRATEGIC_DESCRIPTION": "You own your first unit that uses this strategic resource.",
    "LOC_MOMENT_UNIT_CREATED_FIRST_REQUIRING_STRATEGIC_IN_WORLD": "World's First Strategic Resource Potential Unleashed",
    "LOC_MOMENT_UNIT_CREATED_FIRST_REQUIRING_STRATEGIC_IN_WORLD_DESCRIPTION": "You are the world's first civilization to own a unit using this strategic resource.",
    "LOC_MOMENT_UNIT_CREATED_FIRST_UNIQUE": "Unique Unit Marches",
    "LOC_MOMENT_UNIT_CREATED_FIRST_UNIQUE_DESCRIPTION": "You have trained this unique unit for the first time, giving you an edge on the battlefield.",
    "LOC_MOMENT_UNIT_HIGH_LEVEL": "Unit Promoted with Distinction",
    "LOC_MOMENT_UNIT_HIGH_LEVEL_DESCRIPTION": "One of your units reaches its fourth level of promotion.",
    "LOC_MOMENT_UNIT_HIGH_LEVEL_FIRST": "First Unit Promoted with Distinction",
    "LOC_MOMENT_UNIT_HIGH_LEVEL_FIRST_DESCRIPTION": "For the first time, one of your units reaches its fourth level of promotion.",
    "LOC_MOMENT_UNIT_KILLED_ASSISTED_BY_ADMIRAL": "Admiral Defeats Enemy",
    "LOC_MOMENT_UNIT_KILLED_ASSISTED_BY_ADMIRAL_DESCRIPTION": "One of your [ICON_GreatAdmiral] Great Admirals has overseen their first victorious offensive against an enemy unit.",
    "LOC_MOMENT_UNIT_KILLED_ASSISTED_BY_GENERAL": "General Defeats Enemy",
    "LOC_MOMENT_UNIT_KILLED_ASSISTED_BY_GENERAL_DESCRIPTION": "One of your [ICON_GreatGeneral] Great Generals has overseen their first victorious offensive against an enemy unit.",
    "LOC_MOMENT_UNIT_KILLED_UNDERDOG_MILITARY_FORMATION": "Enemy Formation Defeated",
    "LOC_MOMENT_UNIT_KILLED_UNDERDOG_MILITARY_FORMATION_DESCRIPTION": "One of your units defeated an enemy unit with a superior military formation.",
    "LOC_MOMENT_UNIT_KILLED_UNDERDOG_PROMOTIONS": "Enemy Veteran Defeated",
    "LOC_MOMENT_UNIT_KILLED_UNDERDOG_PROMOTIONS_DESCRIPTION": "One of your units defeated an enemy unit with at least 2 more promotions than it.",
    "LOC_MOMENT_WAR_DECLARED_USING_CASUS_BELLI": "Cause for War",
    "LOC_MOMENT_WAR_DECLARED_USING_CASUS_BELLI_DESCRIPTION": "You have utilized a Casus Belli to make war on another civilization.",
    "LOC_MOMENT_WORLD_CIRCUMNAVIGATED": "World Circumnavigated",
    "LOC_MOMENT_WORLD_CIRCUMNAVIGATED_DESCRIPTION": "Your civilization has revealed a tile in every vertical line of the map. This forms a path around the world, even if the path does not end where it began.",
    "LOC_MOMENT_WORLD_CIRCUMNAVIGATED_FIRST_IN_WORLD": "World's First Circumnavigation",
    "LOC_MOMENT_WORLD_CIRCUMNAVIGATED_FIRST_IN_WORLD_DESCRIPTION": "Your civilization is the first to reveal a tile in every vertical line of the map. This forms a path around the world, even if the path does not end where it began.",

    // Gathering Storm
    "LOC_MOMENT_CITY_BUILT_NEAR_FLOODABLE_RIVER": "City near Floodable River",
    "LOC_MOMENT_CITY_BUILT_NEAR_FLOODABLE_RIVER_DESCRIPTION": "A city is placed within 2 tiles of a river that could flood.",
    "LOC_MOMENT_CITY_BUILT_NEAR_VOLCANO": "City near Volcano",
    "LOC_MOMENT_CITY_BUILT_NEAR_VOLCANO_DESCRIPTION": "A city is placed within 2 tiles of a volcano that could erupt.",
    "LOC_MOMENT_CITY_POWER_GENERATED_FROM_RESOURCE_FIRST": "First Resource consumed for Power",
    "LOC_MOMENT_CITY_POWER_GENERATED_FROM_RESOURCE_FIRST_DESCRIPTION": "Your civilization consumes a resource to generate [ICON_Power] Power for its cities.",
    "LOC_MOMENT_CITY_POWER_GENERATED_FROM_RESOURCE_FIRST_IN_WORLD": "First Resource consumed for Power in World",
    "LOC_MOMENT_CITY_POWER_GENERATED_FROM_RESOURCE_FIRST_IN_WORLD_DESCRIPTION": "Your civilization is the first in the world to consume a resource to generate Power for its cities.",
    "LOC_MOMENT_CLIMATE_CHANGE_PHASE": "Climate Change Phase",
    "LOC_MOMENT_CLIMATE_CHANGE_PHASE_DESCRIPTION": "CO2 emissions have increased enough to change the world's climate to a more dangerous level.",
    "LOC_MOMENT_DISTRICT_CONSTRUCTED_CANAL": "Canal Completed",
    "LOC_MOMENT_DISTRICT_CONSTRUCTED_CANAL_DESCRIPTION": "You have completed your civilization's first Canal district.",
    "LOC_MOMENT_GOVERNMENT_ENACTED_TIER_4_FIRST": "First Tier 4 Government",
    "LOC_MOMENT_GOVERNMENT_ENACTED_TIER_4_FIRST_DESCRIPTION": "Your civilization adopts its first Tier 4 Government.",
    "LOC_MOMENT_GOVERNMENT_ENACTED_TIER_4_FIRST_IN_WORLD": "First Tier 4 Government in World",
    "LOC_MOMENT_GOVERNMENT_ENACTED_TIER_4_FIRST_IN_WORLD_DESCRIPTION": "Your civilization is the first to adopt a Tier 4 Government in the world.",
    "LOC_MOMENT_IMPROVEMENT_CONSTRUCTED_MOUNTAIN_TUNNEL_FIRST": "First Mountain Tunnel",
    "LOC_MOMENT_IMPROVEMENT_CONSTRUCTED_MOUNTAIN_TUNNEL_FIRST_DESCRIPTION": "Your civilization builds its first Mountain Tunnel.",
    "LOC_MOMENT_IMPROVEMENT_CONSTRUCTED_MOUNTAIN_TUNNEL_FIRST_IN_WORLD": "First Mountain Tunnel in World",
    "LOC_MOMENT_IMPROVEMENT_CONSTRUCTED_MOUNTAIN_TUNNEL_FIRST_IN_WORLD_DESCRIPTION": "Your civilization is the first to build a Mountain Tunnel in the world.",
    "LOC_MOMENT_IMPROVEMENT_CONSTRUCTED_ON_DISASTER_YIELD_TILE_FIRST": "First Improvement after Natural Disaster",
    "LOC_MOMENT_IMPROVEMENT_CONSTRUCTED_ON_DISASTER_YIELD_TILE_FIRST_DESCRIPTION": "Your civilization builds its first improvement on a tile that was enriched by a natural disaster.",
    "LOC_MOMENT_IMPROVEMENT_CONSTRUCTED_RENEWABLE_ENERGY_FIRST": "First Green Improvement",
    "LOC_MOMENT_IMPROVEMENT_CONSTRUCTED_RENEWABLE_ENERGY_FIRST_DESCRIPTION": "Your civilization builds its first tile improvement dedicated to providing renewable [ICON_Power] Power.",
    "LOC_MOMENT_IMPROVEMENT_CONSTRUCTED_RENEWABLE_ENERGY_FIRST_IN_WORLD": "First Green Improvement in World",
    "LOC_MOMENT_IMPROVEMENT_CONSTRUCTED_RENEWABLE_ENERGY_FIRST_IN_WORLD_DESCRIPTION": "Your civilization is the first to build a tile improvement dedicated to providing renewable [ICON_Power] Power in the world.",
    "LOC_MOMENT_MITIGATED_COASTAL_FLOOD": "Coastal Flood Mitigated",
    "LOC_MOMENT_MITIGATED_COASTAL_FLOOD_DESCRIPTION": "Your Flood Barrier has prevented catastrophic damage from a coastal flood.",
    "LOC_MOMENT_MITIGATED_RIVER_FLOOD": "River Flood Mitigated",
    "LOC_MOMENT_MITIGATED_RIVER_FLOOD_DESCRIPTION": "Your constructed infrastructure has prevented damage from a river flood.",
    "LOC_MOMENT_PLAYER_EARNED_DIPLOMATIC_VICTORY_POINT": "Diplomatic Victory Resolution Won",
    "LOC_MOMENT_PLAYER_EARNED_DIPLOMATIC_VICTORY_POINT_DESCRIPTION": "You have won the Diplomatic Victory resolution and earned Victory Points.",
    "LOC_MOMENT_PROJECT_FOUNDED_EXOPLANET": "Exoplanet Expedition Launched",
    "LOC_MOMENT_PROJECT_FOUNDED_EXOPLANET_DESCRIPTION": "You have launched your civilization's expedition to a distant planet.",
    "LOC_MOMENT_PROJECT_FOUNDED_EXOPLANET_FIRST_IN_WORLD": "World's First Exoplanet Expedition Launched",
    "LOC_MOMENT_PROJECT_FOUNDED_EXOPLANET_FIRST_IN_WORLD_DESCRIPTION": "You are the first in the world to launch an expedition to a distant planet.",
    "LOC_MOMENT_ROUTE_CREATED_RAILROAD_CONNECTS_TWO_CITIES": "First Railroad Connection",
    "LOC_MOMENT_ROUTE_CREATED_RAILROAD_CONNECTS_TWO_CITIES_DESCRIPTION": "Your civilization builds its first Railroad to connect two of your cities.",
    "LOC_MOMENT_ROUTE_CREATED_RAILROAD_CONNECTS_TWO_CITIES_FIRST_IN_WORLD": "First Railroad Connection in World",
    "LOC_MOMENT_ROUTE_CREATED_RAILROAD_CONNECTS_TWO_CITIES_FIRST_IN_WORLD_DESCRIPTION": "Your civilization is the first to build a Railroad to connect two of its cities in the world.",
    "LOC_MOMENT_UNIT_TOURISM_BOMB": "First Rock Band Concert",
    "LOC_MOMENT_UNIT_TOURISM_BOMB_DESCRIPTION": "Your civilization performs its first Rock Band concert.",
    "LOC_MOMENT_UNIT_TOURISM_BOMB_FIRST_IN_WORLD": "First Rock Band Concert in World",
    "LOC_MOMENT_UNIT_TOURISM_BOMB_FIRST_IN_WORLD_DESCRIPTION": "Your civilization is the first to perform a Rock Band concert in the world.",
    "LOC_MOMENT_WORLD_CONGRESS_RESOLUTION_BID_SUCCESSFUL": "World Congress Resolution Bid Won",
    "LOC_MOMENT_WORLD_CONGRESS_RESOLUTION_BID_SUCCESSFUL_DESCRIPTION": "You have successfully won the bid on a Resolution, and can determine its outcome.",
    "LOC_MOMENT_WORLD_CONGRESS_RESOLUTION_VOTE_SUCCESSFUL_AS_ONLY_VOTER": "World Congress Resolution Vote Won Singlehandedly",
    "LOC_MOMENT_WORLD_CONGRESS_RESOLUTION_VOTE_SUCCESSFUL_AS_ONLY_VOTER_DESCRIPTION": "Despite being the only one to vote for it, your chosen Resolution has made it to the World Congress for consideration.",
};

let imageRefs = {
    "Rise and Fall": {
        "MOMENT_ARTIFACT_EXTRACTED": "MomentSmall_Culture",
        "MOMENT_ARTIFACT_EXTRACTED_SHIPWRECK_FIRST": "Moment_ShipwreckExcavated.png",
        "MOMENT_ARTIFACT_EXTRACTED_SHIPWRECK_FIRST_IN_WORLD": "Moment_ShipwreckExcavated.png",
        "MOMENT_BARBARIAN_CAMP_DESTROYED": "MomentSmall_Combat",
        "MOMENT_BARBARIAN_CAMP_DESTROYED_NEAR_YOUR_CITY": "Moment_ClearBarbMedieval6Tiles.png",
        "MOMENT_BELIEF_ADDED_MAX_BELIEFS_REACHED": "Moment_MaxReligionBeliefs.png",
        "MOMENT_BELIEF_ADDED_MAX_BELIEFS_REACHED_FIRST_IN_WORLD": "Moment_MaxReligionBeliefs.png",
        "MOMENT_BUILDING_CONSTRUCTED_FIRST_UNIQUE": "MOMENT_ILLUSTRATION_UNIQUE_BUILDING.customimage",
        "MOMENT_BUILDING_CONSTRUCTED_FULL_AERODROME_FIRST": "Moment_DistrictBuiltAerodrome.png",
        "MOMENT_BUILDING_CONSTRUCTED_FULL_ENCAMPMENT_FIRST": "Moment_DistrictBuiltEncampment.png",
        "MOMENT_BUILDING_CONSTRUCTED_FULL_ENTERTAINMENT_COMPLEX_FIRST": "Moment_DistrictBuiltEntertainment.png",
        "MOMENT_BUILDING_CONSTRUCTED_FULL_WATER_ENTERTAINMENT_COMPLEX_FIRST": "Moment_DistrictBuiltWaterpark.png",
        "MOMENT_BUILDING_CONSTRUCTED_GAME_ERA_WONDER": "MomentSmall_Wonder",
        "MOMENT_BUILDING_CONSTRUCTED_PAST_ERA_WONDER": "MomentSmall_Wonder",
        "MOMENT_CITY_BUILT_BECAME_LARGEST_CIV_BY_MARGIN": "Moment_3MoreCitiesThanNextPlayer.png",
        "MOMENT_CITY_BUILT_NEAR_NATURAL_WONDER": "MOMENT_ILLUSTRATION_NATURAL_WONDER.customimage",
        "MOMENT_CITY_BUILT_NEAR_OTHER_CIV_CITY": "MomentSmall_City",
        "MOMENT_CITY_BUILT_NEW_CONTINENT": "Moment_NewContinentCity.png",
        "MOMENT_CITY_BUILT_ON_DESERT": "MomentSmall_City",
        "MOMENT_CITY_BUILT_ON_SNOW": "MomentSmall_City",
        "MOMENT_CITY_BUILT_ON_TUNDRA": "MomentSmall_City",
        "MOMENT_CITY_CHANGED_RELIGION_ENEMY_CITY_DURING_WAR": "Moment_ConvertEnemyHolyCityDuringWar.png",
        "MOMENT_CITY_CHANGED_RELIGION_OTHER_HOLY_CITY": "Moment_ConvertCity.png",
        "MOMENT_CITY_SIZE_EXTRA_LARGE_FIRST": "Moment_FirstCityToReach25Pop.png",
        "MOMENT_CITY_SIZE_EXTRA_LARGE_FIRST_IN_WORLD": "Moment_FirstCityToReach25Pop.png",
        "MOMENT_CITY_SIZE_LARGE_FIRST": "Moment_FirstCityToReach20Pop.png",
        "MOMENT_CITY_SIZE_LARGE_FIRST_IN_WORLD": "Moment_FirstCityToReach20Pop.png",
        "MOMENT_CITY_SIZE_MEDIUM_FIRST": "Moment_FirstCityToReach15Pop.png",
        "MOMENT_CITY_SIZE_MEDIUM_FIRST_IN_WORLD": "Moment_FirstCityToReach15Pop.png",
        "MOMENT_CITY_SIZE_SMALL_FIRST": "Moment_FirstCityToReach10Pop.png",
        "MOMENT_CITY_SIZE_SMALL_FIRST_IN_WORLD": "Moment_FirstCityToReach10Pop.png",
        "MOMENT_CITY_TRANSFERRED_DISLOYAL_FREE_CITY": "Moment_CityTransferCulturalFromFreeCity.png",
        "MOMENT_CITY_TRANSFERRED_FOREIGN_CAPITAL": "MomentSmall_Military",
        "MOMENT_CITY_TRANSFERRED_PLAYER_DEFEATED": "Moment_EliminatedCiv.png",
        "MOMENT_CITY_TRANSFERRED_TO_ORIGINAL_OWNER": "MomentSmall_Military",
        "MOMENT_CIVIC_CULTURVATED_IN_ERA_FIRST": "MOMENT_ILLUSTRATION_CIVIC_ERA.customimage",
        "MOMENT_CIVIC_CULTURVATED_IN_ERA_FIRST_IN_WORLD": "MOMENT_ILLUSTRATION_CIVIC_ERA.customimage",
        "MOMENT_DISTRICT_CONSTRUCTED_FIRST_UNIQUE": "MOMENT_ILLUSTRATION_UNIQUE_DISTRICT.customimage",
        "MOMENT_DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_CAMPUS": "Moment_DistrictBuiltCampus.png",
        "MOMENT_DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_COMMERCIAL_HUB": "Moment_DistrictBuilt_Commercial.png",
        "MOMENT_DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_HARBOR": "Moment_DistrictBuiltHarbor.png",
        "MOMENT_DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_HOLY_SITE": "Moment_DistrictBuiltHolySite.png",
        "MOMENT_DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_INDUSTRIAL_ZONE": "Moment_DistrictBuiltIndustrial.png",
        "MOMENT_DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_THEATER_SQUARE": "Moment_DistrictBuiltTheatre.png",
        "MOMENT_DISTRICT_CONSTRUCTED_NEIGHBORHOOD_FIRST": "Moment_DistrictBuiltNeighborhood.png",
        "MOMENT_DISTRICT_CONSTRUCTED_NEIGHBORHOOD_FIRST_IN_WORLD": "Moment_DistrictBuiltNeighborhood.png",
        "MOMENT_EMERGENCY_WON_AS_MEMBER": "Moment_JoinEmergency.png",
        "MOMENT_EMERGENCY_WON_AS_TARGET": "Moment_JoinEmergency.png",
        "MOMENT_FIND_NATURAL_WONDER": "MOMENT_ILLUSTRATION_NATURAL_WONDER.customimage",
        "MOMENT_FIND_NATURAL_WONDER_FIRST_IN_WORLD": "MOMENT_ILLUSTRATION_NATURAL_WONDER.customimage",
        "MOMENT_FIND_NEW_CONTINENT_FIRST_IN_WORLD": "Moment_DiscoverContinent.png",
        "MOMENT_FORMATION_ARMADA_FIRST": "MomentSmall_Military",
        "MOMENT_FORMATION_ARMADA_FIRST_IN_WORLD": "Moment_FirstArmada.png",
        "MOMENT_FORMATION_ARMY_FIRST": "MomentSmall_Military",
        "MOMENT_FORMATION_ARMY_FIRST_IN_WORLD": "Moment_FirstArmy.png",
        "MOMENT_FORMATION_CORPS_FIRST": "MomentSmall_Military",
        "MOMENT_FORMATION_CORPS_FIRST_IN_WORLD": "Moment_FirstCorps.png",
        "MOMENT_FORMATION_FLEET_FIRST": "MomentSmall_Military",
        "MOMENT_FORMATION_FLEET_FIRST_IN_WORLD": "Moment_FirstFleet.png",
        "MOMENT_GAME_ERA_STARTED_WITH_DARK_AGE": "MOMENT_ILLUSTRATION_GAME_ERA.customimage",
        "MOMENT_GAME_ERA_STARTED_WITH_GOLDEN_AGE": "MOMENT_ILLUSTRATION_GAME_ERA.customimage",
        "MOMENT_GAME_ERA_STARTED_WITH_HEROIC_AGE": "MOMENT_ILLUSTRATION_GAME_ERA.customimage",
        "MOMENT_GAME_ERA_STARTED_WITH_NORMAL_AGE": "MOMENT_ILLUSTRATION_GAME_ERA.customimage",
        "MOMENT_GOODY_HUT_TRIGGERED": "MomentSmall_Exploration",
        "MOMENT_GOVERNMENT_ENACTED_TIER_1_FIRST": "MOMENT_ILLUSTRATION_GOVERNMENT.customimage",
        "MOMENT_GOVERNMENT_ENACTED_TIER_1_FIRST_IN_WORLD": "MOMENT_ILLUSTRATION_GOVERNMENT.customimage",
        "MOMENT_GOVERNMENT_ENACTED_TIER_2_FIRST": "MOMENT_ILLUSTRATION_GOVERNMENT.customimage",
        "MOMENT_GOVERNMENT_ENACTED_TIER_2_FIRST_IN_WORLD": "MOMENT_ILLUSTRATION_GOVERNMENT.customimage",
        "MOMENT_GOVERNMENT_ENACTED_TIER_3_FIRST": "MOMENT_ILLUSTRATION_GOVERNMENT.customimage",
        "MOMENT_GOVERNMENT_ENACTED_TIER_3_FIRST_IN_WORLD": "MOMENT_ILLUSTRATION_GOVERNMENT.customimage",
        "MOMENT_GOVERNOR_ALL_APPOINTED_FIRST": "Moment_PromoteGovernor_AllGovernors.png",
        "MOMENT_GOVERNOR_FULLY_PROMOTED_FIRST": "MOMENT_ILLUSTRATION_GOVERNOR.customimage",
        "MOMENT_GREAT_PERSON_CREATED_GAME_ERA": "MomentSmall_GreatPerson",
        "MOMENT_GREAT_PERSON_CREATED_PAST_ERA": "MomentSmall_GreatPerson",
        "MOMENT_GREAT_PERSON_CREATED_PATRONAGE_FAITH_OVER_HALF": "Moment_EarnGreatPersonWithFaith.png",
        "MOMENT_GREAT_PERSON_CREATED_PATRONAGE_GOLD_OVER_HALF": "Moment_EarnGreatPersonWithGold.png",
        "MOMENT_IMPROVEMENT_CONSTRUCTED_FIRST_UNIQUE": "MOMENT_ILLUSTRATION_UNIQUE_IMPROVEMENT.customimage",
        "MOMENT_IMPROVEMENT_CONSTRUCTED_SEASIDE_RESORT_FIRST": "Moment_CreatedSeasideResort.png",
        "MOMENT_IMPROVEMENT_CONSTRUCTED_SEASIDE_RESORT_FIRST_IN_WORLD": "Moment_CreatedSeasideResort.png",
        "MOMENT_INQUISITION_LAUNCHED": "Moment_BeganInquisition.png",
        "MOMENT_INQUISITION_LAUNCHED_FIRST_IN_WORLD": "Moment_BeganInquisition.png",
        "MOMENT_NATIONAL_PARK_CREATED": "Moment_NationalPark.png",
        "MOMENT_NATIONAL_PARK_CREATED_FIRST_IN_WORLD": "Moment_NationalPark.png",
        "MOMENT_PANTHEON_FOUNDED": "MomentSmall_Religion",
        "MOMENT_PANTHEON_FOUNDED_FIRST_IN_WORLD": "Moment_FoundedPantheon.png",
        "MOMENT_PLAYER_GAVE_ENVOY_BECAME_SUZERAIN_FIRST_IN_WORLD": "Moment_FirstSuzerain.png",
        "MOMENT_PLAYER_GAVE_ENVOY_CANCELED_LEVY": "Moment_CancelledSuzerianLeviedMilitary.png",
        "MOMENT_PLAYER_GAVE_ENVOY_CANCELED_SUZERAIN_DURING_WAR": "Moment_CancelledSuzerianWar.png",
        "MOMENT_PLAYER_LEVIED_MILITARY": "MomentSmall_Military",
        "MOMENT_PLAYER_LEVIED_MILITARY_NEAR_ENEMY_CITY": "Moment_LevyMilitaryNearEnemy.png",
        "MOMENT_PLAYER_MET_ALL_MAJORS": "Moment_MetCivPlayer.png",
        "MOMENT_PLAYER_MET_ALL_MAJORS_FIRST_IN_WORLD": "Moment_MetAllCivs.png",
        "MOMENT_PLAYER_MET_MAJOR": "MomentSmall_Diplomacy",
        "MOMENT_PROJECT_FOUNDED_MANHATTEN": "MomentSmall_Science",
        "MOMENT_PROJECT_FOUNDED_MARS": "MomentSmall_Science",
        "MOMENT_PROJECT_FOUNDED_MARS_FIRST_IN_WORLD": "Moment_FirstMarsComponent.png",
        "MOMENT_PROJECT_FOUNDED_MOON_LANDING": "MomentSmall_Science",
        "MOMENT_PROJECT_FOUNDED_MOON_LANDING_FIRST_IN_WORLD": "Moment_MoonLanding.png",
        "MOMENT_PROJECT_FOUNDED_OPERATION_IVY": "MomentSmall_Science",
        "MOMENT_PROJECT_FOUNDED_SATELLITE_LAUNCH": "MomentSmall_Science",
        "MOMENT_PROJECT_FOUNDED_SATELLITE_LAUNCH_FIRST_IN_WORLD": "Moment_LaunchedSatellite.png",
        "MOMENT_RELIGION_FOUNDED": "PM_FoundedReligion.png",
        "MOMENT_RELIGION_FOUNDED_FIRST_IN_WORLD": "PM_FoundedReligion.png",
        "MOMENT_SPY_MAX_LEVEL": "MomentSmall_Espionage",
        "MOMENT_SPY_MAX_LEVEL_FIRST": "Moment_SpyPromoted.png",
        "MOMENT_TECH_RESEARCHED_IN_ERA_FIRST": "MOMENT_ILLUSTRATION_TECHNOLOGY_ERA.customimage",
        "MOMENT_TECH_RESEARCHED_IN_ERA_FIRST_IN_WORLD": "MOMENT_ILLUSTRATION_TECHNOLOGY_ERA.customimage",
        "MOMENT_TRADING_POST_CONSTRUCTED_IN_EVERY_CIV": "Moment_TradePostNewCiv.png",
        "MOMENT_TRADING_POST_CONSTRUCTED_IN_EVERY_CIV_FIRST_IN_WORLD": "Moment_Tradepost_AllCities.png",
        "MOMENT_TRADING_POST_CONSTRUCTED_IN_OTHER_CIV": "MomentSmall_Trade",
        "MOMENT_UNIT_CREATED_FIRST_DOMAIN_AIR": "MOMENT_ILLUSTRATION_AIR_UNIT_ERA.customimage",
        "MOMENT_UNIT_CREATED_FIRST_DOMAIN_AIR_IN_WORLD": "MOMENT_ILLUSTRATION_AIR_UNIT_ERA.customimage",
        "MOMENT_UNIT_CREATED_FIRST_DOMAIN_SEA": "MOMENT_ILLUSTRATION_SEA_UNIT_ERA.customimage",
        "MOMENT_UNIT_CREATED_FIRST_DOMAIN_SEA_IN_WORLD": "MOMENT_ILLUSTRATION_SEA_UNIT_ERA.customimage",
        "MOMENT_UNIT_CREATED_FIRST_REQUIRING_STRATEGIC": "MomentSmall_Military",
        "MOMENT_UNIT_CREATED_FIRST_REQUIRING_STRATEGIC_IN_WORLD": "Moment_StrategicResourceUnit.png",
        "MOMENT_UNIT_CREATED_FIRST_UNIQUE": "MOMENT_ILLUSTRATION_UNIQUE_UNIT.customimage",
        "MOMENT_UNIT_HIGH_LEVEL": "MomentSmall_Military",
        "MOMENT_UNIT_HIGH_LEVEL_FIRST": "Moment_4StarUnit.png",
        "MOMENT_UNIT_KILLED_ASSISTED_BY_ADMIRAL": "Moment_KillEnemyUnit_AdmiralNearby.png",
        "MOMENT_UNIT_KILLED_ASSISTED_BY_GENERAL": "Moment_KillEnemy_GreatGeneralNearby.png",
        "MOMENT_UNIT_KILLED_UNDERDOG_MILITARY_FORMATION": "Moment_KillEnemyUnit_HigherFormation.png",
        "MOMENT_UNIT_KILLED_UNDERDOG_PROMOTIONS": "Moment_KillEnemyUnit_TwoMorePromos.png",
        "MOMENT_WAR_DECLARED_USING_CASUS_BELLI": "MomentSmall_Combat",
        "MOMENT_WORLD_CIRCUMNAVIGATED": "Moment_Circumnavigation.png",
        "MOMENT_WORLD_CIRCUMNAVIGATED_FIRST_IN_WORLD": "Moment_Circumnavigation.png",
    },

    "Gathering Storm": {
        "MOMENT_CITY_BUILT_NEAR_FLOODABLE_RIVER": "MomentXP2_City_Built_Near_FloodableRiver.png",
        "MOMENT_CITY_BUILT_NEAR_VOLCANO": "MomentXP2_City_Built_Near_Volcano.png",
        "MOMENT_CITY_POWER_GENERATED_FROM_RESOURCE_FIRST": "MomentXP2_Resource_FossilFuel.png",
        "MOMENT_CITY_POWER_GENERATED_FROM_RESOURCE_FIRST_IN_WORLD": "MomentXP2_Resource_FossilFuel.png",
        "MOMENT_CLIMATE_CHANGE_PHASE": "MomentXP2_ClimateChangeAlert.png",
        "MOMENT_DISTRICT_CONSTRUCTED_CANAL": "MomentXP2_BuildingTheCanal.png",
        "MOMENT_GOVERNMENT_ENACTED_TIER_4_FIRST": "MOMENT_ILLUSTRATION_GOVERNMENT.customimage",
        "MOMENT_GOVERNMENT_ENACTED_TIER_4_FIRST_IN_WORLD": "MOMENT_ILLUSTRATION_GOVERNMENT.customimage",
        "MOMENT_IMPROVEMENT_CONSTRUCTED_MOUNTAIN_TUNNEL_FIRST": "MomentXP2_BuildingMountainTunnel.png",
        "MOMENT_IMPROVEMENT_CONSTRUCTED_MOUNTAIN_TUNNEL_FIRST_IN_WORLD": "MomentXP2_BuildingMountainTunnel.png",
        "MOMENT_IMPROVEMENT_CONSTRUCTED_ON_DISASTER_YIELD_TILE_FIRST": "MomentXP2_ImproveNaturalDisasterYieldTile.png",
        "MOMENT_IMPROVEMENT_CONSTRUCTED_RENEWABLE_ENERGY_FIRST": "MomentXP2_TrainingRenewableEnergyImprovement.png",
        "MOMENT_IMPROVEMENT_CONSTRUCTED_RENEWABLE_ENERGY_FIRST_IN_WORLD": "MomentXP2_TrainingRenewableEnergyImprovement.png",
        "MOMENT_MITIGATED_COASTAL_FLOOD": "MomentSmall_City",
        "MOMENT_MITIGATED_RIVER_FLOOD": "MomentSmall_City",
        "MOMENT_PLAYER_EARNED_DIPLOMATIC_VICTORY_POINT": "MomentSmall_Diplomacy",
        "MOMENT_PROJECT_FOUNDED_EXOPLANET": "MomentXP2_Project_Founded_Exoplanet.png",
        "MOMENT_PROJECT_FOUNDED_EXOPLANET_FIRST_IN_WORLD": "MomentXP2_Project_Founded_Exoplanet.png",
        "MOMENT_ROUTE_CREATED_RAILROAD_CONNECTS_TWO_CITIES": "MomentXP2_BuildingRailroadConnecting2Cities.png",
        "MOMENT_ROUTE_CREATED_RAILROAD_CONNECTS_TWO_CITIES_FIRST_IN_WORLD": "MomentXP2_BuildingRailroadConnecting2Cities.png",
        "MOMENT_UNIT_TOURISM_BOMB": "MomentXP2_TourismBomb.png",
        "MOMENT_UNIT_TOURISM_BOMB_FIRST_IN_WORLD": "MomentXP2_TourismBomb.png",
    },
}

let customImgRefs = {
    "MOMENT_ILLUSTRATION_CIVIC_ERA": {
        type: "era",
        data: [],
        default: "MomentSmall_Culture"
    },
    "MOMENT_ILLUSTRATION_TECHNOLOGY_ERA": {
        type: "era",
        data: [],
        default: "MomentSmall_Science"
    },
    "MOMENT_ILLUSTRATION_AIR_UNIT_ERA": {
        type: "era",
        data: [
            { era: ["Ancient", "Classical", "Medieval", "Renaissance", "Industrial", "Modern"], src: "Moment_FirstAirUnitEarlyGame.png", dlc: "Rise and Fall" },
            { era: ["Atomic", "Information", "Future"], src: "Moment_FirstAirUnitLateGame.png", dlc: "Rise and Fall" },
        ],
        default: "Rise and Fall/Moment_FirstAirUnitEarlyGame.png"
    },
    "MOMENT_ILLUSTRATION_SEA_UNIT_ERA": {
        type: "era",
        data: [
            { era: ["Ancient", "Classical", "Medieval"], src: "Moment_FirstSeaUnitEarly.png", dlc: "Rise and Fall" },
            { era: ["Renaissance", "Industrial", "Modern", "Atomic", "Information", "Future"], src: "Moment_FirstSeaUnitMid.png", dlc: "Rise and Fall" },
        ],
        default: "Rise and Fall/Moment_FirstSeaUnitMid.png"
    },
    "MOMENT_ILLUSTRATION_UNIQUE_UNIT": {
        type: "unique",
        data: [],
        default: "MomentSmall_Military"
    },
    "MOMENT_ILLUSTRATION_GOVERNOR": {
        type: "unique",
        data: [],
        default: "MomentSmall_Diplomacy"
    },
    "MOMENT_ILLUSTRATION_GOVERNMENT": {
        type: "unique",
        data: [],
        default: "Rise and Fall/Moment_Government_ClassicalRepublic.png"
    },
    "MOMENT_ILLUSTRATION_GAME_ERA": {
        type: "era",
        data: [],
        default: "MomentSmall_Dedication_Tourism.png"
    },
    "MOMENT_ILLUSTRATION_UNIQUE_BUILDING": {
        type: "unique",
        data: [],
        default: "MomentSmall_Construction"
    },
    "MOMENT_ILLUSTRATION_UNIQUE_DISTRICT": {
        type: "unique",
        data: [],
        default: "MomentSmall_Construction"
    },
    "MOMENT_ILLUSTRATION_UNIQUE_IMPROVEMENT": {
        type: "unique",
        data: [],
        default: "MomentSmall_Construction"
    },
    "MOMENT_ILLUSTRATION_NATURAL_WONDER": {
        type: "unique",
        data: [],
        default: "MomentSmall_Exploration"
    }
}

let DLCcustomImgRefs = {
    "Rise and Fall": {
        "MOMENT_ILLUSTRATION_CIVIC_ERA": [
            { era: ["Ancient", "Classical"], src: "Moment_CompleteCivicClassical.png" },
            { era: "Medieval", src: "Moment_CompleteCivicMedieval.png" },
            { era: "Renaissance", src: "Moment_CompleteCivicRenaissance.png" },
            { era: "Industrial", src: "Moment_CompleteCivicIndustrial.png" },
            { era: "Modern", src: "Moment_CompleteCivicModern.png" },
            { era: "Atomic", src: "Moment_CompleteCivicAtomic.png" },
            { era: "Information", src: "Moment_CompleteCivicInformation.png" },
        ],
        "MOMENT_ILLUSTRATION_TECHNOLOGY_ERA": [
            { era: ["Ancient", "Classical"], src: "Moment_CompleteTech_Classical.png" },
            { era: "Medieval", src: "Moment_CompleteTech_Medieval.png" },
            { era: "Renaissance", src: "Moment_CompleteTech_Renaissance.png" },
            { era: "Industrial", src: "Moment_CompleteTech_Industrial.png" },
            { era: "Modern", src: "Moment_CompleteTech_Modern.png" },
            { era: "Atomic", src: "Moment_CompleteTech_Atomic.png" },
            { era: "Information", src: "Moment_CompleteTech_Information.png" },
        ],
        "MOMENT_ILLUSTRATION_UNIQUE_UNIT": [
            { find: "P-51 Mustang", src: "Moment_UniqueUnit_America_Mustang.png" },
            { find: "Rough Rider", src: "Moment_UniqueUnit_America_Roughrider.png" },
            { find: "Mamluk", src: "Moment_UniqueUnit_Arab.png" },
            { find: "Minas Geraes", src: "Moment_UniqueUnit_Brazil.png" },
            { find: "Crouching Tiger", src: "Moment_UniqueUnit_China.png" },
            { find: "Maryannu Chariot Archer", src: "Moment_UniqueUnit_Egypt.png" },
            { find: "Redcoat", src: "Moment_UniqueUnit_England_Redcoats.png" },
            { find: "Seadog", src: "Moment_UniqueUnit_England_Seadog.png" },
            { find: "Garde Impériale", src: "Moment_UniqueUnit_France_GardeImperiale.png" },
            { find: "U-Boat", src: "Moment_UniqueUnit_Germany_UBoat.png" },
            { find: "Hoplite", src: "Moment_UniqueUnit_Greece.png" },
            { find: "Varu", src: "Moment_UniqueUnit_India.png" },
            { find: "Samurai", src: "Moment_UniqueUnit_Japan.png" },
            { find: "Ngao Mbeba", src: "Moment_UniqueUnit_Konga.png" },
            { find: "Berserker", src: "Moment_UniqueUnit_Norway_Berserker.png" },
            { find: "Viking Longship", src: "Moment_UniqueUnit_Norway_Longship.png" },
            { find: "Legion", src: "Moment_UniqueUnit_Rome.png" },
            { find: "Cossack", src: "Moment_UniqueUnit_Russia.png" },
            { find: "Saka Horse Archer", src: "Moment_UniqueUnit_Scythia.png" },
            { find: "Conquistador", src: "Moment_UniqueUnit_Spain.png" },
            { find: "War-Cart", src: "Moment_UniqueUnit_Sumerian.png" },
        ],
        "MOMENT_ILLUSTRATION_GOVERNOR": [
            { find: "Amani", src: "Moment_PromoteGovernor_Ambassador.png" },
            { find: "Liang", src: "Moment_PromoteGovernor_Builder.png" },
            { find: "Moksha", src: "Moment_PromoteGovernor_Cardinal.png" },
            { find: "Victor", src: "Moment_PromoteGovernor_Defender.png" },
            { find: "Pingala", src: "Moment_PromoteGovernor_Educator.png" },
            { find: "Reyna", src: "Moment_PromoteGovernor_Merchant.png" },
            { find: "Magnus", src: "Moment_PromoteGovernor_ResourceManager.png" },
        ],
        "MOMENT_ILLUSTRATION_GOVERNMENT": [
            { find: "Autocracy", src: "Moment_Government_Autocracy.png" },
            { find: "Oligarchy", src: "Moment_Government_Oligarchy.png" },
            { find: "Classical Republic", src: "Moment_Government_ClassicalRepublic.png" },
            { find: "Monarchy", src: "Moment_Government_Monarchy.png" },
            { find: "Theocracy", src: "Moment_Government_Theocracy.png" },
            { find: "Merchant Republic", src: "Moment_Government_Merchant.png" },
            { find: "Fascism", src: "Moment_Government_Fascism.png" },
            { find: "Communism", src: "Moment_Government_Communism.png" },
            { find: "Democracy", src: "Moment_Government_Democracy.png" },
        ],
        "MOMENT_ILLUSTRATION_GAME_ERA": [
            { era: "Ancient", src: "Moment_EraEntry_Ancient.png" },
            { era: "Classical", src: "Moment_EraEntry_Classical.png" },
            { era: "Medieval", src: "Moment_EraEntry_Medieval.png" },
            { era: "Renaissance", src: "Moment_EraEntry_Renaissance.png" },
            { era: "Industrial", src: "Moment_EraEntry_Industrial.png" },
            { era: "Modern", src: "Moment_EraEntry_Modern.png" },
            { era: "Atomic", src: "Moment_EraEntry_Atomic.png" },
            { era: "Information", src: "Moment_EraEntry_Information.png" },
        ],
        "MOMENT_ILLUSTRATION_UNIQUE_BUILDING": [
            { find: "Film Studio", src: "Moment_Infrastructure_America.png" },
            { find: "Madrasa", src: "Moment_Infrastructure_Arabia.png" },
            { find: "Electronics Factory", src: "Moment_Infrastructure_Japan.png" },
            { find: "Stave Church", src: "Moment_Infrastructure_Norway.png" },
        ],
        "MOMENT_ILLUSTRATION_UNIQUE_DISTRICT": [
            { find: "Street Carnival", src: "Moment_Infrastructure_Brazil.png" },
            { find: "Copacabana", src: "Moment_Infrastructure_Brazil.png" },
            { find: "Royal Navy Dockyard", src: "Moment_Infrastructure_England.png" },
            { find: "Hansa", src: "Moment_Infrastructure_Germany.png" },
            { find: "Acropolis", src: "Moment_Infrastructure_Greece.png" },
            { find: "Mbanza", src: "Moment_Infrastructure_Kongo.png" },
            { find: "Bath", src: "Moment_Infrastructure_Rome.png" },
            { find: "Lavra", src: "Moment_Infrastructure_Russia.png" },
        ],
        "MOMENT_ILLUSTRATION_UNIQUE_IMPROVEMENT": [
            { find: "Great Wall", src: "Moment_Infrastructure_China.png" },
            { find: "Sphinx", src: "Moment_Infrastructure_Egypt.png" },
            { find: "Château", src: "Moment_Infrastructure_France.png" },
            { find: "Stepwell", src: "Moment_Infrastructure_India.png" },
            { find: "Kurgan", src: "Moment_Infrastructure_Scythia.png" },
            { find: "Mission", src: "Moment_Infrastructure_Spanish.png" },
            { find: "Ziggurat", src: "Moment_Infrastructure_Ziggurat.png" },
        ],
        "MOMENT_ILLUSTRATION_NATURAL_WONDER": [
            { find: "Great Barrier Reef", src: "Moment_Naturalwonder_BarrierReef.png" },
            { find: "Cliffs of Dover", src: "Moment_NaturalWonder_CliffsOfDover.png" },
            { find: "Crater Lake", src: "Moment_Naturalwonder_CraterLake.png" },
            { find: "Dead Sea", src: "Moment_NaturalWonder_DeadSea.png" },
            { find: "Mount Everest", src: "Moment_NaturalWonder_Everest.png" },
            { find: "Galápagos Islands", src: "Moment_NaturalWonder_Galapagos.png" },
            { find: "Mount Kilimanjaro", src: "Moment_NaturalWonder_Kilimanjaro.png" },
            { find: "Pantanal", src: "Moment_NaturalWonder_Pantanal.png" },
            { find: "Piopiotahi", src: "Moment_NaturalWonder_Piopiotahi.png" },
            { find: "Torres del Paine", src: "Moment_NaturalWonder_Torres.png" },
            { find: "Tsingy de Bemaraha", src: "Moment_NaturalWonder_Tsingy.png" },
            { find: "Yosemite", src: "Moment_NaturalWonder_Yosemite.png" },
        ]
    },

    "Gathering Storm": {
        "MOMENT_ILLUSTRATION_CIVIC_ERA": [
            { era: "Future", src: "MomentXP2_CompleteCivic_Future.png" }
        ],
        "MOMENT_ILLUSTRATION_TECHNOLOGY_ERA": [
            { era: "Future", src: "MomentXP2_CompleteFirstFutureEraTech.png" },
        ],
        "MOMENT_ILLUSTRATION_UNIQUE_UNIT": [
            { find: "Mountie", src: "MomentXP2_TrainingMountie.png" },
            { find: "Black Army", src: "MomentXP2_Training_BlackArmy.png" },
            { find: "Huszár", src: "MomentXP2_TrainingHuzar.png" },
            { find: "Warak’aq", src: "MomentXP2_TrainingWarakaq.png" },
            { find: "Mandekalu Cavalry", src: "MomentXP2_TrainingMadekalu.png" },
            { find: "Toa", src: "MomentXP2_Training_Toa.png" },
            { find: "Barbary Corsair", src: "MomentXP2_TrainingBarbaryCorsair.png" },
            { find: "Bireme", src: "MomentXP2_TrainingBireme.png" },
            { find: "Janissary", src: "MomentXP2_TrainingJanissary.png" },
            { find: "Carolean", src: "MomentXP2_TrainingCarolean.png" },
        ],
        "MOMENT_ILLUSTRATION_GOVERNOR": [
            { find: "Ibrahim", src: "MomentXP2_PromoteGovernor_GrandVizier.png" }
        ],
        "MOMENT_ILLUSTRATION_GOVERNMENT": [
            { find: "Corporate Libertarianism", src: "MomentXP2_Government_CorpLibertarianism.png" },
            { find: "Digital Democracy", src: "MomentXP2_Gorvernment_DigitalDemocracy.png" },
            { find: "Synthetic Technocracy", src: "MomentXP2_Government_SyntheticTechnocracy.png" }
        ],
        "MOMENT_ILLUSTRATION_GAME_ERA": [
            { era: "Future", src: "MomentXP2_EnterFutureEra.png" },
        ],
        "MOMENT_ILLUSTRATION_UNIQUE_BUILDING": [
            { find: "Grand Bazaar", src: "MomentXP2_BuildingTheGrandBazaar.png" },
            { find: "Marae", src: "MomentXP2_BuildingTheMarae.png" },
            { find: "Queen's Bibliotheque", src: "MomentXP2_BuildingBiblioteque.png" },
            { find: "Thermal Bath", src: "MomentXP2_BuildingTheThermalBath.png" },
        ],
        "MOMENT_ILLUSTRATION_UNIQUE_DISTRICT": [
            { find: "Cothon", src: "MomentXP2_BuildingTheCothon.png" },
            { find: "Suguba", src: "MomentXP2_BuildingSuguba.png" },
        ],
        "MOMENT_ILLUSTRATION_UNIQUE_IMPROVEMENT": [
            { find: "Open-Air Museum", src: "MomentXP2_BuildingTheOpenAirMuseum.png" },
            { find: "Ice Hockey Rink", src: "MomentXP2_BuildingIceHockeyRink.png" },
            { find: "Terrace Farm", src: "MomentXP2_BuildingTheTerraceFarm.png" },
            { find: "Pā", src: "MomentXP2_BuildingThePa.png" },
            { find: "Qhapaq Ñan", src: "MomentXP2_BuildingTheQhapaqNan.png" },
        ],
        "MOMENT_ILLUSTRATION_NATURAL_WONDER": [
            { find: "Chocolate Hills", src: "MomentXP2_FindingChocolateHills.png" },
            { find: "Mato Tipila", src: "MomentXP2_FindingDevilsTower.png" },
            { find: "Gobustan", src: "MomentXP2_FindingGobustan.png" },
            { find: "Ik-Kil", src: "MomentXP2_FindingIkKil.png" },
            { find: "Pamukkale", src: "MomentXP2_FindingPamukkale.png" },
            { find: "Mount Vesuvius", src: "MomentXP2_FindingVesuvius.png" },
            { find: "Sahara el Beyda", src: "MomentXP2_FindingWhiteDesert.png" },
        ],
    },

    "Australia": {
        "MOMENT_ILLUSTRATION_UNIQUE_UNIT": [
            { find: "Digger", src: "Moment_UniqueUnit_Australia.png" }
        ],
        "MOMENT_ILLUSTRATION_UNIQUE_IMPROVEMENT": [
            { find: "Outback Station", src: "Moment_Infrastructure_Australia.png" }
        ],
        "MOMENT_ILLUSTRATION_NATURAL_WONDER": [
            { find: "Uluru", src: "Moment_Naturalwonder_Uluru.png" }
        ]
    },

    "Aztec": {
        "MOMENT_ILLUSTRATION_UNIQUE_UNIT": [
            { find: "Eagle Warrior", src: "Moment_UniqueUnit_Aztec.png" }
        ],
        "MOMENT_ILLUSTRATION_UNIQUE_BUILDING": [
            { find: "Tlachtli", src: "Moment_Infrastructure_Aztec.png" }
        ]
    },

    "Indonesia and Khmer": {
        "MOMENT_ILLUSTRATION_UNIQUE_UNIT": [
            { find: "Jong", src: "Moment_UniqueUnit_Indonesia.png" },
            { find: "Domrey", src: "Moment_UniqueUnit_Khmer.png" }
        ],
        "MOMENT_ILLUSTRATION_UNIQUE_IMPROVEMENT": [
            { find: "Kampung", src: "Moment_Infrastructure_Indonesia.png" }
        ],
        "MOMENT_ILLUSTRATION_UNIQUE_BUILDING": [
            { find: "Prasat", src: "Moment_Infrastructure_Khmer.png" }
        ],
        "MOMENT_ILLUSTRATION_NATURAL_WONDER": [
            { find: "Hạ Long Bay", src: "Moment_Naturalwonder_HaLongBay.png" }
        ]
    },

    "Macedonia and Persia": {
        "MOMENT_ILLUSTRATION_UNIQUE_UNIT": [
            { find: "Hetairoi", src: "Moment_UniqueUnit_Macedon_Hetairoi.png" },
            { find: "Hypaspist", src: "Moment_UniqueUnit_Macedon_Hypaspist.png" },
            { find: "Immortal", src: "Moment_UniqueUnit_Persia.png" }
        ],
        "MOMENT_ILLUSTRATION_UNIQUE_BUILDING": [
            { find: "Basilikoi Paides", src: "Moment_Infrastructure_Macedon.png" }
        ],
        "MOMENT_ILLUSTRATION_UNIQUE_IMPROVEMENT": [
            { find: "Pairidaeza", src: "Moment_Infrastructure_Persia.png" }
        ]
    },

    "Nubia": {
        "MOMENT_ILLUSTRATION_UNIQUE_UNIT": [
            { find: "Pítati Archer", src: "Moment_UniqueUnit_Nubia.png" }
        ],
        "MOMENT_ILLUSTRATION_UNIQUE_BUILDING": [
            { find: "Nubian Pyramid", src: "Moment_Infrastructure_Nubia.png" }
        ]
    },

    "Poland": {
        "MOMENT_ILLUSTRATION_UNIQUE_UNIT": [
            { find: "Winged Hussar", src: "Moment_UniqueUnit_Poland.png" }
        ],
        "MOMENT_ILLUSTRATION_UNIQUE_BUILDING": [
            { find: "Sukiennice", src: "Moment_Infrastructure_Poland.png" }
        ]
    },

    "Vikings Wonders": {
        "MOMENT_ILLUSTRATION_NATURAL_WONDER": [
            { find: "Eyjafjallajökull", src: "Moment_NaturalWonder_Eyjafjallajokull.png" },
            { find: "Giant's Causeway", src: "Moment_Naturalwonder_GiantsCauseway.png" },
            { find: "Lysefjord", src: "Moment_Naturalwonder_Lyseford.png" }
        ]
    }
}

Object.entries(DLCcustomImgRefs).forEach(dlc => {
    Object.entries(dlc[1]).forEach(entry => {
        let existing = customImgRefs[entry[0]].data;
        let entries = entry[1];
        entries.map(e => e.dlc = dlc[0]);
        let updated = [...existing, ...entries];

        customImgRefs[entry[0]].data = updated;
    });
});

// let imageRefs1 = {};

// xml.forEach(m => {
//     let img;
//     if (m["-BackgroundTexture"]) {
//         img = m["-BackgroundTexture"];
//     } else if (m["-IconTexture"]) {
//         img = m["-IconTexture"];
//     } else if (m["-MomentIllustrationType"]) {
//         img = m["-MomentIllustrationType"] + ".customimage";
//     }

//     if (img.endsWith(".dds")) {
//         img = img.slice(0, -3) + "png";
//     }
//     imageRefs1[m["-MomentType"]] = img;
// });

// console.log(imageRefs1);



// Object.entries(imageRefs).forEach(e => {
//     if (e[1].endsWith(".dds")) {
//         imageRefs[e[0]] = e[1].slice(0, -3) + "png";
//     }
// });

// console.log(imageRefs);