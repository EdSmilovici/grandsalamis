// remainder of quotient of epoch time minus 5 hours divided seconds in a day plus 17
let seed = Math.floor(
    (Math.floor((Date.now() - 1000 * 60 * 60 * 5) / 86400000) % 10) + 17
);
let prosciutto = [
    { name: "Ryland", female: false, present: false },
    { name: "Kendra", female: true, present: false },
    { name: "Sydney", female: true, present: false },
    { name: "Malcolm", female: false, present: false },
    { name: "Ed", female: false, present: false },
    { name: "Carolyn", female: true, present: false },
    { name: "Substitute_1", female: true, present: false },
    { name: "Substitute_2", female: true, present: false },
    { name: "Substitute_3", female: false, present: false },
    { name: "Substitute_4", female: false, present: false },
];
let genoa = [
    { name: "Navin", female: false, present: false },
    { name: "Hannah", female: true, present: false },
    { name: "Scott", female: false, present: false },
    { name: "Brian", female: false, present: false },
    { name: "Matt", female: false, present: false },
    { name: "Malia", female: true, present: false },
    { name: "Substitute_5", female: true, present: false },
    { name: "Substitute_6", female: true, present: false },
    { name: "Substitute_7", female: false, present: false },
    { name: "Substitute_8", female: false, present: false },
];
let femaleCount = 0;
let maleCount = 0;
let prosciuttoFieldingInfo = [];
let genoaFieldingInfo = [];
let inningCounter = 0;
function createLineup(lineup) {
    let formContent = "";
    if (lineup) {
    } else {
        formContent += '<div class="twosplit">\n<section id="prosciutto">\n';
        for (let i = 0; i < prosciutto.length; i++) {
            formContent +=
                "<p" + (prosciutto[i].female ? ' class="female"' : "") + ">\n";
            formContent +=
                '<input type="checkbox" id="prosciutto' + i + '" />\n';
            formContent +=
                '<label for="prosciutto' +
                i +
                '">' +
                prosciutto[i].name.replace("_", " ") +
                "</label>";
            formContent += "</p>\n";
        }
        formContent += "</section>\n";
        formContent += '<section id="genoa">\n';
        for (let i = 0; i < genoa.length; i++) {
            formContent +=
                "<p" + (genoa[i].female ? ' class="female"' : "") + ">\n";
            formContent += '<input type="checkbox" id="genoa' + i + '" />\n';
            formContent +=
                '<label for="genoa' +
                i +
                '">' +
                genoa[i].name.replace("_", " ") +
                "</label>\n";
            formContent += "</p>\n";
        }
        formContent += "</section>\n</div>\n";
    }
    formContent +=
        '<button type="submit" class="fullwidthsubmit">Generate Fielding Positions</button>';
    document.getElementById("lineupcontent").innerHTML =
        '<form id="playerForm">\n' + formContent + "</form>\n";
    document
        .getElementById("playerForm")
        .addEventListener("submit", generateFieldingPositions);
    document.getElementById("nextInning").addEventListener("click", nextInning);
    document
        .getElementById("previousInning")
        .addEventListener("click", previousInning);
}
function generateFieldingPositions(event) {
    event.preventDefault();
    ingestFormData();
    if (isValidGenderRatio()) {
        hideGenderError();
        generateFieldingPositionObject();
        displayFieldingPositions(inningCounter);
        document.getElementById("nextInning").disabled = false;
        document.getElementById("previousInning").disabled = false;
    } else {
        displayGenderError();
    }
}
function ingestFormData() {
    femaleCount = 0;
    maleCount = 0;
    for (let i = 0; i < prosciutto.length; i++) {
        prosciutto[i].present = document.getElementById(
            "prosciutto" + i
        ).checked;
        if (prosciutto[i].present) {
            if (prosciutto[i].female) {
                femaleCount++;
            } else {
                maleCount++;
            }
        }
    }
    for (let i = 0; i < genoa.length; i++) {
        genoa[i].present = document.getElementById("genoa" + i).checked;
        if (genoa[i].present) {
            if (genoa[i].female) {
                femaleCount++;
            } else {
                maleCount++;
            }
        }
    }
}
function isValidGenderRatio() {
    return femaleCount >= 3 && maleCount >= 3 && femaleCount + maleCount >= 9;
}
function displayGenderError() {
    document.getElementById("lineupGenderError").style.display = "";
}
function hideGenderError() {
    document.getElementById("lineupGenderError").style.display = "none";
}
function generateFieldingPositionObject() {
    prosciuttoFieldingInfo = [];
    genoaFieldingInfo = [];
    for (let i = 0; i < prosciutto.length; i++) {
        if (prosciutto[i].present) {
            prosciuttoFieldingInfo.push({
                name: prosciutto[i].name,
                female: prosciutto[i].female,
                sitOutCount: 0,
                sitOutArray: [false, false, false, false, false, false, false],
            });
        }
    }
    for (let i = 0; i < genoa.length; i++) {
        if (genoa[i].present) {
            genoaFieldingInfo.push({
                name: genoa[i].name,
                female: genoa[i].female,
                sitOutCount: 0,
                sitOutArray: [false, false, false, false, false, false, false],
            });
        }
    }
    balanceProsciuttoAndGenoa();
    setSitOuts();
}
function getFemaleDifference() {
    let femaleDifference = 0;
    for (let i = 0; i < prosciuttoFieldingInfo.length; i++) {
        if (prosciuttoFieldingInfo[i].female) {
            femaleDifference++;
        }
    }
    for (let i = 0; i < genoaFieldingInfo.length; i++) {
        if (genoaFieldingInfo[i].female) {
            femaleDifference--;
        }
    }
    return femaleDifference;
}
function balanceProsciuttoAndGenoa() {
    if (
        Math.abs(prosciuttoFieldingInfo.length - genoaFieldingInfo.length) > 1
    ) {
        if (prosciuttoFieldingInfo.length - genoaFieldingInfo.length > 0) {
            genoaFieldingInfo.push(
                prosciuttoFieldingInfo[seed % prosciuttoFieldingInfo.length]
            );
            prosciuttoFieldingInfo.splice(
                seed % prosciuttoFieldingInfo.length,
                1
            );
        } else {
            prosciuttoFieldingInfo.push(
                genoaFieldingInfo[seed % genoaFieldingInfo.length]
            );
            genoaFieldingInfo.splice(seed % genoaFieldingInfo.length, 1);
        }
        balanceProsciuttoAndGenoa();
    } else if (Math.abs(getFemaleDifference()) > 1) {
        if (getFemaleDifference() > 0) {
            let femaleIndex = 0;
            let maleIndex = 0;
            while (genoaFieldingInfo[femaleIndex].female) {
                femaleIndex++;
            }
            while (!prosciuttoFieldingInfo[maleIndex].female) {
                maleIndex++;
            }
            prosciuttoFieldingInfo.push(genoaFieldingInfo[femaleIndex]);
            genoaFieldingInfo.splice(femaleIndex, 1);
            genoaFieldingInfo.push(prosciuttoFieldingInfo[maleIndex]);
            prosciuttoFieldingInfo.splice(maleIndex, 1);
        } else {
            let femaleIndex = 0;
            let maleIndex = 0;
            while (prosciuttoFieldingInfo[femaleIndex].female) {
                femaleIndex++;
            }
            while (!genoaFieldingInfo[maleIndex].female) {
                maleIndex++;
            }
            genoaFieldingInfo.push(prosciuttoFieldingInfo[femaleIndex]);
            prosciuttoFieldingInfo.splice(femaleIndex, 1);
            prosciuttoFieldingInfo.push(genoaFieldingInfo[maleIndex]);
            genoaFieldingInfo.splice(maleIndex, 1);
        }
        balanceProsciuttoAndGenoa();
    }
}
function setSitOuts() {
    let maxMaleSitOut = maleCount - 3;
    let maxFemaleSitOut = femaleCount - 3;
    let lowestSitOutCount = 0;
    for (let i = 0; i < 7; i++) {
        lowestSitOutCount = getLowestSitOutCount();
        let maleSitOutCount = 0;
        let femaleSitOutCount = 0;
        let prosciuttoSitOutCount = 0;
        let genoaSitOutCount = 0;
        let sitOutAdjustment = 0;
        if (i % 2 == 0) {
            while (prosciuttoSitOutCount < prosciuttoFieldingInfo.length - 4) {
                for (let k = 0; k < prosciuttoFieldingInfo.length; k++) {
                    if (
                        prosciuttoFieldingInfo[
                            ((prosciuttoSitOutCount + 1) * seed + k) %
                                prosciuttoFieldingInfo.length
                        ].sitOutCount -
                            sitOutAdjustment <=
                        lowestSitOutCount
                    ) {
                        if (
                            prosciuttoFieldingInfo[
                                ((prosciuttoSitOutCount + 1) * seed + k) %
                                    prosciuttoFieldingInfo.length
                            ].female
                        ) {
                            if (femaleSitOutCount >= maxFemaleSitOut) {
                                if (k === prosciuttoFieldingInfo.length - 1) {
                                    sitOutAdjustment++;
                                }
                                continue;
                            }
                            femaleSitOutCount++;
                        } else {
                            if (maleSitOutCount >= maxMaleSitOut) {
                                if (k === prosciuttoFieldingInfo.length - 1) {
                                    sitOutAdjustment++;
                                }
                                continue;
                            }
                            maleSitOutCount++;
                        }
                        prosciuttoFieldingInfo[
                            ((prosciuttoSitOutCount + 1) * seed + k) %
                                prosciuttoFieldingInfo.length
                        ].sitOutCount++;
                        prosciuttoFieldingInfo[
                            ((prosciuttoSitOutCount + 1) * seed + k) %
                                prosciuttoFieldingInfo.length
                        ].sitOutArray[i] = true;
                        prosciuttoSitOutCount++;
                        break;
                    }
                    if (k === prosciuttoFieldingInfo.length - 1) {
                        sitOutAdjustment++;
                    }
                }
            }
            sitOutAdjustment = 0;
            while (genoaSitOutCount < genoaFieldingInfo.length - 4) {
                for (let k = 0; k < genoaFieldingInfo.length; k++) {
                    if (
                        genoaFieldingInfo[
                            ((genoaSitOutCount + 1) * seed + k) %
                                genoaFieldingInfo.length
                        ].sitOutCount -
                            sitOutAdjustment <=
                        lowestSitOutCount
                    ) {
                        if (
                            genoaFieldingInfo[
                                ((genoaSitOutCount + 1) * seed + k) %
                                    genoaFieldingInfo.length
                            ].female
                        ) {
                            if (femaleSitOutCount >= maxFemaleSitOut) {
                                if (k === genoaFieldingInfo.length - 1) {
                                    sitOutAdjustment++;
                                }
                                continue;
                            }
                            femaleSitOutCount++;
                        } else {
                            if (maleSitOutCount >= maxMaleSitOut) {
                                if (k === genoaFieldingInfo.length - 1) {
                                    sitOutAdjustment++;
                                }
                                continue;
                            }
                            maleSitOutCount++;
                        }
                        genoaFieldingInfo[
                            ((genoaSitOutCount + 1) * seed + k) %
                                genoaFieldingInfo.length
                        ].sitOutCount++;
                        genoaFieldingInfo[
                            ((genoaSitOutCount + 1) * seed + k) %
                                genoaFieldingInfo.length
                        ].sitOutArray[i] = true;
                        genoaSitOutCount++;
                        break;
                    }
                    if (k === genoaFieldingInfo.length - 1) {
                        sitOutAdjustment++;
                    }
                }
            }
        } else {
            while (genoaSitOutCount < genoaFieldingInfo.length - 4) {
                for (let k = 0; k < genoaFieldingInfo.length; k++) {
                    if (
                        genoaFieldingInfo[
                            ((genoaSitOutCount + 1) * seed + k) %
                                genoaFieldingInfo.length
                        ].sitOutCount -
                            sitOutAdjustment <=
                        lowestSitOutCount
                    ) {
                        if (
                            genoaFieldingInfo[
                                ((genoaSitOutCount + 1) * seed + k) %
                                    genoaFieldingInfo.length
                            ].female
                        ) {
                            if (femaleSitOutCount >= maxFemaleSitOut) {
                                if (k === genoaFieldingInfo.length - 1) {
                                    sitOutAdjustment++;
                                }
                                continue;
                            }
                            femaleSitOutCount++;
                        } else {
                            if (maleSitOutCount >= maxMaleSitOut) {
                                if (k === genoaFieldingInfo.length - 1) {
                                    sitOutAdjustment++;
                                }
                                continue;
                            }
                            maleSitOutCount++;
                        }
                        genoaFieldingInfo[
                            ((genoaSitOutCount + 1) * seed + k) %
                                genoaFieldingInfo.length
                        ].sitOutCount++;
                        genoaFieldingInfo[
                            ((genoaSitOutCount + 1) * seed + k) %
                                genoaFieldingInfo.length
                        ].sitOutArray[i] = true;
                        genoaSitOutCount++;
                        break;
                    }
                    if (k === genoaFieldingInfo.length - 1) {
                        sitOutAdjustment++;
                    }
                }
            }
            sitOutAdjustment = 0;
            while (prosciuttoSitOutCount < prosciuttoFieldingInfo.length - 4) {
                for (let k = 0; k < prosciuttoFieldingInfo.length; k++) {
                    if (
                        prosciuttoFieldingInfo[
                            ((prosciuttoSitOutCount + 1) * seed + k) %
                                prosciuttoFieldingInfo.length
                        ].sitOutCount -
                            sitOutAdjustment <=
                        lowestSitOutCount
                    ) {
                        if (
                            prosciuttoFieldingInfo[
                                ((prosciuttoSitOutCount + 1) * seed + k) %
                                    prosciuttoFieldingInfo.length
                            ].female
                        ) {
                            if (femaleSitOutCount >= maxFemaleSitOut) {
                                if (k === prosciuttoFieldingInfo.length - 1) {
                                    sitOutAdjustment++;
                                }
                                continue;
                            }
                            femaleSitOutCount++;
                        } else {
                            if (maleSitOutCount >= maxMaleSitOut) {
                                if (k === prosciuttoFieldingInfo.length - 1) {
                                    sitOutAdjustment++;
                                }
                                continue;
                            }
                            maleSitOutCount++;
                        }
                        prosciuttoFieldingInfo[
                            ((prosciuttoSitOutCount + 1) * seed + k) %
                                prosciuttoFieldingInfo.length
                        ].sitOutCount++;
                        prosciuttoFieldingInfo[
                            ((prosciuttoSitOutCount + 1) * seed + k) %
                                prosciuttoFieldingInfo.length
                        ].sitOutArray[i] = true;
                        prosciuttoSitOutCount++;
                        break;
                    }
                    if (k === prosciuttoFieldingInfo.length - 1) {
                        sitOutAdjustment++;
                    }
                }
            }
        }
    }
}
function getLowestSitOutCount() {
    let lowestSitOutCount = 8;
    for (let i = 0; i < prosciuttoFieldingInfo.length; i++) {
        if (prosciuttoFieldingInfo[i].sitOutCount < lowestSitOutCount) {
            lowestSitOutCount = prosciuttoFieldingInfo[i].sitOutCount;
        }
    }
    for (let i = 0; i < genoaFieldingInfo.length; i++) {
        if (genoaFieldingInfo[i].sitOutCount < lowestSitOutCount) {
            lowestSitOutCount = genoaFieldingInfo[i].sitOutCount;
        }
    }
    return lowestSitOutCount;
}
function displayFieldingPositions(inning) {
    document.getElementById("inningNumber").innerHTML =
        "Inning #" + ((inning % 7) + 1);
    let sitOutsHtml = "";
    let prosciuttofieldersHtml = "";
    let genoafieldersHtml = "";
    sitOutsHtml += '<div class="twosplit">\n';
    sitOutsHtml += "<section>";
    for (let i = 0; i < prosciuttoFieldingInfo.length; i++) {
        if (prosciuttoFieldingInfo[i].sitOutArray[inning % 7]) {
            sitOutsHtml +=
                "<p" +
                (prosciuttoFieldingInfo[i].female ? ' class="female"' : "") +
                ">";
            sitOutsHtml += prosciuttoFieldingInfo[i].name.replace("_", " ");
            sitOutsHtml += "</p>";
        }
    }
    sitOutsHtml += "</section>";
    sitOutsHtml += "<section>";
    for (let i = 0; i < genoaFieldingInfo.length; i++) {
        if (genoaFieldingInfo[i].sitOutArray[inning % 7]) {
            sitOutsHtml +=
                "<p" +
                (genoaFieldingInfo[i].female ? ' class="female"' : "") +
                ">";
            sitOutsHtml += genoaFieldingInfo[i].name.replace("_", " ");
            sitOutsHtml += "</p>";
        }
    }
    sitOutsHtml += "</section>";
    sitOutsHtml += "</div>\n";
    document.getElementById("sitOuts").innerHTML = sitOutsHtml;
    for (let i = 0; i < prosciuttoFieldingInfo.length; i++) {
        if (!prosciuttoFieldingInfo[i].sitOutArray[inning % 7]) {
            prosciuttofieldersHtml +=
                "<p" +
                (prosciuttoFieldingInfo[i].female ? ' class="female"' : "") +
                ">";
            prosciuttofieldersHtml += prosciuttoFieldingInfo[i].name.replace(
                "_",
                " "
            );
            prosciuttofieldersHtml += "</p>";
        }
    }
    if ((inning % 7) % 2 === 0) {
        document.getElementById("infielders").innerHTML =
            prosciuttofieldersHtml;
    } else {
        document.getElementById("outfielders").innerHTML =
            prosciuttofieldersHtml;
    }
    for (let i = 0; i < genoaFieldingInfo.length; i++) {
        if (!genoaFieldingInfo[i].sitOutArray[inning % 7]) {
            genoafieldersHtml +=
                "<p" +
                (genoaFieldingInfo[i].female ? ' class="female"' : "") +
                ">";
            genoafieldersHtml += genoaFieldingInfo[i].name.replace("_", " ");
            genoafieldersHtml += "</p>";
        }
    }
    if ((inning % 7) % 2 === 1) {
        document.getElementById("infielders").innerHTML = genoafieldersHtml;
    } else {
        document.getElementById("outfielders").innerHTML = genoafieldersHtml;
    }
}
function nextInning() {
    inningCounter++;
    displayFieldingPositions(inningCounter);
}
function previousInning() {
    inningCounter--;
    displayFieldingPositions(inningCounter);
}
function setConfigQueryParam(value) {
    if ("URLSearchParams" in window) {
        const url = new URL(window.location);
        url.searchParams.set("config", value);
        history.pushState(null, "", url);
    }
}
document.addEventListener("DOMContentLoaded", createLineup());
