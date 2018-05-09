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
    return isoCountries[countryName]
}