/*
 *  Sammy Heutz
 *  10445765
 * 
 *  countrycodes.js converts Europe's country strings into ISO 3 strings, in order to colour the map according to given values.
**/

var isoCountries = {
    "Norway" : "NOR",
    "Spain" : "ESP",
    "Netherlands" : "NLD",
    "Switzerland" : "CHE",
    "Denmark" : "DNK",
    "United Kingdom": "GBR",
    "Finland" : "FIN",
    "Austria" : "AUT",
    "France" : "FRA",
    "Ireland" : "IRL",
    "Germany" : "DEU",
    "Italy" : "ITA",
    "Sweden": "SWE",
    "Portugal": "PRT",
    "Belgium" : "BEL",
    "Greece" : "GRC",
    "Croatia" : "HRV",
    "Serbia" : "SRB",
    "Romania" : "ROU",
    "Slovakia" : "SVK",
    "Poland" : "POL",
    "Czech Republic" : "CZE",
    "Hungary" : "HUN",
    "Ukraine" : "UKR",
    "Russia" : "RUS",
    "Estonia" : "EST",
    "Bosnia and Herzegovina" : "BIH",
    "Lithuania" : "LTU",
    "Bulgaria" : "BGR",
    "Slovenia" : "SVN"
};

function getCountryCode (countryName) {
    return isoCountries[countryName];
}