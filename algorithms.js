function runFCFS() {
    parseProcesses();
    processes.sort((a, b) => a.arrival - b.arrival);
    timeline = [];
    let currentTime = 0;

    processes.forEach(proc => {
        proc.start = Math.max(currentTime, proc.arrival);
        proc.end = proc.start + proc.burst;
        proc.waiting = proc.start - proc.arrival;
        proc.turnaround = proc.end - proc.arrival;
        proc.completion = proc.end;
        currentTime = proc.end;
        timeline.push({ process: proc.pid, start: proc.start, end: proc.end });
    });

    updateTable();
    calculateAverages();
    drawGanttChart();
}

function runSJF() {
    parseProcesses();
    processes.sort((a, b) => a.arrival - b.arrival);
    timeline = [];
    let currentTime = 0;

    let availableProcesses = [];

    processes.forEach(proc => {
        availableProcesses.push({ ...proc });
    });

    availableProcesses.sort((a, b) => a.burst - b.burst);

    availableProcesses.forEach(proc => {
        proc.start = Math.max(currentTime, proc.arrival);
        proc.end = proc.start + proc.burst;
        proc.waiting = proc.start - proc.arrival;
        proc.turnaround = proc.end - proc.arrival;
        proc.completion = proc.end;
        currentTime = proc.end;
        timeline.push({ process: proc.pid, start: proc.start, end: proc.end });
    });

    updateTable();
    calculateAverages();
    drawGanttChart();
}

function runPriority() {
    parseProcesses();
    processes.sort((a, b) => a.arrival - b.arrival);
    timeline = [];
    let currentTime = 0;

    let availableProcesses = [];

    processes.forEach(proc => {
        availableProcesses.push({ ...proc });
    });

    availableProcesses.sort((a, b) => a.priority - b.priority);

    availableProcesses.forEach(proc => {
        proc.start = Math.max(currentTime, proc.arrival);
        proc.end = proc.start + proc.burst;
        proc.waiting = proc.start - proc.arrival;
        proc.turnaround = proc.end - proc.arrival;
        proc.completion = proc.end;
        currentTime = proc.end;
        timeline.push({ process: proc.pid, start: proc.start, end: proc.end });
    });

    updateTable();
    calculateAverages();
    drawGanttChart();
}

function runRoundRobin() {
    parseProcesses();
    const timeQuantum = parseInt(document.getElementById('timeQuantum').value);
    timeline = [];
    let currentTime = 0;
    let queue = [...processes];
    let completed = [];

    processes.forEach(proc => {
        proc.remaining = proc.burst;
    });

    while (completed.length < processes.length) {
        for (let i = 0; i < queue.length; i++) {
            let proc = queue[i];
            if (proc.remaining > 0) {
                let executeTime = Math.min(timeQuantum, proc.remaining);

                let start = currentTime;
                currentTime += executeTime;
                let end = currentTime;

                timeline.push({ process: proc.pid, start: start, end: end });
                proc.remaining -= executeTime;

                if (proc.remaining === 0) {
                    proc.completion = currentTime;
                    proc.turnaround = proc.completion - proc.arrival;
                    proc.waiting = proc.turnaround - proc.burst;
                    completed.push(proc);
                }
            }
        }
    }

    updateTable();
    calculateAverages();
    drawGanttChart();
}
