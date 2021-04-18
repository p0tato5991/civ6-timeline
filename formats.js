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
    moment = moment.split("_").slice(1).join("_");

    if (tooltips[moment]) {
        return tooltips[moment].split(" | ")[1];
    } else {
        return moment.toLowerCase().split("_").map(m => m[0].toUpperCase() + m.slice(1)).join(" ");
    }
}

function formatMomentTooltip(moment) {
    moment = moment.split("_").slice(1).join("_");

    if (tooltips[moment]) {
        let tooltip = tooltips[moment].split(" | ")[0];

        for (const [key, value] of Object.entries(icons)) {
            if (tooltip.includes(`[ICON_${key}]`)) {
                tooltip = tooltip.replace(`[ICON_${key}]`, `<img src="assets/images/Civ6${value}.png">`);
            }
        }

        return tooltip;
    } else {
        console.log(moment)
        return moment.toLowerCase().split("_").map(m => m[0].toUpperCase() + m.slice(1)).join(" ");
    }
}

// icons
const icons = {
    "ARTIFACT": "Artifact",
    "CITIZEN": "Citizen",
    "CULTURE": "Culture",
    "DARK_AGE": "DarkAge",
    "ENVOY": "Envoy",
    "FAITH": "Faith",
    "FOOD": "Food",
    "GOLD": "Gold",
    "GOLDEN_AGE": "GoldenAge",
    "GOVERNOR": "Governor",
    "GREAT_ADMIRAL": "GreatAdmiral",
    "GREAT_GENERAL": "GreatGeneral",
    "GREAT_PERSON": "GreatPerson",
    "GREAT_PROPHET": "GreatProphet",
    "HEROIC_AGE": "HeroicAge",
    "NORMAL_AGE": "NormalAge",
    "POWER": "Power",
    "PRODUCTION": "Production",
    "SCIENCE": "Science",
    "SHIPWRECK": "Shipwreck",
    "TRADING_POST": "TradingPost",
}

