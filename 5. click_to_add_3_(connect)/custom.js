$( document ).ready(function() {
    
    //
    // Global variables
    //
    var w           = $(window).width();
        h           = $(window).height();
        svgWrap     = $('.svg-container');
        sx          = 305;            // starting point when service thumb is added (305,5)
        sy          = 5;
        nodes       = new Array();
        links       = new Array();
        id          = 0;
        translate   = [0,0];
        scale       = 1;

        nodeBeforeDrag = [0,0];




    //
    // mouse event vars
    //
    var selected_node = null,
        selected_link = null,
        mousedown_link = null,
        mousedown_node = null,
        mouseup_node = null;

    function resetMouseVars() {
      mousedown_node = null;
      mouseup_node = null;
      mousedown_link = null;
    }
        


    //
    // Define zoom behavior
    //
    var zoom = d3.behavior.zoom()
        .scaleExtent([0.25, 2])
        .on("zoom", zoomed);

    function zoomed() {
      translate = d3.event.translate;
      scale     = d3.event.scale;
      //console.log(d3.event.translate);
      svgWrap.css("background-position",translate[0]+"px "+translate[1]+"px ");
      nodeGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      linkGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      dragGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
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
      //console.log(d.id + " " + d.x+","+d.y);
      d3.select(this).attr("transform", "translate(" + d.x + "," + d.y + ")");
      updateLinksWithNode(d);
    }
    function dragended(d) {
      d3.select(this).classed("dragging", false);
    }







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
    // Create SVG element and a group where services will be added
    //
    var svg = d3.select(".svg-container")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h)
                        .call(zoom);


    // line displayed when dragging new nodes
    var dragGroup   = svg.append('g')
    var drag_line   = dragGroup.append('path') 
                        .attr('class', 'link dragline hidden')
                        .attr('d', 'M0,0L0,0');


    var linkGroup = svg.append("g").attr("class","link-group");
    var nodeGroup = svg.append("g").attr("class","node-group");






    //
    // when a service is clicked from the list
    // add it to the svg area
    //
    $('.node-list .node').click(function(){

      var classAttr  = $(this).attr('class');
      var nodeIconUrl = "";
      var text        = "";
          sx          += 5;
          sy          += 5;

      if ( classAttr.indexOf('mysql') > -1) {
          nodeIconUrl = "svg/mysql.svg";
          text        = "MySql"
      }
      else if ( classAttr.indexOf('apache') > -1) {
          nodeIconUrl = "svg/apache.svg";
          text        = "Apache"
      }
      else if ( classAttr.indexOf('postgresql') > -1) {
          nodeIconUrl = "svg/postgresql.svg";
          text        = "Postgresql"
      }
      else if ( classAttr.indexOf('ubuntu') > -1) {
          nodeIconUrl = "svg/ubuntu.svg";
          text        = "Ubuntu"
      }

      node = {
                id:       "n"+(id++),
                x:        sx,
                y:        sy,
                selected: false
              };
      nodes.push(node);
      //console.log(nodes);

      var nodeBox = nodeGroup.selectAll("g")
                  .data(nodes)
                  .enter()
                  .append("g")
                  .attr("id",function(d){
                     return d.id;
                  })
                  .attr("class",classAttr)
                  .attr("transform", function(d){
                    return "translate(" + d.x + "," + d.y + ")"})
                  .call(drag)
                  .on("mousedown",function(d){
                    nodeBeforeDrag = [d.x,d.y];
                  })
                  .on("mouseup",function(d){
                    if ((nodeBeforeDrag[0] == d.x) && (nodeBeforeDrag[1]==d.y)) {
                      //console.log("didn't move");
                      d.selected = !d.selected;
                      d3.select(this).select('rect').classed("selected", !d3.select(this).select('rect').classed("selected"));
                    }
                    nodeBeforeDrag == [d.x,d.y];
                  });
      
      nodeBox.append("rect")
          .attr("x",0)
          .attr("y",0)
          .attr("rx",30)
          .attr("width",196)
          .attr("height",196)
          .attr("class", "node-wrap");

      nodeBox.append("image")
          .attr("x", 50)
          .attr("y", 50)
          .attr("width",96)
          .attr("height",96)
          .attr("xlink:href", nodeIconUrl);

      nodeBox.append("image")
          .attr("x", 85)
          .attr("y", 155)
          .attr("width",26)
          .attr("height",26)
          .attr("xlink:href", "svg/link.svg")
          // .on("mousedown", function(){
          //   d3.event.stopPropagation();
          // })
          // .on('click', function(d,i){ 
          //   console.log("link icon clicked!");
          // });
          .on('mouseover', function(d) {
                //console.log("mouse over");
                if(!mousedown_node || d === mousedown_node) return;
                // enlarge target node
                //d3.select(this).attr('transform', 'scale(1.3)');
              })
              .on('mouseout', function(d) {
                //console.log("mouse out");
                if(!mousedown_node || d === mousedown_node) return;
                // unenlarge target node
                d3.select(this).attr('transform', '');
              })
              .on('mousedown', function(d) {
                d3.event.stopPropagation();
                //console.log("mouse down");
                if(d3.event.ctrlKey) return;

                // select node
                mousedown_node = d;
                if(mousedown_node === selected_node) selected_node = null;
                else selected_node = mousedown_node;
                selected_link = null;

                // reposition drag line
                drag_line
                  .classed('hidden', false)
                  .attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y);

                //restart();
              })
              .on('mouseup', function(d) {
                //console.log("mouse up");
                //console.log(mousedown_node);
                if(!mousedown_node) return;

                // needed by FF
                drag_line
                  .classed('hidden', true)
                  .style('marker-end', '');

                // check for drag-to-self
                mouseup_node = d;
                if(mouseup_node === mousedown_node) { resetMouseVars(); return; }

                // unenlarge target node
                //d3.select(this).attr('transform', '');

                // add link to graph (update if exists)
                // NB: links are strictly source < target; arrows separately specified by booleans
                var source, target, link;
                //console.log(mousedown_node.id + " " + mouseup_node.id);
                  
                source = mousedown_node;
                target = mouseup_node;

                link = links.filter(function(l) {
                  return (l.source === source && l.target === target);
                })[0];

                if(link) {
                  //link[direction] = true;
                } else {
                  link = {
                            source:   source,
                            target:   target,
                            id:       ('s' + source.id + 't'+target.id),
                            selected: false
                          };
                  //link[direction] = true;
                  links.push(link);
                  //console.log(links);

                  linkGroup.selectAll('path')
                            .data(links)
                            .enter()
                            .append('path') 
                            .attr('class', function(d){
                              return ('link ' + d.id);
                            })
                            .attr('d', function(d){
                              var cx1, cy1, cx2, xy2;
                              cx1 = d.source.x + 98;
                              cy1 = d.source.y + 98;
                              cx2 = d.target.x + 98;
                              cy2 = d.target.y + 98;
                              return 'M' + cx1 + ',' + cy1 + 'L' + cx2 + ',' + cy2;
                            })
                            .on('mousedown', function(d) {
                              //d3.event.ctrlKey
                              //toggle "selected"
                              d.selected = !d.selected;
                              d3.select(this).classed("selected", !d3.select(this).classed("selected"));
                            });
                }
              })


      nodeBox.append("text")
          .attr("class","noselect")
          .attr("x", 100)
          .attr("y", 35)
          .style("fill","rgb(146, 146, 146)")
          .text(text);

      


    }); // end of on_click()
    





  function mousemove() {
    if(!mousedown_node) return;
    drag_line.attr('d', 'M' + (mousedown_node.x + 98) + ',' + (mousedown_node.y + 98) + 'L' + ((d3.mouse(this)[0] - translate[0])/scale) + ',' + ((d3.mouse(this)[1] - translate[1])/scale));
  }

  function mouseup() {
    if(mousedown_node) {
      // hide drag line
      drag_line
        .classed('hidden', true)
    }

    // because :active only works in WebKit?
    svg.classed('active', false);

    // clear mouse event vars
    resetMouseVars();
  }



  // only respond once per keydown
  var lastKeyDown = -1;

  function keydown() {
    //d3.event.preventDefault();

    if(lastKeyDown !== -1) return;
    lastKeyDown = d3.event.keyCode;

    //if(!selected_node && !selected_link) return;
    switch(d3.event.keyCode) {
      case 46: // delete
        deleteSelectedLinks();
        deleteSelectedNodes();
        break;
    }
  }

  function keyup() {
    lastKeyDown = -1;
  }



  svg//.on('mousedown', mousedown)
    .on('mousemove', mousemove)
    .on('mouseup', mouseup);

  d3.select(window)
  .on('keydown', keydown)
  .on('keyup', keyup);




  //
  // deletes (if exists any) selected link lines
  //
  function deleteSelectedLinks() {
    i = links.length;
    while (i--) {
      if (links[i].selected) {
        linkGroup.select("."+links[i].id).remove();
        links.splice(i, 1);
      }
    }
  }


  //
  // deletes link lines from "node"
  //
  function deleteLinksFromNode(node) {
    j = links.length;
    while (j--) {
      if ( links[j].source.id == node.id || links[j].target.id == node.id ) {
        linkGroup.select("."+links[j].id).remove();   // delete from svg
        links.splice(j, 1);                           // delete from data array
      }
    }
  }


  //
  // deletes (if exists any) selected node and its links
  //
  function deleteSelectedNodes() {
    i = nodes.length;
    while (i--) {
      if (nodes[i].selected) {
        nodeGroup.select("#" + nodes[i].id).remove();
        deleteLinksFromNode(nodes[i]);
        nodes.splice(i, 1);
      }
    }
  }



  //
  // finds and updates links (x,y) position with "node" as source or target
  //
  function updateLinksWithNode(node) {
    for ( i=0 ; i<links.length ; i++) {
      if ( links[i].source.id == node.id || links[i].target.id == node.id )  {
        linkGroup.select("."+links[i].id)
                  .attr('d', function(){
                    var cx1, cy1, cx2, xy2;
                    cx1 = links[i].source.x + 98;
                    cy1 = links[i].source.y + 98;
                    cx2 = links[i].target.x + 98;
                    cy2 = links[i].target.y + 98;
                    return 'M' + cx1 + ',' + cy1 + 'L' + cx2 + ',' + cy2;
                  });    
      }
    }
  }
    

}); // end of   $( document ).ready()