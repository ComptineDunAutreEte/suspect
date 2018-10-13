class CloudGraph{
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
    }

    handleMouseOver(d, i){
             this.svg.append("g")
                 .attr("class", "text")
            .selectAll("coord")         // selectAll something that is []
            .data(this.dataset).enter()
            .append("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", d=> (d.name==='Annie')? "1.2em": "0.8em")
            .attr("x", d => this.xScale(d.position.x+2))
            .attr("y", d => this.yScale(d.position.y+0.5))
            .attr("fill", d=> (d.name==='Annie')? "blue": "black")
            .text(d => `${d.name}, âge: ${d.age}, métier: ${d.metier}`);
    }
    handleMouseOut(data, i){
        this.svg.selectAll("g.text").remove();
    }
    /*
    Aa	* Draw cloud points
           */
    draw() {
        this.xScale = d3.scaleLinear()
            .domain([0, 90])
            .range([0, this.width-150]); // 30 & -30 to not get axis truncated (kind of margin)
        // Create x axis
        const x_axis = d3.axisBottom().scale(this.xScale);
        // Append it to SVG
        this.svg.append("g")
            .attr("transform", `translate(0, ${this.height - 30})`) //Place it to bottom & -30 to not get out of SVG bounds
            .call(x_axis);

        // Same thing with yAxis
        this.yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, this.height-150]);
        const y_axis = d3.axisLeft().scale(this.yScale);
        this.svg.append("g")
            .attr("transform", `translate(30, 0)`)
            .call(y_axis);

        // Create nodes
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        let circle = this.svg
            .selectAll(".circle")
            .data(this.dataset).enter()
            .filter(d=>d.permisArme==="oui")
            .append("circle")
            .attr("cx", d => this.xScale(d.position.x))
            .attr("cy", d => this.yScale(d.position.y))
            .attr("r",d => d.alibi*4)
            .attr("stroke", "black")
            .attr("stroke-width", 3)
            .attr("fill", d=> (d.vision>=8)? "red": "lightgreen");
            /*.on("mouseover", this.handleMouseOver.bind(this))
            .on("mouseout", this.handleMouseOut.bind(this));*/

            console.log(circle);
        var rect = this.svg
            .selectAll("rect")
            .data(this.dataset).enter()
            .filter(d=>d.permisArme==="non")
            .append("rect")
            .attr("x", d => this.xScale(d.position.x))
            .attr("y", d => this.yScale(d.position.y))
            .attr("width",d => d.alibi*8)
            .attr("height",d => d.alibi*8)
            .attr("stroke", "black")
            .attr("stroke-width", 3)
            .attr("fill", d=> (d.vision>=8)? "red": "lightgreen");

        // Create texts
/*==============================Utilisation fisheye Ici=================================*/

        var fisheye = d3.fisheye.circular()
            .radius(1)
            .distortion(1);
        //console.log("fish eye", fisheye);
        this.svg.on("mousemove", function() {
            //console.log(d3.mouse(this));
            fisheye.focus(d3.mouse(this));
            circle.each(function(d) { d.fisheye = fisheye(d.position);})// c'est ici les calculs mais ça ne fais rien!!!
                //ça garde la meme position des rondes de départ
                .attr("cx", function(d) { /*console.log("fish eye", d.fisheye.x)*/;return d.fisheye.x; })
                .attr("cy", function(d) { return d.fisheye.y; })
                .attr("r", function(d) { return d.fisheye.z * 4.5; });

            /*link.attr("x1", function(d) { return d.source.fisheye.x; })
                .attr("y1", function(d) { return d.source.fisheye.y; })
                .attr("x2", function(d) { return d.target.fisheye.x; })
                .attr("y2", function(d) { return d.target.fisheye.y; });*/
        });

/*,role: ${d.metier}, taille: ${d.taille} age: ${d.age}, alibi: ${d.alibi}, permisArme: ${d.permisArme}, vision: ${d.vision}*/

    }

}