// Adding court to HTML via D3

const margin = { left: 20, right: 20, top: 20, bottom: 20 };
var court = d3.select('#svg').append('svg');
var height = 900/50*47
var width = 900
court.attr('width', 900)
     .attr('height', 900/50*47);

var court_g = court.append('g');


var slider_axis = court.append('g')
                       .attr('class', 'slider-axis');
var slider_rect = court.append('g')
                       .attr('class', 'slider-rect');

var rect_entity = slider_rect.append('rect');

const court_xScale = d3.scaleLinear()
                             .domain([-25, 25]);
const court_yScale = d3.scaleLinear()
                             .domain([-4,43]);
const shot_xScale = d3.scaleLinear()
                             .domain([-250, 250]);
const shot_yScale = d3.scaleLinear()
                             .domain([-45,420]);

var color = d3.scaleSequential(d3.interpolateOrRd)
              .domain([5e-6, 3e-2]); // Points per square pixel.



var Basket = court_g.append('circle');
var Backboard = court_g.append('rect');
var Outterbox = court_g.append('rect');
var Innerbox = court_g.append('rect');
var CornerThreeLeft = court_g.append('rect');
var CornerThreeRight = court_g.append('rect');
var OuterLine = court_g.append('rect');
var RestrictedArea = court_g.append('path')
var TopFreeThrow = court_g.append('path')
var BottomFreeThrow = court_g.append('path')
var ThreeLine = court_g.append('path')
var CenterOuter = court_g.append('path')
var CenterInner = court_g.append('path')

//Function to draw court

function draw_court(){
    const width = 900;
    const height = width/50*47;
    court_g.attr("width", width)
           .attr("height", height)

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    court_xScale.range([margin.left, innerWidth])
              .nice();

    court_yScale.range([margin.top, innerHeight])
              .nice();

    Basket.attr('cx', court_xScale(0))
           .attr('cy', court_yScale(-0.75))
           .attr('r', court_yScale(0.75)-court_yScale(0))
           .style('fill', 'None')
           .style('stroke', 'white');

    Backboard.attr('x', court_xScale(-3))
           .attr('y', court_yScale(-1.5))
           .attr('width', court_xScale(3)-court_xScale(-3))
           .attr('height', 1)
           .style('fill', 'none')
           .style('stroke', 'white');


    Outterbox
           .attr('x', court_xScale(-8))
           .attr('y', court_yScale(-4))
           .attr('width', court_xScale(8)-court_xScale(-8))
           .attr('height', court_yScale(15)-court_yScale(-4))
           .style('fill', 'none')
           .style('stroke', 'white');


    Innerbox
           .attr('x', court_xScale(-6))
           .attr('y', court_yScale(-4))
           .attr('width', court_xScale(6)-court_xScale(-6))
           .attr('height', court_yScale(15)-court_yScale(-4))
           .style('fill', 'none')
           .style('stroke', 'white');


    CornerThreeLeft
           .attr('x', court_xScale(-22))
           .attr('y', court_yScale(-4))
           .attr('width', 1)
           .attr('height', court_yScale(10)-court_yScale(-4))
           .style('fill', 'none')
           .style('stroke', 'white');

    CornerThreeRight
           .attr('x', court_xScale(22))
           .attr('y', court_yScale(-4))
           .attr('width', 1)
           .attr('height', court_yScale(10)-court_yScale(-4))
           .style('fill', 'none')
           .style('stroke', 'white');

    OuterLine
           .attr('x', court_xScale(-25))
           .attr('y', court_yScale(-4))
           .attr('width', court_xScale(25)-court_xScale(-25))
           .attr('height', court_yScale(43)-court_yScale(-4))
           .style('fill', 'none')
           .style('stroke', 'white');

    appendArcPath(RestrictedArea, court_xScale(3)-court_xScale(0), (90)*(Math.PI/180), (270)*(Math.PI/180))
        .attr('fill', 'none')
        .attr("stroke", "white")
        .attr("transform", "translate(" + court_xScale(0) + ", " +court_yScale(-0.75) +")");


    appendArcPath(TopFreeThrow, court_xScale(6)-court_xScale(0), (90)*(Math.PI/180), (270)*(Math.PI/180))
        .attr('fill', 'none')
        .attr("stroke", "white")
        .attr("transform", "translate(" + court_xScale(0) + ", " +court_yScale(15) +")");


    appendArcPath(BottomFreeThrow, court_xScale(6)-court_xScale(0), (-90)*(Math.PI/180), (90)*(Math.PI/180))
        .attr('fill', 'none')
        .attr("stroke", "white")
        .style("stroke-dasharray", ("3, 3"))
        .attr("transform", "translate(" + court_xScale(0) + ", " +court_yScale(15) +")");


    var angle = Math.atan((10-0.75)/(22))* 180 / Math.PI
    var dis = court_yScale(18);
    appendArcPath(ThreeLine, dis, (angle+90)*(Math.PI/180), (270-angle)*(Math.PI/180))
        .attr('fill', 'none')
        .attr("stroke", "white")
        .attr('class', 'shot-chart-court-3pt-line')
        .attr("transform", "translate(" + court_xScale(0) + ", " +court_yScale(0) +")");


    appendArcPath(CenterOuter, court_xScale(6)-court_xScale(0), (-90)*(Math.PI/180), (90)*(Math.PI/180))
        .attr('fill', 'none')
        .attr("stroke", "white")
        .attr("transform", "translate(" + court_xScale(0) + ", " +court_yScale(43) +")");

    appendArcPath(CenterInner, court_xScale(2)-court_xScale(0), (-90)*(Math.PI/180), (90)*(Math.PI/180))
        .attr('fill', 'none')
        .attr("stroke", "white")
        .attr("transform", "translate(" + court_xScale(0) + ", " +court_yScale(43) +")");
}


