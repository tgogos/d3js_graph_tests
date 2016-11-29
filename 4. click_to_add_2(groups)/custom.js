$( document ).ready(function() {
    
    //
    // Global variables
    //
    var iconGroupXY = new Array();
    var sx = 305;   // starting point when thumb is added (305,5)
    var sy = 5;



    // 
    // as the window resizes, svg takes the size of the window
    // and remains "full width" & "full height"
    //
    var w = $(window).width();
    var h = $(window).height();

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
        .scaleExtent([0.5, 10])
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
      //d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
      d.x = d3.event.x;
      d.y = d3.event.y;
      //console.log(d.x+","+d.y);
      d3.select(this).attr("transform", "translate(" + d.x + "," + d.y + ")");
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

    

    $('.srv-list .srv').click(function(){

      var classAttr  = $(this).attr('class');
      var iconUrl    = "";
      var text       = "";
          sx         += 5;
          sy         += 5;

      if ( classAttr.indexOf('mysql') > -1) {
          iconUrl = "svg/mysql.svg";
          text    = "MySql"
      }
      else if ( classAttr.indexOf('apache') > -1) {
          iconUrl = "svg/apache.svg";
          text    = "Apache"
      }

      coords = { x: sx, y: sy };
      iconGroupXY.push(coords);

      var icon = srvGroup.selectAll("g")
                  .data(iconGroupXY)
                  .enter()
                  .append("g")
                  .attr("class",classAttr)
                  .attr("transform", function(d){
                    return "translate(" + d.x + "," + d.y + ")"})
                  .call(drag);
      
      icon.append("rect")
          .attr("x",0)
          .attr("y",0)
          .attr("rx",30)
          .attr("width",196)
          .attr("height",196)
          .attr("class", "srv-wrap");

      icon.append("image")
          .attr("x", 50)
          .attr("y", 50)
          .attr("width",96)
          .attr("height",96)
          .attr("xlink:href", iconUrl);

      icon.append("text")
          .attr("x", 100)
          .attr("y", 35)
          .style("fill","rgb(146, 146, 146)")
          .text(text);



    });
    


    

}); // end of   $( document ).ready()