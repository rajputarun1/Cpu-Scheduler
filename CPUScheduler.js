document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const themeToggle = document.getElementById("theme-toggle")
    const sunIcon = document.getElementById("sun-icon")
    const moonIcon = document.getElementById("moon-icon")
    const tabButtons = document.querySelectorAll(".tab-btn")
    const priorityHeader = document.getElementById("priority-header")
    const timeQuantumContainer = document.getElementById("time-quantum-container")
    const timeQuantumInput = document.getElementById("time-quantum")
    const addProcessBtn = document.getElementById("add-process")
    const runSimulationBtn = document.getElementById("run-simulation")
    const processTbody = document.getElementById("process-tbody")
    const simulationResults = document.getElementById("simulation-results")
    const resultsTbody = document.getElementById("results-tbody")
    const avgWaitingTime = document.getElementById("avg-waiting-time")
    const avgTurnaroundTime = document.getElementById("avg-turnaround-time")
    const cpuUtilization = document.getElementById("cpu-utilization")
    const ganttChart = document.getElementById("gantt-chart")
    const ganttLegend = document.getElementById("gantt-legend")
    const resetVizBtn = document.getElementById("reset-viz")
    const stepVizBtn = document.getElementById("step-viz")
    const playVizBtn = document.getElementById("play-viz")
    const playIcon = document.getElementById("play-icon")
    const pauseIcon = document.getElementById("pause-icon")
    const speedSlider = document.getElementById("speed-slider")
  
    // State
    let currentAlgorithm = "fcfs"
    let processes = [
      { id: 1, name: "P1", arrivalTime: 0, burstTime: 5, priority: 2, color: getRandomColor() },
      { id: 2, name: "P2", arrivalTime: 1, burstTime: 3, priority: 1, color: getRandomColor() },
      { id: 3, name: "P3", arrivalTime: 2, burstTime: 8, priority: 4, color: getRandomColor() },
      { id: 4, name: "P4", arrivalTime: 3, burstTime: 2, priority: 3, color: getRandomColor() },
    ]
    let simulationResult = null
    const animationState = {
      isPlaying: false,
      currentStep: 0,
      interval: null,
      speed: 5,
    }
  
    // Initialize
    renderProcessTable()
    updateUIForAlgorithm()
  
    // Theme Toggle
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark")
      updateThemeIcons()
    })
  
    function updateThemeIcons() {
      const isDark = document.body.classList.contains("dark")
      sunIcon.classList.toggle("hidden", isDark)
      moonIcon.classList.toggle("hidden", !isDark)
    }
  
    // Initialize theme icons
    updateThemeIcons()
  
    // Tab Buttons
    tabButtons.forEach((button) => {
      button.addEventListener("click", function () {
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        this.classList.add("active")
        currentAlgorithm = this.dataset.algorithm
        updateUIForAlgorithm()
      })
    })
  
    function updateUIForAlgorithm() {
      // Show/hide priority column based on algorithm
      priorityHeader.classList.toggle("hidden", currentAlgorithm !== "priority")
      processTbody.querySelectorAll(".priority-cell").forEach((cell) => {
        cell.classList.toggle("hidden", currentAlgorithm !== "priority")
      })
  
      // Show/hide time quantum input for Round Robin
      timeQuantumContainer.classList.toggle("hidden", currentAlgorithm !== "rr")
    }
  
    // Add Process Button
    addProcessBtn.addEventListener("click", () => {
      const newId = processes.length > 0 ? Math.max(...processes.map((p) => p.id)) + 1 : 1
      const newProcess = {
        id: newId,
        name: `P${newId}`,
        arrivalTime: 0,
        burstTime: 5,
        priority: 1,
        color: getRandomColor(),
      }
      processes.push(newProcess)
      renderProcessTable()
    })
  
    // Run Simulation Button
    runSimulationBtn.addEventListener("click", () => {
      if (processes.length === 0) {
        alert("Please add at least one process")
        return
      }
  
      // Reset animation state
      resetAnimationState()
  
      // Run the appropriate algorithm
      const timeQuantum = Number.parseInt(timeQuantumInput.value) || 2
      switch (currentAlgorithm) {
        case "fcfs":
          simulationResult = calculateFCFS([...processes])
          break
        case "sjf":
          simulationResult = calculateSJF([...processes])
          break
        case "priority":
          simulationResult = calculatePriority([...processes])
          break
        case "rr":
          simulationResult = calculateRoundRobin([...processes], timeQuantum)
          break
      }
  
      // Show results
      renderResults()
      simulationResults.classList.remove("hidden")
    })
  
    // Visualization Controls
    resetVizBtn.addEventListener("click", () => {
      resetAnimationState()
      renderGanttChart()
    })
  
    stepVizBtn.addEventListener("click", () => {
      if (animationState.currentStep < simulationResult.processOrder.length) {
        stopAnimation()
        animationState.currentStep++
        renderGanttChart()
      }
    })
    // Are you actually reading this? If you are, you're awesome! 🚀
    // Look around and you might find something interesting.
    // The message is in the format flag{my message}
    playVizBtn.addEventListener("click", () => {
      if (animationState.isPlaying) {
        stopAnimation()
      } else {
        startAnimation()
      }
      updatePlayPauseIcons()
    })
  
    speedSlider.addEventListener("input", function () {
      animationState.speed = Number.parseInt(this.value)
      if (animationState.isPlaying) {
        stopAnimation()
        startAnimation()
      }
    })
  
    function startAnimation() {
      if (animationState.currentStep >= simulationResult.processOrder.length) {
        animationState.currentStep = 0
      }
  
      animationState.isPlaying = true
      const speed = 1100 - animationState.speed * 100 // Convert 1-10 to 1000-100ms
  
      animationState.interval = setInterval(() => {
        animationState.currentStep++
        renderGanttChart()
  
        if (animationState.currentStep >= simulationResult.processOrder.length) {
          stopAnimation()
        }
      }, speed)
    }
  
    function stopAnimation() {
      clearInterval(animationState.interval)
      animationState.isPlaying = false
      updatePlayPauseIcons()
    }
  
    function resetAnimationState() {
      stopAnimation()
      animationState.currentStep = 0
    }
  
    function updatePlayPauseIcons() {
      playIcon.classList.toggle("hidden", animationState.isPlaying)
      pauseIcon.classList.toggle("hidden", !animationState.isPlaying)
    }
  
    // Process Table Rendering
    function renderProcessTable() {
      processTbody.innerHTML = ""
  
      processes.forEach((process) => {
        const row = document.createElement("tr")
  
        // Process Name
        const nameCell = document.createElement("td")
        const nameInput = document.createElement("input")
        nameInput.type = "text"
        nameInput.value = process.name
        nameInput.addEventListener("change", function () {
          process.name = this.value
        })
        nameCell.appendChild(nameInput)
  
        // Arrival Time
        const arrivalCell = document.createElement("td")
        const arrivalInput = document.createElement("input")
        arrivalInput.type = "number"
        arrivalInput.min = "0"
        arrivalInput.value = process.arrivalTime
        arrivalInput.addEventListener("change", function () {
          process.arrivalTime = Number.parseInt(this.value) || 0
        })
        arrivalCell.appendChild(arrivalInput)
  
        // Burst Time
        const burstCell = document.createElement("td")
        const burstInput = document.createElement("input")
        burstInput.type = "number"
        burstInput.min = "1"
        burstInput.value = process.burstTime
        burstInput.addEventListener("change", function () {
          process.burstTime = Number.parseInt(this.value) || 1
        })
        burstCell.appendChild(burstInput)
  
        // Priority
        const priorityCell = document.createElement("td")
        priorityCell.classList.add("priority-cell")
        if (currentAlgorithm !== "priority") {
          priorityCell.classList.add("hidden")
        }
        const priorityInput = document.createElement("input")
        priorityInput.type = "number"
        priorityInput.min = "1"
        priorityInput.value = process.priority
        priorityInput.addEventListener("change", function () {
          process.priority = Number.parseInt(this.value) || 1
        })
        priorityCell.appendChild(priorityInput)
  
        // Delete Button
        const actionCell = document.createElement("td")
        const deleteBtn = document.createElement("button")
        deleteBtn.classList.add("delete-btn")
        deleteBtn.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>'
        deleteBtn.addEventListener("click", () => {
          processes = processes.filter((p) => p.id !== process.id)
          renderProcessTable()
        })
        actionCell.appendChild(deleteBtn)
  
        // Append all cells to row
        row.appendChild(nameCell)
        row.appendChild(arrivalCell)
        row.appendChild(burstCell)
        row.appendChild(priorityCell)
        row.appendChild(actionCell)
  
        processTbody.appendChild(row)
      })
    }
  
    // Results Rendering
    function renderResults() {
      // Render results table
      resultsTbody.innerHTML = ""
  
      processes.forEach((process) => {
        const row = document.createElement("tr")
  
        // Find completion time (end time of last execution)
        const processExecutions = simulationResult.processOrder.filter((p) => p.processId === process.id)
        const completionTime = processExecutions.length > 0 ? Math.max(...processExecutions.map((p) => p.endTime)) : 0
  
        const turnaroundTime = simulationResult.turnaroundTime[process.id] || 0
        const waitingTime = simulationResult.waitingTime[process.id] || 0
  
        // Create cells
        const cells = [
          process.name,
          process.arrivalTime,
          process.burstTime,
          completionTime,
          turnaroundTime,
          waitingTime,
        ].map((value) => {
          const cell = document.createElement("td")
          cell.textContent = value
          return cell
        })
  
        cells.forEach((cell) => row.appendChild(cell))
        resultsTbody.appendChild(row)
      })
  
      // Update metrics
      avgWaitingTime.textContent = simulationResult.averageWaitingTime.toFixed(2)
      avgTurnaroundTime.textContent = simulationResult.averageTurnaroundTime.toFixed(2)
  
      // Calculate CPU utilization
      const totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0)
      const lastCompletionTime = Math.max(...simulationResult.processOrder.map((p) => p.endTime))
      const utilization = (totalBurstTime / lastCompletionTime) * 100
      cpuUtilization.textContent = utilization.toFixed(2) + "%"
  
      // Render Gantt chart
      renderGanttChart()
      renderGanttLegend()
    }
  
    function renderGanttChart() {
      if (!simulationResult) return
  
      ganttChart.innerHTML = ""
  
      // Calculate total width
      const maxTime = Math.max(...simulationResult.processOrder.map((p) => p.endTime))
      const timeUnitWidth = 50 // pixels per time unit
      ganttChart.style.width = `${maxTime * timeUnitWidth + 50}px`
  
      // Add time markers
      for (let i = 0; i <= maxTime; i++) {
        const marker = document.createElement("div")
        marker.classList.add("time-marker")
        marker.textContent = i
        marker.style.left = `${i * timeUnitWidth}px`
        marker.style.bottom = "0"
        ganttChart.appendChild(marker)
  
        const line = document.createElement("div")
        line.classList.add("time-line")
        line.style.left = `${i * timeUnitWidth}px`
        line.style.height = "100%"
        line.style.top = "0"
        ganttChart.appendChild(line)
      }
  
      // Add process bars (only up to current step in animation)
      const visibleProcesses = simulationResult.processOrder.slice(0, animationState.currentStep)
  
      visibleProcesses.forEach((execution) => {
        const process = processes.find((p) => p.id === execution.processId)
        if (!process) return
  
        const bar = document.createElement("div")
        bar.classList.add("process-bar")
        bar.style.backgroundColor = process.color
        bar.style.left = `${execution.startTime * timeUnitWidth}px`
        bar.style.width = `${(execution.endTime - execution.startTime) * timeUnitWidth}px`
        bar.style.top = "40px"
        bar.textContent = process.name
        bar.style.opacity = "1"
        ganttChart.appendChild(bar)
      })
    }
  
    function renderGanttLegend() {
      ganttLegend.innerHTML = ""
  
      processes.forEach((process) => {
        const legendItem = document.createElement("div")
        legendItem.classList.add("legend-item")
  
        const colorBox = document.createElement("div")
        colorBox.classList.add("legend-color")
        colorBox.style.backgroundColor = process.color
  
        const label = document.createElement("span")
        label.textContent = process.name
  
        legendItem.appendChild(colorBox)
        legendItem.appendChild(label)
        ganttLegend.appendChild(legendItem)
      })
    }
  
    // Scheduling Algorithms
    function calculateFCFS(processes) {
      // Sort processes by arrival time
      const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime)
  
      const processOrder = []
      const waitingTime = {}
      const turnaroundTime = {}
  
      let currentTime = 0
  
      sortedProcesses.forEach((process) => {
        // If there's a gap between processes, move current time forward
        if (process.arrivalTime > currentTime) {
          currentTime = process.arrivalTime
        }
  
        const startTime = currentTime
        const endTime = startTime + process.burstTime
  
        processOrder.push({
          processId: process.id,
          startTime,
          endTime,
        })
  
        // Calculate waiting and turnaround times
        turnaroundTime[process.id] = endTime - process.arrivalTime
        waitingTime[process.id] = turnaroundTime[process.id] - process.burstTime
  
        // Move time forward
        currentTime = endTime
      })
  
      // Calculate averages
      const avgWaitingTime = Object.values(waitingTime).reduce((sum, time) => sum + time, 0) / processes.length
      const avgTurnaroundTime = Object.values(turnaroundTime).reduce((sum, time) => sum + time, 0) / processes.length
  
      return {
        processOrder,
        waitingTime,
        turnaroundTime,
        averageWaitingTime: avgWaitingTime,
        averageTurnaroundTime: avgTurnaroundTime,
      }
    }
  
    function calculateSJF(processes) {
      const processOrder = []
      const waitingTime = {}
      const turnaroundTime = {}
  
      // Create a copy of processes to work with
      const remainingProcesses = [...processes]
      let currentTime = 0
  
      while (remainingProcesses.length > 0) {
        // Find processes that have arrived by current time
        const availableProcesses = remainingProcesses.filter((p) => p.arrivalTime <= currentTime)
  
        if (availableProcesses.length === 0) {
          // No processes available, move time to next arrival
          const nextArrival = Math.min(...remainingProcesses.map((p) => p.arrivalTime))
          currentTime = nextArrival
          continue
        }
  
        // Find the process with shortest burst time
        const shortestJob = availableProcesses.reduce((prev, curr) => (prev.burstTime < curr.burstTime ? prev : curr))
  
        // Remove the process from remaining
        const index = remainingProcesses.findIndex((p) => p.id === shortestJob.id)
        remainingProcesses.splice(index, 1)
  
        // Calculate times
        const startTime = currentTime
        const endTime = startTime + shortestJob.burstTime
  
        processOrder.push({
          processId: shortestJob.id,
          startTime,
          endTime,
        })
  
        turnaroundTime[shortestJob.id] = endTime - shortestJob.arrivalTime
        waitingTime[shortestJob.id] = turnaroundTime[shortestJob.id] - shortestJob.burstTime
  
        // Move time forward
        currentTime = endTime
      }
  
      // Calculate averages
      const avgWaitingTime = Object.values(waitingTime).reduce((sum, time) => sum + time, 0) / processes.length
      const avgTurnaroundTime = Object.values(turnaroundTime).reduce((sum, time) => sum + time, 0) / processes.length
  
      return {
        processOrder,
        waitingTime,
        turnaroundTime,
        averageWaitingTime: avgWaitingTime,
        averageTurnaroundTime: avgTurnaroundTime,
      }
    }
  
    function calculatePriority(processes) {
      const processOrder = []
      const waitingTime = {}
      const turnaroundTime = {}
  
      // Create a copy of processes to work with
      const remainingProcesses = [...processes]
      let currentTime = 0
  
      while (remainingProcesses.length > 0) {
        // Find processes that have arrived by current time
        const availableProcesses = remainingProcesses.filter((p) => p.arrivalTime <= currentTime)
  
        if (availableProcesses.length === 0) {
          // No processes available, move time to next arrival
          const nextArrival = Math.min(...remainingProcesses.map((p) => p.arrivalTime))
          currentTime = nextArrival
          continue
        }
  
        // Find the process with highest priority (lower number = higher priority)
        const highestPriorityProcess = availableProcesses.reduce((prev, curr) =>
          prev.priority < curr.priority ? prev : curr,
        )
  
        // Remove the process from remaining
        const index = remainingProcesses.findIndex((p) => p.id === highestPriorityProcess.id)
        remainingProcesses.splice(index, 1)
  
        // Calculate times
        const startTime = currentTime
        const endTime = startTime + highestPriorityProcess.burstTime
  
        processOrder.push({
          processId: highestPriorityProcess.id,
          startTime,
          endTime,
        })
  
        turnaroundTime[highestPriorityProcess.id] = endTime - highestPriorityProcess.arrivalTime
        waitingTime[highestPriorityProcess.id] =
          turnaroundTime[highestPriorityProcess.id] - highestPriorityProcess.burstTime
  
        // Move time forward
        currentTime = endTime
      }
  
      // Calculate averages
      const avgWaitingTime = Object.values(waitingTime).reduce((sum, time) => sum + time, 0) / processes.length
      const avgTurnaroundTime = Object.values(turnaroundTime).reduce((sum, time) => sum + time, 0) / processes.length
  
      return {
        processOrder,
        waitingTime,
        turnaroundTime,
        averageWaitingTime: avgWaitingTime,
        averageTurnaroundTime: avgTurnaroundTime,
      }
    }
  
    function calculateRoundRobin(processes, timeQuantum) {
      const processOrder = []
      const waitingTime = {}
      const turnaroundTime = {}
  
      // Create a copy of processes with remaining burst time
      const processQueue = processes.map((p) => ({
        id: p.id,
        arrivalTime: p.arrivalTime,
        remainingTime: p.burstTime,
        originalBurstTime: p.burstTime,
      }))
  
      // Sort by arrival time initially
      processQueue.sort((a, b) => a.arrivalTime - b.arrivalTime)
  
      let currentTime = 0
      const completionTime = {}
  
      // Continue until all processes are completed
      while (processQueue.some((p) => p.remainingTime > 0)) {
        let executed = false
  
        for (let i = 0; i < processQueue.length; i++) {
          const process = processQueue[i]
  
          // Skip if process hasn't arrived or is already completed
          if (process.arrivalTime > currentTime || process.remainingTime <= 0) {
            continue
          }
  
          executed = true
          const startTime = currentTime
  
          // Execute for time quantum or remaining time, whichever is smaller
          const executeTime = Math.min(timeQuantum, process.remainingTime)
          process.remainingTime -= executeTime
          currentTime += executeTime
  
          processOrder.push({
            processId: process.id,
            startTime,
            endTime: currentTime,
          })
  
          // If process is completed, record completion time
          if (process.remainingTime === 0) {
            completionTime[process.id] = currentTime
          }
        }
  
        // If no process was executed, move time to next arrival
        if (!executed) {
          const nextArrivalProcesses = processQueue.filter((p) => p.arrivalTime > currentTime && p.remainingTime > 0)
          if (nextArrivalProcesses.length > 0) {
            const nextArrival = Math.min(...nextArrivalProcesses.map((p) => p.arrivalTime))
            currentTime = nextArrival
          } else {
            break // No more processes to execute
          }
        }
      }
  
      // Calculate waiting and turnaround times
      processes.forEach((process) => {
        turnaroundTime[process.id] = completionTime[process.id] - process.arrivalTime
        waitingTime[process.id] = turnaroundTime[process.id] - process.burstTime
      })
  
      // Calculate averages
      const avgWaitingTime = Object.values(waitingTime).reduce((sum, time) => sum + time, 0) / processes.length
      const avgTurnaroundTime = Object.values(turnaroundTime).reduce((sum, time) => sum + time, 0) / processes.length
  
      return {
        processOrder,
        waitingTime,
        turnaroundTime,
        averageWaitingTime: avgWaitingTime,
        averageTurnaroundTime: avgTurnaroundTime,
      }
    }
  
    // Utility Functions
    function getRandomColor() {
      const colors = [
        "#3b82f6", // blue
        "#10b981", // green
        "#f59e0b", // yellow
        "#8b5cf6", // purple
        "#ec4899", // pink
        "#6366f1", // indigo
        "#ef4444", // red
        "#f97316", // orange
      ]
      return colors[Math.floor(Math.random() * colors.length)]
    }
  })
