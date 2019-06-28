d3.csv("player_list.csv", function(error, data) {
    if (error) throw error;

    console.log(data);
    var select = d3.select("#player").append("select");
    select.selectAll("option")
      .data(data)
      .enter()
      .append("option")
      .attr("value", function (d) {
        return d.full_name;
      })
      .text(function (d) { return d.full_name; });
});

d3.csv("seasons.csv", function(error, data) {
    if (error) throw error;

    console.log(data);
    var select = d3.select("#season").append("select");
    select.selectAll("option")
      .data(data)
      .enter()
      .append("option")
      .attr("value", function (d) {
        return d.Season;
      })
      .text(function (d) { return d.Season; });
});

var button = d3.select("#shotPlot")



function handleClick() {
  console.log("A button was clicked");
  var playerField = d3.select("#player").select("select");
  var selectedPlayer = playerField.property("value");
  console.log(`${selectedPlayer} was selected`); // Everytime button is clicked, log in console
  // console.log(playerField);
  // Add event listener
  // console.log(d3.event.target); // Logs object of ID
  var seasonField = d3.select("#season").select("select");
  var selectedSeason = seasonField.property("value");
  console.log(`${selectedSeason} was selected`);
}

// Attach event to handler function
button.on("click", handleClick); // Call on function when event "click" occurs on <button>