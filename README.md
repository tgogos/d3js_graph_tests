# Graph tool similar to Juju-GUI using D3.js

 - The idea is to be able to add/delete nodes and connect/disconnect them.
 - Folders 1.{...} through 4{...} were the intermediate steps till the final result (5) as I was trying to find my way on how to use d3.js.
 - If you want to serve it with a tiny web server and `Go` is available on your system you can use the `server.go` file. Run it with:

        go run server.go

## Functionality:

 - add nodes by clicking on the left
 - connect 2 nodes A-B by clicking A's :link: icon and dragging the line to B's :link: icon
 - select a node or a line by clicking on it (the dashed outline means it is selected)
 - delete a node or a line by first selecting it and then by clicking the delete button
 - zoom in/out by using the scroll wheel
 - pan by clicking/dragging on the canvas

## Screenshots

![](/README.files/example.jpg)


## Update May 2018, the same with vis.js

 - More or less similar functionality (zoom in/out, panning, add/remove/edit nodes and links) by using vis.js
 - You can find it inside the `vis.js` folder

![](/README.files/vis.js-screenshot.jpg)