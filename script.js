fetch('RDC.csv')
    .then(response => response.text())
    .then(csvData => {
        const closingDates = parseCSV(csvData, 'closingdate');
        const latestDate = getLatestDate(closingDates);
        const daysSince = daysSinceLastDate(latestDate);
        renderDaysSince(daysSince);
    })
    .catch(error => console.error('Error fetching the CSV file:', error));

function parseCSV(csvData, columnName) {
    const rows = csvData.split('\n');
    const headers = rows[0].split(',');
    const columnIndex = headers.indexOf(columnName);
    if (columnIndex === -1) return [];

    return rows.slice(1).map(row => {
        const cells = row.split(',');
        return cells[columnIndex];
    }).filter(value => value); // Filter out empty values
}

function getLatestDate(dates) {
    return dates.sort((a, b) => new Date(b) - new Date(a))[0];
}

function daysSinceLastDate(latestDate) {
    const today = new Date();
    const lastDate = new Date(latestDate);
    const diffTime = Math.abs(today - lastDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function renderDaysSince(daysSince) {
    const daysElement = document.getElementById('days');
    daysElement.innerHTML = daysSince;
    updateArc(daysSince);
}

const width = 300;
const height = 300;
const radius = Math.min(width, height) / 2;
const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

const arc = d3.arc()
    .innerRadius(radius - 50)
    .outerRadius(radius - 20)
    .startAngle(0);

const background = svg.append("path")
    .datum({ endAngle: 2 * Math.PI })
    .style("fill", "#ddd")
    .attr("d", arc);

const foreground = svg.append("path")
    .datum({ endAngle: 0 })
    .attr("class", "arc")
    .attr("d", arc);

function updateArc(days) {
    console.log('Updated arc to display', days, 'days');
    const endAngle = (days / 365) * 2 * Math.PI;
    foreground.datum({ endAngle: endAngle }).attr("d", arc);
}

function autoRefresh() {
    const now = new Date();
    const nextRefresh = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const timeUntilNextRefresh = nextRefresh - now;

    setTimeout(() => {
        location.reload();
    }, timeUntilNextRefresh);
}

autoRefresh();