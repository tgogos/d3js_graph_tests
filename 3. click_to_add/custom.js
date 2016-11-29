$( document ).ready(function() {

    //Width and height
    var w = $(window).width();
    var h = $(window).height();



    // 
    // as the window resizes, svg takes the size of the window
    // and remains "full width" & "full height"
    //
    $( window ).resize(function() {
        w = $(window).width();
        h = $(window).height();
        //console.log(w+ " "+h);
        svg.attr("width", w);
        svg.attr("height", h);
    });



    //
    // Define zoom behavior
    //
    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);

    function zoomed() {
      srvGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }



    //
    // Define drag behavior
    //
    var drag = d3.behavior.drag()
        .origin(function(d) { return d; })
        .on("dragstart", dragstarted)
        .on("drag", dragged)
        .on("dragend", dragended);

    function dragstarted(d) {
      d3.event.sourceEvent.stopPropagation();
      d3.select(this).classed("dragging", true);
    }

    function dragged(d) {
      d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    }

    function dragended(d) {
      d3.select(this).classed("dragging", false);
    }



    //
    // Create SVG element and a group where services will be added
    //
    var svg = d3.select(".svg-container")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h)
                        .call(zoom);

    var srvGroup = svg.append("g").attr("class","srv-group");




    //
    // when a service is clicked from the list
    // add it to the svg area
    //

    var dataset = new Array();
    $('.srv-list .srv').click(function(){
      
      data = new Object();
      data.x = 600;
      data.y = 600;
      dataset.push(data);

      var circles = srvGroup.selectAll("circle")
           .data(dataset)
           .enter()
           .append("circle")
           .call(drag);

       circles.attr("cx", function(d) {
               return d.x;
           })
          .attr("cy", function(d) {
               return d.y;
           })
          .attr("r", function(d) {
               return 50;
          });

      // srvGroup.selectAll('rect').append('rect')
      //                 .data({x:400,y:400}).enter().append("rect")
      //                 .attr("class","srv")
      //                 .attr("x", 400)
      //                 .attr("y", 400)
      //                 .attr("width", 50)
      //                 .attr("height", 100)
      //                 .call(drag);

      // srvGroup.selectAll("rect")
      //      .data({x:400,y:400})
      //      .enter()
      //      .append("rect")
      //      .attr("x", 400)
      //      .attr("y", 400)
      //      .attr("width", 50)
      //      .attr("height", 100)
      //      .call(drag);
    });










    

    
    // //generate randomly 100 center points for circles
    // var dataset = generateData(100);


    



    
    

    

    // var circleGroup = svg.append("g").attr("class","circle-group");

    // var circles = circleGroup.selectAll("circle")
    //      .data(dataset)
    //      .enter()
    //      .append("circle")
    //      .call(drag);

    //  circles.attr("cx", function(d) {
    //          return d.x;
    //      })
    //     .attr("cy", function(d) {
    //          return d.y;
    //      })
    //     .attr("r", function(d) {
    //          return randomIntFromInterval(5,25);
    //     });


    

    // function generateData(quantity) {
    //     var data = new Array(quantity);
    //     for (i=0; i<quantity; i++) {
    //         data[i] = new Object();
    //         data[i].x = randomIntFromInterval(0,w)
    //         data[i].y = randomIntFromInterval(0,h)
    //     }
    //     return data;
    // }


    


    

}); // end of   $( document ).ready()