Intelligent CPU Scheduling Simulator
Overview
The Intelligent CPU Scheduling Simulator is a dynamic and interactive web application designed to demonstrate various CPU scheduling algorithms. It visualizes the scheduling process, calculates important metrics, and provides a Gantt chart for better understanding.
Features
•	Supported Scheduling Algorithms:
o	First Come First Serve (FCFS)
o	Shortest Job First (SJF)
o	Priority Scheduling
o	Round Robin (with configurable time quantum)
•	Dynamic Process Management:
o	Add, update, and delete processes dynamically.
o	Priority-based input visibility toggling.
•	Visualization:
o	Gantt chart to display process execution order.
o	Legend for color-coded process mapping.
•	Metrics:
o	Average Waiting Time
o	Average Turnaround Time
o	CPU Utilization
•	Responsive and Interactive UI:
o	Editable process inputs.
o	Animations for process execution.
Technologies Used
•	Frontend: HTML, CSS, JavaScript
•	Styling Framework: Custom CSS with flexbox and grid-based layout.
File Structure
project-directory/
├── index.html       # Main HTML file for the simulator
├── styles.css       # CSS file for styling the simulator
├── script.js        # JavaScript file containing the logic
└── README.md        # Documentation for the project
How to Use
1.	Open index.html in any modern web browser.
2.	Add processes by entering the following details:
o	Process Name
o	Arrival Time
o	Burst Time
o	Priority (only for Priority Scheduling)
3.	Choose a scheduling algorithm from the dropdown.
4.	For Round Robin, enter the desired time quantum.
5.	Click on "Simulate" to visualize the process execution.
6.	View results in the "Results" section and observe the Gantt chart.
Code Breakdown
HTML
Defines the structure of the simulator, including:
•	Input forms for adding processes.
•	Dropdown for algorithm selection.
•	Sections for displaying results, metrics, and Gantt chart.
CSS
Custom styling to ensure:
•	Responsive layout.
•	Distinct visual elements such as buttons, tables, and charts.
•	Color coding for processes.
JavaScript
Handles:
•	Process management (add, update, delete).
•	Implementation of CPU scheduling algorithms.
•	Rendering of tables, results, and Gantt chart.
•	Dynamic animations and interactivity.
Scheduling Algorithms
First Come First Serve (FCFS)
Processes are scheduled in the order of their arrival times. Metrics like waiting time and turnaround time are calculated based on execution order.
Shortest Job First (SJF)
Processes are scheduled based on their burst time. Shorter jobs are prioritized, leading to potential improvement in average waiting time.
Priority Scheduling
Processes are scheduled based on their priority. Lower numerical values indicate higher priority.
Round Robin
Processes are scheduled in a cyclic manner, with each process receiving a time slice (quantum). This ensures fairness and avoids starvation.
Metrics Explained
•	Average Waiting Time: The average time a process waits in the ready queue.
•	Average Turnaround Time: The average time taken from process arrival to its completion.
•	CPU Utilization: Percentage of time the CPU is actively executing processes.
Gantt Chart
The Gantt chart visually represents process execution over time. Each bar corresponds to a process, with width proportional to its execution time.
Example Usage
1.	Add three processes:
o	Process A: Arrival Time = 0, Burst Time = 5
o	Process B: Arrival Time = 2, Burst Time = 3
o	Process C: Arrival Time = 4, Burst Time = 1
2.	Choose FCFS as the scheduling algorithm.
3.	Click "Simulate" to see the results and Gantt chart.
Future Enhancements
•	Add support for preemptive algorithms like Preemptive Priority and Shortest Remaining Time First (SRTF).
•	Enable process data export and import.
•	Improve UI responsiveness for smaller devices.
License
This project is open-source and available under the MIT License.
