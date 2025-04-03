class Process {
    constructor(pid, arrival, burst, priority) {
        this.pid = pid;
        this.arrival = parseInt(arrival);
        this.burst = parseInt(burst);
        this.priority = parseInt(priority);
        this.remaining = parseInt(burst);
        this.waiting = 0;
        this.turnaround = 0;
        this.completion = 0;
        this.start = 0;
        this.end = 0;
    }
}

let processes = [];
let timeline = [];

function addProcessRow() {
    const processInputs = document.getElementById('processInputs');
    const newRow = document.createElement('div');
    newRow.className = 'process-row';
    const pid = processInputs.children.length + 1;
    const rowId = pid;

    newRow.innerHTML = `
         <div class="process-input-wrapper">
            <label for="pid${rowId}" class="process-label">PID:</label>
            <input type="number" class="process-input" id="pid${rowId}" placeholder="PID" value="${pid}" readonly>
        </div>

        <div class="process-input-wrapper">
            <label for="arrival${rowId}" class="process-label">Arrival:</label>
            <input type="number" class="process-input" id="arrival${rowId}" placeholder="Arrival" value="0" min="0">
        </div>

        <div class="process-input-wrapper">
            <label for="burst${rowId}" class="process-label">Burst:</label>
            <input type="number" class="process-input" id="burst${rowId}" placeholder="Burst" value="5" min="0">
        </div>

        <div class="process-input-wrapper">
            <label for="priority${rowId}" class="process-label">Priority:</label>
            <input type="number" class="process-input" id="priority${rowId}" placeholder="Priority" value="0" min="0">
        </div>
    `;
    processInputs.appendChild(newRow);
}

function removeProcessRow() {
    const processInputs = document.getElementById('processInputs');
    const processRows = processInputs.children;

    if (processRows.length > 1) {
        processInputs.removeChild(processRows[processRows.length - 1]);
        renumberProcessRows();
    }
}

function renumberProcessRows() {
    const processRows = document.querySelectorAll('#processInputs .process-row');
    processRows.forEach((row, index) => {
        const newRowId = index + 1;
        row.innerHTML = `
             <div class="process-input-wrapper">
                <label for="pid${newRowId}" class="process-label">PID:</label>
                <input type="number" class="process-input" id="pid${newRowId}" placeholder="PID" value="${newRowId}" readonly>
             </div>

             <div class="process-input-wrapper">
                <label for="arrival${newRowId}" class="process-label">Arrival:</label>
                <input type="number" class="process-input" id="arrival${newRowId}" placeholder="Arrival" value="0" min="0">
             </div>

             <div class="process-input-wrapper">
                <label for="burst${newRowId}" class="process-label">Burst:</label>
                <input type="number" class="process-input" id="burst${newRowId}" placeholder="Burst" value="5" min="0">
             </div>

             <div class="process-input-wrapper">
                <label for="priority${newRowId}" class="process-label">Priority:</label>
                <input type="number" class="process-input" id="priority${newRowId}" placeholder="Priority" value="0" min="0">
             </div>
        `;
    });
}

function parseProcesses() {
    processes = [];
    const processRows = document.querySelectorAll('#processInputs .process-row');
    processRows.forEach(row => {
        const pid = row.querySelector('[placeholder="PID"]').value;
        const arrival = row.querySelector('[placeholder="Arrival"]').value;
        const burst = row.querySelector('[placeholder="Burst"]').value;
        const priority = row.querySelector('[placeholder="Priority"]').value;

        processes.push(new Process(pid, arrival, burst, priority));
    });
}

function calculateAverages() {
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    let totalCompletionTime = 0;

    processes.forEach(proc => {
        totalWaitingTime += proc.waiting;
        totalTurnaroundTime += proc.turnaround;
        totalCompletionTime += proc.completion;
    });

    const avgWaitingTime = totalWaitingTime / processes.length || 0;
    const avgTurnaroundTime = totalTurnaroundTime / processes.length || 0;
    const avgCompletionTime = totalCompletionTime / processes.length || 0;

    document.getElementById('avgWaitingTime').textContent = avgWaitingTime.toFixed(2);
    document.getElementById('avgTurnaroundTime').textContent = avgTurnaroundTime.toFixed(2);
    document.getElementById('avgCompletionTime').textContent = avgCompletionTime.toFixed(2);
}

function showRoundRobinSettings() {
    var roundRobinSettings = document.getElementById('roundRobinSettings');
    roundRobinSettings.style.display = 'block';
}

function resetSimulation() {
    processes = [];
    timeline = [];
    document.getElementById('avgWaitingTime').textContent = '0';
    document.getElementById('avgTurnaroundTime').textContent = '0';
    document.getElementById('avgCompletionTime').textContent = '0';
    document.getElementById('metricsTable').getElementsByTagName('tbody')[0].innerHTML = '';

    const ganttChartCanvas = document.getElementById('ganttChart');
    const ctx = ganttChartCanvas.getContext('2d');
    ctx.clearRect(0, 0, ganttChartCanvas.width, ganttChartCanvas.height);
}

function updateTable() {
    const tableBody = document.querySelector('#metricsTable tbody');
    tableBody.innerHTML = '';

    processes.forEach(proc => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = proc.pid;
        row.insertCell(1).textContent = proc.burst;
        row.insertCell(2).textContent = proc.priority;
        row.insertCell(3).textContent = proc.arrival;
        row.insertCell(4).textContent = proc.waiting;
        row.insertCell(5).textContent = proc.turnaround;
        row.insertCell(6).textContent = proc.completion;
        row.insertCell(7).textContent = proc.start;
        row.insertCell(8).textContent = proc.end;
    });
}

function drawGanttChart() {
    const canvas = document.getElementById('ganttChart');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (timeline.length === 0) {
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText('No processes scheduled', canvas.width / 2, canvas.height / 2);
        return;
    }

    const chartWidth = canvas.width;
    const chartHeight = canvas.height;
    const minTime = Math.min(...timeline.map(event => event.start));
    const maxTime = Math.max(...timeline.map(event => event.end));
    const totalTime = maxTime - minTime;

    const blockHeight = 30;
    const startY = 50;

    const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

    // Calculate padding for the start and end of the chart
    const padding = chartWidth * 0.05; // 5% padding on each side
    const availableWidth = chartWidth - 2 * padding;

    // Draw the timeline scale
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    const scaleInterval = totalTime / 4; // Divide the timeline into 5 parts
    for (let i = 0; i <= 4; i++) {
        const time = minTime + i * scaleInterval;
        const x = padding + (i * availableWidth) / 4; // Apply padding to the x coordinate
        ctx.fillText(time.toFixed(0), x, startY - 20); // Position the scale labels above the chart
    }

    timeline.forEach((event, index) => {
        const blockWidth = (event.end - event.start) / totalTime * availableWidth; // Use availableWidth instead of chartWidth
        const startX = padding + (event.start - minTime) / totalTime * availableWidth; // Apply padding to the x coordinate
        const colorIndex = index % colors.length;

        ctx.fillStyle = colors[colorIndex];
        ctx.fillRect(startX, startY, blockWidth, blockHeight);

        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';

        // Check if the block is wide enough to display the process ID
        if (blockWidth > 20) {
            ctx.fillText(
                `P${event.process}`,
                startX + blockWidth / 2,
                startY + blockHeight / 2 + 5
            );
        }
    });
}