// INCOMPLETE! This is only what I have documented so far
const tooltips = {
    "ARTIFACT_EXTRACTED": "An [ICON_ARTIFACT] Artifact has been uncovered, giving us insight into the past. | Artifact Extracted",

    "ARTIFACT_EXTRACTED_SHIPWRECK_FIRST": "Your archaeologists have excavated their first [ICON_SHIPWRECK] Shipwreck. | Shipwreck Excavated",

    "ARTIFACT_EXTRACTED_SHIPWRECK_FIRST_IN_WORLD": "Your archaeologists have completed the world's first excavation of a [ICON_SHIPWRECK] Shipwreck. | World's First Shipwreck Excavated",

    "BARBARIAN_CAMP_DESTROYED": "A barbarian camp was destroyed, spreading peace throughout the area. | Destroyed Barbarian Camp",

    "BARBARIAN_CAMP_DESTROYED_NEAR_YOUR_CITY": "A barbarian camp within 6 tiles of one of your cities was destroyed. | Destroyed Threatening Barbarian Camp",

    "BELIEF_ADDED_MAX_BELIEFS_REACHED": "Your Religion has added its final Belief and is now complete. | Religion Adopts All Beliefs",

    "BELIEF_ADDED_MAX_BELIEFS_REACHED_FIRST_IN_WORLD": "Your Religion is the first in the world to add its final Belief and become complete. | World's First Religion to Adopt All Beliefs",

    "BUILDING_CONSTRUCTED_FIRST_UNIQUE": "You have created this unique building for the first time. | Created Unique Building",

    "BUILDING_CONSTRUCTED_FULL_AERODROME_FIRST": "You have completed every building in an Aerodrome district for the first time. | Fully Developed Aerodrome",

    "BUILDING_CONSTRUCTED_FULL_ENCAMPMENT_FIRST": "You have completed every building in an Encampment district for the first time. | Fully Developed Encampment",

    "BUILDING_CONSTRUCTED_FULL_ENTERTAINMENT_COMPLEX_FIRST": "You have completed every building in an Entertainment Complex district for the first time. | Fully Developed Entertainment Complex",

    "BUILDING_CONSTRUCTED_FULL_WATER_ENTERTAINMENT_COMPLEX_FIRST": "You have completed every building in a Water Park district for the first time. | Fully Developed Water Park",

    "BUILDING_CONSTRUCTED_GAME_ERA_WONDER": "A World Wonder is completed, showing our grandeur over other civilizations. | Created a World Wonder",

    "BUILDING_CONSTRUCTED_PAST_ERA_WONDER": "A World Wonder is completed. Even though it belongs to a past era, it will still show our grandeur over other civilizations. | Created a World Wonder from a Past Era",

    "CITY_BUILT_BECAME_LARGEST_CIV_BY_MARGIN": "Your civilization has become the largest in the world, with at least 3 more cities than its next biggest rival. | Became World's Largest Civilization",

    "CITY_BUILT_NEAR_FLOODABLE_RIVER": "A city is placed within 2 tiles of a river that could flood. | City Placed Near Floodable River",

    "CITY_BUILT_NEAR_NATURAL_WONDER": "You placed a city within 2 tiles of a natural wonder. | City Near Natural Wonder",

    "CITY_BUILT_NEAR_OTHER_CIV_CITY": "You placed a city within 5 tiles of another civilization's city. | Aggressive City Placement",

    "CITY_BUILT_NEAR_VOLCANO": "A city is placed within 2 tiles of a volcano. | City Placed Near Volcano",

    "CITY_BUILT_NEW_CONTINENT": "A city is placed on a continent you have not yet settled. | Placed City on New Continent",

    "CITY_BUILT_ON_DESERT": "A city is placed on a Desert tile. | Desert City",

    "CITY_BUILT_ON_SNOW": "A city is placed on a Snow tile. | Snow City",

    "CITY_BUILT_ON_TUNDRA": "A city is placed on a Tundra tile. | Tundra City",

    "CITY_CHANGED_RELIGION_ENEMY_CITY_DURING_WAR": "An enemy city, despite being at war with us, has seen the light and adopted our Religion. | Enemy City Adopts Our Religion",

    "CITY_CHANGED_RELIGION_OTHER_HOLY_CITY": "The Holy City of another Religion has converted to our Religion. | Rival Holy City Converted",

    "CITY_POWER_GENERATED_FROM_RESOURCE_FIRST": "Your civilization consumes a resource to generate [ICON_POWER] Power for its cities. | Resource Consumed for Power",

    "CITY_POWER_GENERATED_FROM_RESOURCE_FIRST_IN_WORLD": "Your civilization is the first in the world to consume a resource to generate [ICON_POWER] Power for its cities. | World's First Resource Consumed for Power",

    "CITY_SIZE_EXTRA_LARGE_FIRST": "A city has reached 25 [ICON_CITIZEN] Population for the first time in your civilization. | City Reached 25 Population",

    "CITY_SIZE_EXTRA_LARGE_FIRST_IN_WORLD": "A city has reached 25 [ICON_CITIZEN] Population for the first time in the world. | World's First City with 25 Population",

    "CITY_SIZE_LARGE_FIRST": "A city has reached 20 [ICON_CITIZEN] Population for the first time in your civilization. | City Reached 20 Population",

    "CITY_SIZE_LARGE_FIRST_IN_WORLD": "A city has reached 20 [ICON_CITIZEN] Population for the first time in the world. | World's First City with 20 Population",

    "CITY_SIZE_MEDIUM_FIRST": "A city has reached 15 [ICON_CITIZEN] Population for the first time in your civilization. | City Reached 15 Population",

    "CITY_SIZE_MEDIUM_FIRST_IN_WORLD": "A city has reached 15 [ICON_CITIZEN] Population for the first time in the world. | World's First City with 15 Population",

    "CITY_SIZE_SMALL_FIRST": "A city has reached 10 [ICON_CITIZEN] Population for the first time in your civilization. | City Reached 10 Population",

    "CITY_SIZE_SMALL_FIRST_IN_WORLD": "A city has reached 10 [ICON_CITIZEN] Population for the first time in the world. | World's First City with 10 Population",

    "CITY_TRANSFERRED_DISLOYAL_FREE_CITY": "A Free City has decided to pledge its loyalty to us, joining our civilization. | Free City Joins",

    "CITY_TRANSFERRED_FOREIGN_CAPITAL": "You have taken control of a foreign civilization's original capital city. | Foreign Capital Captured",

    "CITY_TRANSFERRED_PLAYER_DEFEATED": "You have taken control of a civilization's last remaining city. | Final Foreign City Captured",

    "CITY_TRANSFERRED_TO_ORIGINAL_OWNER": "A city has returned to its original owner. | City Returned to Original Owner",

    "CIVIC_CULTURVATED_IN_ERA_FIRST": "You have completed your civilization's first civic from a new era of discovery. | First Civic of New Era",

    "CIVIC_CULTURVATED_IN_ERA_FIRST_IN_WORLD": "You have completed the world's first civic from a new era of discovery. | World's First Civic of New Era",

    "CLIMATE_CHANGE_PHASE": "CO2 emissions have increased enough to change the world's climate to a more dangerous level. | Climate Change Phase",

    "DISTRICT_CONSTRUCTED_CANAL": "You have completed your civilization's first Canal district. | Canal Constructed",

    "DISTRICT_CONSTRUCTED_FIRST_UNIQUE": "You have created this unique district for the first time. | Created Unique District",

    "DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_CAMPUS": "You have completed your civilization's first Campus with a starting adjacency bonus of 3 [ICON_SCIENCE] Science or higher. | Created High Adjacency Campus",

    "DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_COMMERCIAL_HUB": "You have completed your civilization's first Commercial Hub with a starting adjacency bonus of 4 [ICON_GOLD] Gold or higher. | Created High Adjacency Commercial Hub",

    "DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_HARBOR": "You have completed your civilization's first Harbor with a starting adjacency bonus of 4 [ICON_GOLD] Gold or higher. | Created High Adjacency Harbor",

    "DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_HOLY_SITE": "You have completed your civilization's first Holy Site with a starting adjacency bonus of 3 [ICON_FAITH] Faith or higher. | Created High Adjacency Holy Site",

    "DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_INDUSTRIAL_ZONE": "You have completed your civilization's first Industrial Zone with a starting adjacency bonus of 4 [ICON_PRODUCTION] Production or higher. | Created High Adjacency Industrial Zone",

    "DISTRICT_CONSTRUCTED_HIGH_ADJACENCY_THEATER_SQUARE": "You have completed your civilization's first Theater Square with a starting adjacency bonus of 3 [ICON_CULTURE] Culture or higher. | Created High Adjacency Theater Square",

    "DISTRICT_CONSTRUCTED_NEIGHBORHOOD_FIRST": "You have completed your first Neighborhood district. | Created Neighborhood District",

    "DISTRICT_CONSTRUCTED_NEIGHBORHOOD_FIRST_IN_WORLD": "You have completed the world's first Neighborhood district. | World's First Neighborhood District",

    "EMERGENCY_WON_AS_MEMBER": "As a member, you have succeeded in an Emergency. | Emergency Completed",

    "EMERGENCY_WON_AS_TARGET": "As the target, you have succeeded in fighting off an Emergency against you. | Emergency Successfully Defended",

    "FIND_NATURAL_WONDER": "Your civilization discovers this natural wonder. | Discovered Natural Wonder",

    "FIND_NATURAL_WONDER_FIRST_IN_WORLD": "Your civilization discovers this natural wonder for the first time in the world. | Discovered Natural Wonder First in the World",

    "FIND_NEW_CONTINENT_FIRST_IN_WORLD": "Your explorers are the first in the world to find this continent. | World's First Discovery of Continent",

    "FORMATION_ARMADA_FIRST": "Your civilization's first Armada is formed. | Armada Formed",

    "FORMATION_ARMADA_FIRST_IN_WORLD": "The world's first Armada is formed under your command. | World's First Armada",

    "FORMATION_ARMY_FIRST": "Your civilization's first Army is formed. | Army Formed",

    "FORMATION_ARMY_FIRST_IN_WORLD": "The world's first Army is formed under your command. | World's First Army",

    "FORMATION_CORPS_FIRST": "Your civilization's first Corps is formed. | Corps Formed",

    "FORMATION_CORPS_FIRST_IN_WORLD": "The world's first Corps is formed under your command. | World's First Corps",

    "FORMATION_FLEET_FIRST": "Your civilization's first Fleet is formed. | Fleet Formed",

    "FORMATION_FLEET_FIRST_IN_WORLD": "The world's first Fleet is formed under your command. | World's First Fleet",

    "GAME_ERA_STARTED_WITH_DARK_AGE": "The game enters a new era, and your civilization has the challenges of a [ICON_DARK_AGE] Dark Age to overcome. | Entered Dark Age",

    "GAME_ERA_STARTED_WITH_GOLDEN_AGE": "The game enters a new era, and your civilization has earned a [ICON_GOLDEN_AGE] Golden Age. | Entered Golden Age",

    "GAME_ERA_STARTED_WITH_HEROIC_AGE": "The game enters a new era, and your civilization has earned a [ICON_HEROIC_AGE] Heroic Age after overcoming past challenges. | Entered Heroic Age",

    "GAME_ERA_STARTED_WITH_NORMAL_AGE": "The game enters a new era, and your civilization has entered a [ICON_NORMAL_AGE] Normal Age. | Entered Normal Age",

    "GOODY_HUT_TRIGGERED": "A Tribal Village was contacted, giving strength to our growing cities. | Contacted Tribal Village",

    "GOVERNMENT_ENACTED_TIER_1_FIRST": "Your civilization adopts its first Tier 1 Government. | Enacted Tier 1 Government",

    "GOVERNMENT_ENACTED_TIER_1_FIRST_IN_WORLD": "Your civilization is the first to adopt a Tier 1 Government in the world. | World's First Tier 1 Government Enacted",

    "GOVERNMENT_ENACTED_TIER_2_FIRST": "Your civilization adopts its first Tier 2 Government. | Enacted Tier 2 Government",

    "GOVERNMENT_ENACTED_TIER_2_FIRST_IN_WORLD": "Your civilization is the first to adopt a Tier 2 Government in the world. | World's First Tier 2 Government Enacted",

    "GOVERNMENT_ENACTED_TIER_3_FIRST": "Your civilization adopts its first Tier 3 Government. | Enacted Tier 3 Government",

    "GOVERNMENT_ENACTED_TIER_3_FIRST_IN_WORLD": "Your civilization is the first to adopt a Tier 3 Government in the world. | World's First Tier 3 Government Enacted",

    "GOVERNMENT_ENACTED_TIER_4_FIRST": "Your civilization adopts its first Tier 4 Government. | Enacted Tier 4 Government",

    "GOVERNMENT_ENACTED_TIER_4_FIRST_IN_WORLD": "Your civilization is the first to adopt a Tier 4 Government in the world. | World's First Tier 4 Government Enacted",

    "GOVERNOR_ALL_APPOINTED_FIRST": "You have appointed all available [ICON_GOVERNOR] Governors, securing the prosperity of many of your cities. | Appointed All Governers",

    "GOVERNOR_FULLY_PROMOTED_FIRST": "You have fully promoted a [ICON_GOVERNOR] Governor for the first time, unlocking powerful abilities to help a city. | Governor Fully Promoted",

    "GREAT_PERSON_CREATED_GAME_ERA": "A [ICON_GREAT_PERSON] Great Person has traveled to our civilization to share unique talents. | Recruited Great Person",

    "GREAT_PERSON_CREATED_PAST_ERA": "A [ICON_GREAT_PERSON] Great Person has traveled to our civilization. Though better suited for a past era, they will still contribute great things to our civilization. | Recruited Great Person from Past Era",

    "GREAT_PERSON_CREATED_PATRONAGE_FAITH_OVER_HALF": "A [ICON_GREAT_PERSON] Great Person has traveled to our lands to share unique talents, thanks to our use of [ICON_FAITH] Faith. | Great Person Lured by Faith",

    "GREAT_PERSON_CREATED_PATRONAGE_GOLD_OVER_HALF": "A [ICON_GREAT_PERSON] Great Person has traveled to our lands to share unique talents, thanks to our generous stipend of [ICON_GOLD] Gold. | Great Person Lured by Gold",

    "IMPROVEMENT_CONSTRUCTED_FIRST_UNIQUE": "Your builders have constructed this unique tile improvement for the first time. | Created Unique Improvement",

    "IMPROVEMENT_CONSTRUCTED_MOUNTAIN_TUNNEL_FIRST": "Your civilization builds its first Mountain Tunnel. | Mountain Tunnel Constructed",

    "IMPROVEMENT_CONSTRUCTED_MOUNTAIN_TUNNEL_FIRST_IN_WORLD": "Your civilization is the first in the world to build a Mountain Tunnel. | World's First Mountain Tunnel",

    "IMPROVEMENT_CONSTRUCTED_ON_DISASTER_YIELD_TILE_FIRST": "Your civilization builds its first improvement on a tile that was enriched by a natural disaster. | Improvement Built on Enriched Land",

    "IMPROVEMENT_CONSTRUCTED_RENEWABLE_ENERGY_FIRST": "Your civilization builds its first improvement that provides renewable energy. | Renewable Energy Improvement",

    "IMPROVEMENT_CONSTRUCTED_RENEWABLE_ENERGY_FIRST_IN_WORLD": "Your civilization is the first in the world to build an improvement that provides renewable energy. | World's First Renewable Energy Improvement",

    "IMPROVEMENT_CONSTRUCTED_SEASIDE_RESORT_FIRST": "You have completed your first Seaside Resort improvement. | Created Seaside Resort",

    "IMPROVEMENT_CONSTRUCTED_SEASIDE_RESORT_FIRST_IN_WORLD": "You have completed the world's first Seaside Resort improvement. | World's First Seaside Resort",

    "INQUISITION_LAUNCHED": "Your Religion launches an inquisition. | Inquisition Launched",

    "INQUISITION_LAUNCHED_FIRST_IN_WORLD": "Your Religion launches the world's first inquisition. | World's First Inquisition",

    "MITIGATED_COASTAL_FLOOD": "Your Flood Barrier prevented catastrophic damage from a coastal flood. | Coastal Flood Mitigated",

    "MITIGATED_RIVER_FLOOD": "A Dam district you constructed has prevented damage from a river flood. | River Flood Mitigated",

    "NATIONAL_PARK_CREATED": "You have founded a National Park. | Founded National Park",

    "NATIONAL_PARK_CREATED_FIRST_IN_WORLD": "You have founded the world's first National Park. | World's First National Park",

    "PANTHEON_FOUNDED": "Your people adopt Belief in a Pantheon. | Pantheon Founded",

    "PANTHEON_FOUNDED_FIRST_IN_WORLD": "Your people are the first in the world to adopt Belief in a Pantheon. | World's First Pantheon",

    "PLAYER_EARNED_DIPLOMATIC_VICTORY_POINT": "You have won the Diplomatic Victory resolution and earned Victory Points. | Diplomatic Victory Points Earned",

    "PLAYER_GAVE_ENVOY_BECAME_SUZERAIN_FIRST_IN_WORLD": "You have become the first Suzerain of this city-state. | Became City-state's First Suzerain",

    "PLAYER_GAVE_ENVOY_CANCELED_LEVY": "Your use of [ICON_ENVOY] Envoys has convinced this city-state's levied army to stand down. | Levied Army Stands Down",

    "PLAYER_GAVE_ENVOY_CANCELED_SUZERAIN_DURING_WAR": "Your use of [ICON_ENVOY] Envoys has toppled a hostile city-state's Suzerain, convincing it to end hostilities with you. | Enemy City-state Pacified",

    "PLAYER_LEVIED_MILITARY": "You have levied the military forces of a city-state. | Levied Military",

    "PLAYER_LEVIED_MILITARY_NEAR_ENEMY_CITY": "You levied the military forces of this city-state within striking distance of an enemy civilization. | Army Levied Near Enemy",

    "PLAYER_MET_ALL_MAJORS": "You have met all living civilizations in the world. | Met All Civilizations",

    "PLAYER_MET_ALL_MAJORS_FIRST_IN_WORLD": "You are the first to meet all living civilizations in the world. | Met All Civilizations First in the World",

    "PLAYER_MET_MAJOR": "You have made contact with a new civilization. | Discovered New Civilization",

    "PROJECT_FOUNDED_EXOPLANET_FIRST_IN_WORLD": "You are the first civilization to launch an expedition to a distant planet. | World's First Exoplanet Expedition Launched",

    "PROJECT_FOUNDED_MANHATTEN": "Your scientists completed the Manhatten Project. | Completed Manhatten Project",

    "PROJECT_FOUNDED_MARS": "You successfully established a colony on Mars. | Established Mars Colony",

    "PROJECT_FOUNDED_MARS_FIRST_IN_WORLD": "You are the first civilization to found a colony on Mars. | World's First Mars Colony",

    "PROJECT_FOUNDED_MOON_LANDING": "You sent a successful mission to land on the moon. | Moon Landing",

    "PROJECT_FOUNDED_MOON_LANDING_FIRST_IN_WORLD": "You sent the world's first successful mission to land on the moon. | World's First Moon Landing",

    "PROJECT_FOUNDED_OPERATION_IVY": "Your scientists completed Operation Ivy. | Completed Operation Ivy",

    "PROJECT_FOUNDED_SATELLITE_LAUNCH": "You launched your civilization's first satellite into orbit. | Launched Satellite",

    "PROJECT_FOUNDED_SATELLITE_LAUNCH_FIRST_IN_WORLD": "You launched the world's first satellite into orbit. | World's First Satellite Launch",

    "RELIGION_FOUNDED": "A [ICON_GREAT_PROPHET] Great Prophet founds a Religion, bringing light to your people. | Religion Founded",

    "RELIGION_FOUNDED_FIRST_IN_WORLD": "Your people are the first to form a Religion, bringing light to the world! | World's First Religion",

    "ROUTE_CREATED_RAILROAD_CONNECTS_TWO_CITIES": "Your civilization builds its first Railroad that connects two of your cities. | Railroad Connection Completed",

    "ROUTE_CREATED_RAILROAD_CONNECTS_TWO_CITIES_FIRST_IN_WORLD": "Your civilization is the first in the world to create a Railroad that connects two of your cities. | World's First Railroad Connection",

    "SPY_MAX_LEVEL": "One of your Spies has reached its maximum promotion level. | Maximum Spy Earned",

    "SPY_MAX_LEVEL_FIRST": "For the first time, one of your Spies has reached its maximum promotion level. | First Maximum Spy",

    "TECH_RESEARCHED_IN_ERA_FIRST": "You have completed your civilization's first technology from a new era of discovery. | First Technology of New Era",

    "TECH_RESEARCHED_IN_ERA_FIRST_IN_WORLD": "You have completed the world's first technology from a new era of discovery. | World's First Civic of New Era",

    "TRADING_POST_CONSTRUCTED_IN_OTHER_CIV": "You have established your first [ICON_TRADING_POST] Trading Post in this civilization, opening up access to new markets. | Created Trading Post in Foreign Civilization",

    "TRADING_POST_CONSTRUCTED_IN_EVERY_CIV_FIRST": "You have established a [ICON_TRADING_POST] Trading Post in all civilizations. | Trading Posts in All Civilizations",

    "TRADING_POST_CONSTRUCTED_IN_EVERY_CIV_FIRST_IN_WORLD": "You are the first in the world to establish a [ICON_TRADING_POST] Trading Post in all civilizations. | First Trading Posts in All Civilizations",

    "UNIT_CREATED_FIRST_DOMAIN_AIR": "You own your first flying unit. | Created Flying Unit",

    "UNIT_CREATED_FIRST_DOMAIN_AIR_IN_WORLD": "You own the world's first flying unit! | World's First Flying Unit",

    "UNIT_CREATED_FIRST_DOMAIN_SEA": "You own your first seafaring unit. | Created Seafaring Unit",

    "UNIT_CREATED_FIRST_DOMAIN_SEA_IN_WORLD": "You own the world's first seafaring unit! | World's First Seafaring Unit",

    "UNIT_CREATED_FIRST_REQUIRING_STRATEGIC": "You own your first unit that uses this strategic resource. | Strategic Resource Potential Unleashed",

    "UNIT_CREATED_FIRST_REQUIRING_STRATEGIC_IN_WORLD": "You are the world's first civilization to own a unit using this strategic resource. | World's First Strategic Resource Potential Unleashed",

    "UNIT_CREATED_FIRST_UNIQUE": "You have trained this unique unit for the first time, giving you an edge on the battlefield. | Created Unique Unit",

    "UNIT_HIGH_LEVEL": "One of your units reaches its fourth level of promotion. | Unit Receives its 4th Promotion",

    "UNIT_HIGH_LEVEL_FIRST": "For the first time, one of your units reaches its fourth level of promotion. | Your First Unit Received its Fourth Promotion",

    "UNIT_HIGH_LEVEL_FIRST_IN_WORLD": "One of your units is the first in the world to reach its fourth level of promotion. | World's First Unit to Receive 4 Promotions",

    "UNIT_KILLED_ASSISTED_BY_ADMIRAL": "One of your [ICON_GREAT_ADMIRAL] Great Admirals has overseen their first victorious offensive against an enemy unit. | Admiral Defeats Enemy",

    "UNIT_KILLED_ASSISTED_BY_GENERAL": "One of your [ICON_GREAT_GENERAL] Great Generals has overseen their first victorious offensive against an enemy unit. | General Defeats Enemy",

    "UNIT_KILLED_UNDERDOG_MILITARY_FORMATION": "One of your units defeated an enemy unit with a superior military formation. | Defeated Superior Enemy Formation",

    "UNIT_KILLED_UNDERDOG_PROMOTIONS": "One of your units defeated an enemy unit with at least 2 more promotions than it. | Defeated Veteran Enemy",

    "UNIT_TOURISM_BOMB": "Your civilization performs its first Rock Band concert. | Performed Rock Band Concert",

    "UNIT_TOURISM_BOMB_FIRST_IN_WORLD": "Your civilization performs the first Rock Band concert in the world. | World's First Rock Band Concert",

    "WORLD_CIRCUMNAVIGATED": "Your civilization has revealed a tile in every vertical line of the map. | Circumnavigated the World",

    "WORLD_CIRCUMNAVIGATED_FIRST_IN_WORLD": "Your civilization has revealed a tile in every vertical line of the map. | World's First Circumnavigation",
}