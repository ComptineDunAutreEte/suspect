class CloudGraph {
    /**
     * @param {String} id
     * @param {Number} dataset
     * @param {Number} width
     * @param {Number} height
     */
    constructor(id, dataset, width, height, d3) {
        this.dataset = dataset.persons;
        this.id = id;
        this.width = width;
        this.height = height;
        this.svg = d3.select(this.id).attr("width", this.width).attr("height", this.height);


        this.xScale = d3.scaleLinear()
            .domain([0, 105])
            .range([0, this.width - 200]);

        this.yScale = d3.scaleLinear()
            .domain([0, 120])
            .range([0, this.height - 100]);

    }

    showAllLinks(bool) {
        if (bool) {
            FEOn = false;
            const positionLinkX = this.getPositionLinkX;
            const positionLinkY = this.getPositionLinkY;
            this.svg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(linksList).enter()
                .append("line")
                .attr("stroke-width", 5)
                .attr("stroke", "blue")
                .attr("x1", p => this.xScale(positionLinkX(personsMap.get(p.source))))
                .attr("y1", p => this.yScale(positionLinkY(personsMap.get(p.source))))
                .attr("x2", p => this.xScale(positionLinkX(personsMap.get(p.target))))
                .attr("y2", p => this.yScale(positionLinkY(personsMap.get(p.target))));
        } else {
            this.svg.selectAll("g.links").remove();
        }
    }

    showAllFLinks(bool) {
        if (bool) {
            FEOn = false;
            const positionLinkX = this.getPositionLinkX;
            const positionLinkY = this.getPositionLinkY;
            this.svg.append("g")
                .attr("class", "linksf")
                .selectAll("line")
                .data(familyLinksList).enter()
                .append("line")
                .attr("stroke-width", 5)
                .attr("stroke", "pink")
                .attr("x1", p => this.xScale(positionLinkX(personsMap.get(p.source))))
                .attr("y1", p => this.yScale(positionLinkY(personsMap.get(p.source))))
                .attr("x2", p => this.xScale(positionLinkX(personsMap.get(p.target))))
                .attr("y2", p => this.yScale(positionLinkY(personsMap.get(p.target))));
        } else {
            this.svg.selectAll("g.linksf").remove();
        }
    }

    handleMouseOver(d, i) {
        if (!FEOn) {
            var list = linksMap.get(d.name);
            console.log(list);
            if (list) {
                const positionLinkX = this.getPositionLinkX;
                const positionLinkY = this.getPositionLinkY;
                this.svg.append("g")
                    .attr("class", "links")
                    .selectAll("line")
                    .data(list).enter()
                    .append("line")
                    .attr("stroke-width", 5)
                    .attr("stroke", p => (linksList.includes(p)) ? "blue" : "pink")
                    .attr("x1", p => this.xScale(positionLinkX(personsMap.get(p.source))))
                    .attr("y1", p => this.yScale(positionLinkY(personsMap.get(p.source))))
                    .attr("x2", p => this.xScale(positionLinkX(personsMap.get(p.target))))
                    .attr("y2", p => this.yScale(positionLinkY(personsMap.get(p.target))));

                this.svg.append("g")
                    .attr("class", "text")
                    .selectAll("text")
                    .data(list).enter()
                    .append("text")
                    .filter(p => d.name !== p.target)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "1.5em")
                    .attr("fill", "blue")
                    .attr("x", p => this.xScale(positionLinkX(personsMap.get(p.target)) + 3))
                    .attr("y", p => this.yScale(positionLinkY(personsMap.get(p.target)) + 0.5))
                    .text(p => p.target);

                this.svg.append("g")
                    .attr("class", "text")
                    .selectAll("text")
                    .data(list).enter()
                    .append("text")
                    .filter(p => d.name !== p.source)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "1.5em")
                    .attr("fill", "blue")
                    .attr("x", p => this.xScale(positionLinkX(personsMap.get(p.source)) + 3))
                    .attr("y", p => this.yScale(positionLinkY(personsMap.get(p.source)) + 0.5))
                    .text(p => p.source);

                var str = this.makeStringLinks(d.name, list);
                d3.select("#liens").html(str);
            }

        }
        this.info(d.name, d.age, d.metier, d.taille);

    }

    makeStringLinks(name, links) {
        var str = "";
        str += "<p>";
        for (let l of links) {
            if (l.target === name)
                str += l.relation.toUpperCase() + " avec " + l.source.toUpperCase() + ", ";
            else
                str += l.relation.toUpperCase() + " avec " + l.target.toUpperCase() + ", ";
        }
        str += "</p>"
        return str;
    }


    info(nom, age, metier, taille) {
        d3.select("#nom").html(nom);
        d3.select("#age").html(age);
        d3.select("#metier").html(metier);
        d3.select("#taille").html(taille);
    }

    handleMouseOut(data, i) {
        this.svg.selectAll("g.text").remove();
        this.svg.selectAll("g.links").remove();
        this.info("", "", "", "");
        d3.select("#liens").html("");
    }

    /*
    Aa	* Draw cloud points
           */
    draw() {


        // Create nodes
        const getRectDim = this.getRectDim;
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        let circle = this.svg
            .selectAll(".circle")
            .data(this.dataset).enter()
            .filter(d => d.name === "Annie")
            .append("circle")
            .attr("cx", d => this.xScale(d.position.x))
            .attr("cy", d => this.yScale(d.position.y))
            .attr("r", d => circleR)
            .attr("fill", "black")
            .on("mouseover", this.handleMouseOver.bind(this))
            .on("mouseout", this.handleMouseOut.bind(this));


        var rect = this.svg
            .selectAll("rect")
            .data(this.dataset).enter()
            .filter(d => d.name !== "Annie")
            .append("rect")
            .attr("x", d => this.xScale(d.position.x))
            .attr("y", d => this.yScale(d.position.y))
            .attr("width", d => getRectDim(d))
            .attr("height", d => getRectDim(d))
            .attr("stroke", "black")
            .attr("stroke-width", 3)
            .attr("fill", d => this.getVisionColor(d.vision))
            .on("mouseover", this.handleMouseOver.bind(this))
            .on("mouseout", this.handleMouseOut.bind(this));

        var images = this.svg
            .selectAll("image")
            .data(this.dataset).enter()
            .filter(d => d.permisArme === "oui")
            .append("image")
            .attr("xlink:href", "gun.png")
            .attr("x", d => this.xScale(d.position.x))
            .attr("y", d => this.yScale(d.position.y))
            .attr("width", d => getRectDim(d))
            .attr("height", d => getRectDim(d))
            .on("mouseover", this.handleMouseOver.bind(this))
            .on("mouseout", this.handleMouseOut.bind(this));


        // Create texts
        /*==============================Utilisation fisheye Ici=================================*/

        const fisheye = d3.fisheye.circular()
            .radius(100)
            .distortion(8);
        const xScale2 = this.xScale;
        const yScale2 = this.yScale;
        const getRectFishEyeDim = this.getRectFishEyeDim;
        this.svg.on("mousemove",
            function () {
                if (FEOn) {
                    fisheye.focus(d3.mouse(this));

                    rect.each((d) => d.fisheye = fisheye({"x": xScale2(d.position.x), "y": yScale2(d.position.y)}))
                        .attr("x", function (d) {
                            return d.fisheye.x;
                        })
                        .attr("y", function (d) {
                            return d.fisheye.y;
                        })
                        .attr("width", d => getRectFishEyeDim(d))
                        .attr("height", d => getRectFishEyeDim(d));

                    images.each((d) => d.fisheye = fisheye({"x": xScale2(d.position.x), "y": yScale2(d.position.y)}))
                        .attr("x", function (d) {
                            return d.fisheye.x;
                        })
                        .attr("y", function (d) {
                            return d.fisheye.y;
                        })
                        .attr("width", d => getRectFishEyeDim(d))
                        .attr("height", d => getRectFishEyeDim(d));
                }

            });
    }

    getRectFishEyeDim(person) {
        if (person.alibi > 5) {
            return person.fisheye.z * (10 - person.alibi) * rectDim;
        }
        else {
            return (10 - person.alibi) * rectDim;
        }
    }

    getRectDim(person) {
        return (10 - person.alibi) * rectDim;
    }

    getPositionLinkX(person) {
        if (person.role === "suspect") {
            var linkX = ((10 - person.alibi) / 3);
            console.log("link", linkX);
            return person.position.x + linkX;
        } else {
            return person.position.x;
        }
    }

    getPositionLinkY(person) {
        if (person.role === "suspect") {
            return person.position.y + ((10 - person.alibi) / 2);
        } else {
            return person.position.y;
        }
    }

    getVisionColor(vision) {
        if (5 <= vision && vision < 8) {
            return "orange";
        } else if (vision < 5) {
            return "red";
        } else {
            return "green";
        }
        return "red";
    }

}