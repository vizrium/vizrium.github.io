
var categories = ['All Estimate Low', 'All Estimate High',  'All Number of Lots', 'All Number of Sales', 'Sold Value', 'Sold Estimate Low', 'Sold Estimate High', "Sold Number of Lots", 'Sold Number of Sales'];

var extra = ['Birth Year', 'Death Year', 'Life Span'];

size = ["Select Size"];
size = size.concat(categories);
      for (ix in size) {
        d3.select(".category.mg_dropdown").insert('option').text(size[ix]).attr('value', size[ix])
      }; 


xaxis = ["Select Horizontal Axis"]
xaxis = xaxis.concat(categories);
xaxis = xaxis.concat(extra);

      for (ix in xaxis) {
        d3.select(".direction.mg_dropdown").insert('option').text(xaxis[ix]).attr('value', xaxis[ix])
      }; 


yaxis = ["Select Vertical Axis"]
yaxis = yaxis.concat(categories);
yaxis = yaxis.concat(extra);
      for (ix in yaxis) {
        d3.select(".type.mg_dropdown").insert('option').text(yaxis[ix]).attr('value', yaxis[ix])
      }; 

var fcolor = d3.scale.category10();

setDisabledIndex(document.getElementById("direction"), xaxis[0]);
setDisabledIndex(document.getElementById("type"), yaxis[0]);
setDisabledIndex(document.getElementById("category"), size[0]);

var xaxis_index = 1, yaxis_index = 1, size_index = 1;


setSelectedIndex(document.getElementById("direction"), xaxis[xaxis_index]);
setSelectedIndex(document.getElementById("type"), yaxis[yaxis_index]);
setSelectedIndex(document.getElementById("category"), size[size_index]);



var topheight = 120, height = 600, width = 820;

var select_svg = d3.select("#select-chart").append("svg")
    .attr("width", width)
    .attr("height", height);

var select_text = d3.select("#period");

var select_margin = {top: 20, right: 10, bottom: 50, left: 80},
    select_width = width - select_margin.left - select_margin.right,
    select_height = height - select_margin.top - select_margin.bottom;

var select_x = d3.scale.linear().range([0, select_width]),
    select_y = d3.scale.linear().range([select_height, 0]);

var select_xAxis = d3.svg.axis().scale(select_x).orient("bottom").ticks(5),
    select_yAxis = d3.svg.axis().scale(select_y).orient("left").ticks(5);

var select_focus = select_svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + select_margin.left + "," + select_margin.top + ")");
select_text.transition().duration(750).text("Move Over Circles");


d3.json("market_data_artists.json", function(data){


var s_1 = 0, s_2 = 0, s_3 = 0, s_i = -1;

var s1 = [], s2 = [], s3 = [];

for(i = 0; i < data.length; i ++){

  s1.push(data[i]['numbers'][s_1]);
  s2.push(data[i]['numbers'][s_2]);
  s3.push(data[i]['numbers'][s_3]);

}

s1_min = Math.min.apply(Math, s1);
s1_max = Math.max.apply(Math, s1);

s2_min = Math.min.apply(Math, s2);
s2_max = Math.max.apply(Math, s2);

s3_min = Math.min.apply(Math, s3);
s3_max = Math.max.apply(Math, s3);


select_x.domain([s1_min * 0.85, s1_max * 1.05]);
select_y.domain([s2_min * 0.85, s2_max * 1.05]);

  select_focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + select_height + ")")
      .style("font-size","10px")
      .call(select_xAxis);

  select_focus.append("g")
      .attr("class", "y axis")
            .style("font-size","10px")
      .call(select_yAxis);


  var circles =  select_focus.selectAll("circle")
        .data(data)
      .enter().append("circle")
        .attr("cx", function(d, i) { return select_x(data[i]['numbers'][s_1]) + 50; })
        .attr("cy", function(d, i) { return select_y(data[i]['numbers'][s_2]); })
        .attr("r", function(d, i){ return 0; })
        .attr("fill", function(d, i){ return fcolor(i);})
        // .attr("stroke-width", 1)
        .on("mouseover", function(d, i){
s_i = i;
circles.transition().style("stroke", "none");
d3.select(this).transition().style("stroke", "black");
select_text.transition().duration(750).text(data[i]['artist'] + ' - ' + size[s_3 + 1] + ' : '+ parseInt(data[i]['numbers'][s_3]));
d3.select(this).moveToFront();

   })

        .on("mouseout", function(d, i){

// d3.select(this).transition().style("stroke", "none");
// select_text.transition().duration(750).text("Move Over Circles");   
});


  circles.transition().duration(750)
        .attr("cx", function(d, i) { return select_x(data[i]['numbers'][s_1]); })
        .attr("cy", function(d, i) { return select_y(data[i]['numbers'][s_2]); })
        .attr("r", function(d, i){ return ((data[i]['numbers'][s_3])/s3_max)* 15 + 3; });



d3.selectAll('.mg_dropdown')
        .on('change', function() {

          // console.log(s_1, s_2, s_3);
          // 

          var dropdown_kind = d3.select(this).attr('class').split(' ')[0];

           if (dropdown_kind == 'type') {
             s_2 = yaxis.indexOf(d3.select(this)[0][0].value) -1;
          } else if (dropdown_kind == 'category') {
            s_3 = yaxis.indexOf(d3.select(this)[0][0].value) - 1;
          } else if (dropdown_kind == 'direction') {
            s_1 = yaxis.indexOf(d3.select(this)[0][0].value) - 1;
          };

         update(s_1, s_2, s_3);
          
        });



function update(s_1, s_2, s_3){


var s1 = [], s2 = [], s3 = [];

for(i = 0; i < data.length; i ++){

  s1.push(data[i]['numbers'][s_1]);
  s2.push(data[i]['numbers'][s_2]);
  s3.push(data[i]['numbers'][s_3]);

}

s1_min = Math.min.apply(Math, s1);
s1_max = Math.max.apply(Math, s1);

s2_min = Math.min.apply(Math, s2);
s2_max = Math.max.apply(Math, s2);

s3_min = Math.min.apply(Math, s3);
s3_max = Math.max.apply(Math, s3);


select_x.domain([s1_min * 0.85, s1_max * 1.05]);
select_y.domain([s2_min * 0.85, s2_max * 1.05]);


select_focus.select(".y.axis").call(select_yAxis);
select_focus.select(".x.axis").call(select_xAxis);


  circles.transition().duration(750)
        .attr("cx", function(d, i) { return select_x(data[i]['numbers'][s_1]); })
        .attr("cy", function(d, i) { return select_y(data[i]['numbers'][s_2]); })
        .attr("r", function(d, i){ return ((data[i]['numbers'][s_3])/s3_max)* 15 + 3; });

if( s_i != -1){
select_text.transition().duration(750).text(data[s_i]['artist'] + ' - ' + size[s_3 + 1] + ' : '+ parseInt(data[s_i]['numbers'][s_3]));
};

}


});



function setDisabledIndex(s, valsearch)
{
// Loop through all the items in drop down list
for (i = 0; i< s.options.length; i++)
{ 
if (s.options[i].value == valsearch)
{
// Item is found. Set its property and exit
s.options[i].disabled = true;
//s.options[i].style.color = 'red';

break;
}
}
return;
}

function setSelectedIndex(s, valsearch)
{
// Loop through all the items in drop down list
for (i = 0; i< s.options.length; i++)
{ 
if (s.options[i].value == valsearch)
{
// Item is found. Set its property and exit
s.options[i].selected = true;

break;
}
}
return;
}


d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};