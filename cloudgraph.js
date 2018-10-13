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

        this.rectDim = 5;
        this.circleR = 15;
    }

    handleMouseOver(d, i) {
        this.svg.append("g")
            .attr("class", "text")
            .selectAll("coord")         // selectAll something that is []
            .data(this.dataset).enter()
            .append("text")
            .filter(p => (d.name === p.name))
            .attr("font-family", "sans-serif")
            .attr("font-size", "0.8em")
            .attr("x", p => this.xScale(d.position.x + 2))
            .attr("y", p => this.yScale(d.position.y + 0.5))
            .text(d => `${d.name}, âge: ${d.age}, métier: ${d.metier}`);
    }

    handleMouseOut(data, i) {
        this.svg.selectAll("g.text").remove();
    }

    /*
    Aa	* Draw cloud points
           */
    draw() {
        this.xScale = d3.scaleLinear()
            .domain([0, 90])
            .range([0, this.width - 150]); // 30 & -30 to not get axis truncated (kind of margin)
        // Create x axis
       /* const x_axis = d3.axisBottom().scale(this.xScale);
        // Append it to SVG
        this.svg.append("g")
            .attr("transform", `translate(0, ${this.height - 30})`) //Place it to bottom & -30 to not get out of SVG bounds
            .call(x_axis);*/

        // Same thing with yAxis
        this.yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, this.height - 100]);
        /*const y_axis = d3.axisLeft().scale(this.yScale);
        this.svg.append("g")
            .attr("transform", `translate(30, 0)`)
            .call(y_axis);*/

        // Create nodes
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        let circle = this.svg
            .selectAll(".circle")
            .data(this.dataset).enter()
            .filter(d => d.name === "Annie")
            .append("circle")
            .attr("cx", d => this.xScale(d.position.x))
            .attr("cy", d => this.yScale(d.position.y))
            .attr("r", d => this.circleR)
            .attr("fill", "black");

        console.log(circle);
        var rect = this.svg
            .selectAll("rect")
            .data(this.dataset).enter()
            .filter(d => d.name !== "Annie")
            .append("rect")
            .attr("x", d => this.xScale(d.position.x))
            .attr("y", d => this.yScale(d.position.y))
            .attr("width", d=> (10 - d.alibi)*this.rectDim)
            .attr("height", d=> (10 - d.alibi)*this.rectDim)
            .attr("stroke", "black")
            .attr("stroke-width", 3)
            .attr("fill", d => this.getVisionColor(d.vision))
            .on("mouseover", this.handleMouseOver.bind(this))
            .on("mouseout", this.handleMouseOut.bind(this));

        // Create texts
        /*==============================Utilisation fisheye Ici=================================*/

        const fisheye = d3.fisheye.circular()
            .radius(120)
            .distortion(10);
        let rectDim = this.rectDim;
        const xScale2 = this.xScale;
        const yScale2 = this.yScale;
        this.svg.on("mousemove",
            function () {
                fisheye.focus(d3.mouse(this));

                rect.each((d) => d.fisheye = fisheye({"x":xScale2(d.position.x),"y":yScale2(d.position.y)}))
                    .attr("x", function (d) {
                        return d.fisheye.x;
                    })
                    .attr("y", function (d) {
                        return d.fisheye.y;
                    })
                    .attr("width", function (d) {
                        return d.fisheye.z*8;
                    })
                    .attr("height", function (d) {
                        return d.fisheye.z*8;
                    });
        });
        //var fisheye = d3.fisheye.circular()
            //.radius(100)
            //.distortion(8);
        //console.log("fish eye", fisheye);
       /* let b = this.xScale;
        let c = this.yScale;
       // let circleR = this.circleR;
        let rectDim = this.rectDim;


        const fisheye = d3.fisheye.circular()

            .radius(300)

            .distortion(10);

        const xScale2 =
            this.xScale;

        const yScale2 =
            this.yScale;

        this.svg.on("mousemove",
            function () {

                fisheye.focus(d3.mouse(this));

                circle.each(

                    (d) => d.fisheye = fisheye({"x":xScale2(d.position.x),"y":yScale2(d.position.x)}))

                    .attr("cx", d
                        => d.fisheye.x)

                    .attr("cy", d
                        => d.fisheye.y)

                    .attr("r", d
                        => d.fisheye.z * 4.5);

            });
        this.svg.on("mousemove", function () {
            //console.log(d3.mouse(this));
            fisheye.focus(d3.mouse(this));
           /* circle.each(function (d) {
                var x = b(d.position.x);
                var y = c(d.position.y);
                var position = {
                    'x': x,
                    'y': y
                }
                d.fisheye = fisheye(position);
                d.fisheye.z = circleR;

            })// c'est ici les calculs mais ça ne fais rien!!!
            //ça garde la meme position des rondes de départ
                .attr("cx", function (d) { /*console.log("fish eye", d.fisheye.x)*/
                  /*  ;
                    return d.fisheye.x;
                })
                .attr("cy", function (d) {
                    return d.fisheye.y;
                })
                .attr("r", function (d) {
                    return d.fisheye.z;
                });*/

          /*  rect.each(function (d) {
                var x = b(d.position.x);
                var y = c(d.position.y);
                var position = {
                    'x': x,
                    'y': y
                }
                d.fisheye = fisheye(position);
                d.fisheye.z = (10 - d.alibi) * rectDim;
            })
                .attr("x", function (d) {
                    return d.fisheye.x;
                })
                .attr("y", function (d) {
                    return d.fisheye.y;
                })
                .attr("width", function (d) {
                    return d.fisheye.z;
                })
                .attr("height", function (d) {
                    return d.fisheye.z;
                });
        });*/

        /*,role: ${d.metier}, taille: ${d.taille} age: ${d.age}, alibi: ${d.alibi}, permisArme: ${d.permisArme}, vision: ${d.vision}*/

    }

    getVisionColor(vision){
        if(5<= vision && vision < 8){
            return "orange";
        }else if(vision < 5){
            return "red";
        }else{
            return "green";
        }
        return "red";
    }

}