//Function to draw 3-point line

function appendArcPath(base, radius, startAngle, endAngle) {
      var points = 30;

      var angle = d3.scaleLinear()
          .domain([0, points - 1])
          .range([startAngle, endAngle]);

      var line = d3.lineRadial()
          .radius(radius)
          .angle(function(d, i) { return angle(i); });

      return base.datum(d3.range(points))
          .attr("d", line);
}

// Adding shots into court

function add_shot(year, player){


    const width = 900;
    const height = width/50*47;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    shot_xScale.range([margin.left, innerWidth])
               .nice();

    shot_yScale.range([margin.top, innerHeight])
               .nice();


    d3.json('sample.json', data => {

      // var heatmap = h337.create({
      //   container: domElement
      // });


      // heatmap.setData({
      //   max: 5,
      //   min: 0,
      //   data: playerdata
      // });

      const loc_x = data.Loc_X;
      const loc_y = data.Loc_Y;
      console.log(loc_x,loc_y)

      var bottomAxis = d3.axisBottom(shot_xScale);
      var leftAxis = d3.axisLeft(shot_yScale);

      var circlesGroup = court_g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => shot_xScale(d.Loc_X))
      .attr("cy", d => shot_yScale(d.Loc_Y))
      .attr("r", "5")
      .attr("fill", "pink")
      .attr("opacity",".5");
    });

};

// Functional that will allow us to plot based off selection

// function init() {
//   // Grab a reference to the dropdown select element
//   var selector = d3.select("#player");
//   var selector = d3.select("#season");

//   // Use the list of sample names to populate the select options
//   d3.json("/player_id").then((player) => {
//     player.forEach((sample) => {
//       selector
//         .append("option")
//         .text(sample)
//         .property("value", sample);
//     });

//     // Use the first sample from the list to build the initial plots
//     const firstSample = player[0];
//     add_shot(firstSample);
//   });
// }


draw_court()
add_shot()
// add_heat()