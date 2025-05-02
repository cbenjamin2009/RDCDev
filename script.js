fetch('RDC.csv')
    .then(response => response.text())
    .then(csvData => {
        const closingDates = parseCSV(csvData, 'closingdate');
        const mutualDates = parseCSV(csvData, 'mutualdate');
        const latestDate = getLatestDate(closingDates);
        const latestMutualDate = getLatestDate(mutualDates);
        const daysSinceLastClose = daysSinceLastDate(latestDate);
        const daysSinceMutual = daysSinceLastDate(latestMutualDate)
        renderDaysSince(daysSinceLastClose, daysSinceMutual);
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

function renderDaysSince(daysSinceLastClose, daysSinceMutual) {
    const daysLastCloseElement = document.getElementById('lastclose');
    const daysMutualElement = document.getElementById('lastmutual');
    daysLastCloseElement.innerHTML = daysSinceLastClose;
    daysMutualElement.innerHTML = daysSinceMutual;

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