const personsMap = new Map();

const linksMap = new Map();
const personsList = [];
const linksList = [];
const familyLinksList = [];

var FEOn = false;

d3.json("data.json").then((data) => {

    //extractions les données selon: personnes, liens, liens-familiales
    personsList.push.apply(personsList, data.persons);
    linksList.push.apply(linksList, data.links);
    familyLinksList.push.apply(familyLinksList, data["family-links"]);

    //création de la map type: key = nom : value = personne
    for (let p of personsList) {
        personsMap.set(p.name, p);
    }

    for (let l of linksList) {
        var target = linksMap.get(l.target);
        var source = linksMap.get(l.source);

        if (target) {
            if (!linksMap.get(l.target).includes(l))
                linksMap.get(l.target).push(l);
        } else {
            linksMap.set(l.target, [l]);
        }

        if (source) {
            if (!linksMap.get(l.source).includes(l))
                linksMap.get(l.source).push(l);
        } else {
            linksMap.set(l.source, [l]);
        }

    }

    console.log("linksmap", linksMap);

    for (let l of familyLinksList) {
        var target = linksMap.get(l.target);
        var source = linksMap.get(l.source);

        if (target) {
            if (!linksMap.get(l.target).includes(l))
                linksMap.get(l.target).push(l);
        } else {
            linksMap.set(l.target, [l]);
        }

        if (source) {
            if (!linksMap.get(l.target).includes(l))
                linksMap.get(l.target).push(l);
        } else {
            linksMap.set(l.source, [l]);
        }

    }


});