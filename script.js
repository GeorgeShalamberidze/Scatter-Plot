// Global Variables
const canvasWidth = 960;
const canvasHeight = 540;
const timeArray = []
const yearArray = []
var parseTime = d3.timeFormat('%M:%S')
const tooltip = d3.select('.scatter-container')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0)

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json').then(data => {
    data.forEach(data => {
        timeArray.push(data.Time)
        yearArray.push(data.Year)

        var parsedTime = data.Time.split(':');
        data.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
    })

    const minYear = (d3.min(yearArray) - 1).toString()
    const maxYear = (d3.max(yearArray) + 1).toString()

    const xScale = d3.scaleTime()
        .domain([minYear, maxYear])
        .range([70, canvasWidth - 20])

    const yScale = d3.scaleTime()
        .domain(d3.extent(data, function (d) {
            return d.Time
        }))
        .range([20, canvasHeight + 5])

    // X - Y Axeseseses
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'))
    const yAxis = d3.axisLeft(yScale).tickFormat(parseTime)

    // Creating SVG
    const svg = d3.select('.scatter-container')
        .append('svg')
        .attr('width', canvasWidth + 80)
        .attr('height', canvasHeight + 50)

    // Calling X - Y Axes
    svg.append('g')
        .call(xAxis)
        .attr('transform', `translate(${20}, ${canvasHeight})`)
        .attr('id', 'x-axis')

    svg.append('g')
        .call(yAxis)
        .attr('transform', `translate(${90}, ${-5})`)
        .attr('id', 'y-axis')


    // Adding Circles
    svg.append('g')
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'circ')
        .attr('cx', (d) => xScale(d.Year))
        .attr('cy', (d) => yScale(d.Time))
        .attr('r', 10)
        .attr('class', 'dot')
        .attr('data-xvalue', (d) => d.Year)
        .attr('data-yvalue', (d) => d.Time)
        .attr('fill', (d) => {
            if (d.Doping === '') {
                return '#66ffcc'
            }
            else {
                return '#ff8080'
            }
        })
        .style('opacity', 0.6)
        .on('mouseover', (d, i) => {
            tooltip
                .style('left', `${d3.pointer(d)[0] + 20}px`)
                .style('top', `${d3.pointer(d)[1]}px`)
                .style('opacity', 0.86)
                .transition()
                .duration(200)
                .attr('data-year', d => i.Year)
            tooltip.html(
                (i.Doping === "" ? 'No Doping Case' : i.Doping)
                + "<br><br>" + i.Name + ' - ' +  i.Nationality + '<br>' + "Year: " + i.Year + "<br>" + "Date: " + i.Time.toString().substring(4, 10) + "<br>" + 'Place № : ' + i.Place + '<br>' + "Time: " + i.Time.toString().substring(19, 24)
            )
                onmouseover = function(e){
                    tooltip.style('left', `${e.clientX + 30}px`)
                    .style('top', `${d3.pointer(d)[1] - 60}px`)
                }

        })
        .on('mouseout', d => {
            tooltip
                .transition()
                .duration(200)
                .style('opacity', 0)
        })

    d3.selectAll('.tick text')
        .attr('font-size', 20)

    // LEGEND
    svg.append('g')
        .attr('id', 'legend')
        .append('text')
        .text('Riders With Doping')
        .attr('x', canvasWidth - 100)
        .attr('y', canvasHeight - 250)
        .attr('fill', '#fff')

    d3.select('#legend')
        .append('text')
        .text('Riders Without Doping')
        .attr('x', canvasWidth - 123)
        .attr('y', canvasHeight - 220)
        .attr('fill', '#fff')

    d3.select('#legend')
        .append('rect')
        .attr('x', canvasWidth + 40)
        .attr('y', (canvasHeight / 2) + 4)
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', '#ff8080')

    d3.select('#legend')
        .append('rect')
        .attr('x', canvasWidth + 40)
        .attr('y', (canvasHeight / 2) + 34)
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', '#66ffcc')


        d3.selectAll('.dot')
        .attr('transform', `translate(${20}, 0)`)
})
