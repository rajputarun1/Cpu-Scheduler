// CPUScheduler.java
import java.util.*;

public class CPUScheduler {

    private List<Process> processes;

    public CPUScheduler(List<Process> processes) {
        this.processes = processes;
    }

    public List<Process> runFCFS() {
        List<Process> scheduled = new ArrayList<>();
        int time = 0, totalWT = 0, totalTAT = 0;

        processes.sort(Comparator.comparingInt(Process::getArrivalTime));

        for (Process p : processes) {
            int startTime = Math.max(time, p.getArrivalTime());
            time = startTime + p.getBurstTime();
            p.setCompletionTime(time);
            p.setTurnaroundTime(time - p.getArrivalTime());
            p.setWaitingTime(p.getTurnaroundTime() - p.getBurstTime());

            totalWT += p.getWaitingTime();
            totalTAT += p.getTurnaroundTime();
            scheduled.add(p);
        }

        printMetrics(totalWT, totalTAT, processes.size());
        return scheduled;
    }

   public List<Process> runSJF() {
        List<Process> scheduled = new ArrayList<>();
        int time = 0, totalWT = 0, totalTAT = 0;

        PriorityQueue<Process> readyQueue = new PriorityQueue<>(Comparator.comparingInt(p -> p.getBurstTime()));
        List<Process> remainingProcesses = new ArrayList<>(processes);

        while (!remainingProcesses.isEmpty() || !readyQueue.isEmpty()) {
            // Add processes that have arrived to the ready queue
            Iterator<Process> iterator = remainingProcesses.iterator();
            while (iterator.hasNext()) {
                Process p = iterator.next();
                if (p.getArrivalTime() <= time) {
                    readyQueue.add(p);
                    iterator.remove();
                }
            }

            // If the ready queue is empty, advance time
            if (readyQueue.isEmpty() && !remainingProcesses.isEmpty()) {
                time++;
            } else if (!readyQueue.isEmpty()) {
                // Get the process with the shortest burst time
                Process current = readyQueue.poll();

                // Execute the process
                time += current.getBurstTime();
                current.setCompletionTime(time);
                current.setTurnaroundTime(time - current.getArrivalTime());
                current.setWaitingTime(current.getTurnaroundTime() - current.getBurstTime());

                totalWT += current.getWaitingTime();
                totalTAT += current.getTurnaroundTime();
                scheduled.add(current);
            } else {
                 break; // No more processes to schedule
            }
        }

        printMetrics(totalWT, totalTAT, scheduled.size());
        return scheduled;
    }

    public List<Process> runPriority() {
        List<Process> scheduled = new ArrayList<>();
        int time = 0, totalWT = 0, totalTAT = 0;

        // Create a priority queue to hold ready processes, sorted by priority
        PriorityQueue<Process> readyQueue = new PriorityQueue<>(Comparator.comparingInt(Process::getPriority));

        List<Process> remainingProcesses = new ArrayList<>(processes); // Create a copy
        while (!remainingProcesses.isEmpty() || !readyQueue.isEmpty()) {
            // Add processes that have arrived to the ready queue
            Iterator<Process> iterator = remainingProcesses.iterator();
            while (iterator.hasNext()) {
                Process p = iterator.next();
                if (p.getArrivalTime() <= time) {
                    readyQueue.add(p);
                    iterator.remove(); // Remove from remainingProcesses
                }
            }

            // If the ready queue is empty, advance time
            if (readyQueue.isEmpty()) {
                time++;
            } else {
                // Get the process with the highest priority (lowest priority number)
                Process current = readyQueue.poll();

                // Execute the process
                int startTime = Math.max(time, current.getArrivalTime());
                time = startTime + current.getBurstTime();
                current.setCompletionTime(time);
                current.setTurnaroundTime(time - current.getArrivalTime());
                current.setWaitingTime(current.getTurnaroundTime() - current.getBurstTime());

                totalWT += current.getWaitingTime();
                totalTAT += current.getTurnaroundTime();
                scheduled.add(current);
            }
        }

        printMetrics(totalWT, totalTAT, scheduled.size());
        return scheduled;
    }

    // Round Robin Scheduling Algorithm
    public List<Process> runRoundRobin(int quantum) {
        List<Process> scheduled = new ArrayList<>();
        Queue<Process> readyQueue = new LinkedList<>(processes);
        int time = 0, totalWT = 0, totalTAT = 0;

        // Initialize remaining burst time for all processes
        for (Process p : processes) {
            p.setRemainingBurstTime(p.getBurstTime());
        }

        while (!readyQueue.isEmpty()) {
            Process p = readyQueue.poll();

            if (p.getRemainingBurstTime() > quantum) {
                time += quantum;
                p.setRemainingBurstTime(p.getRemainingBurstTime() - quantum);
                readyQueue.add(p);  // Add back to the queue if not completed
            } else {
                time += p.getRemainingBurstTime();
                p.setRemainingBurstTime(0); // Process completed

                p.setCompletionTime(time);
                p.setTurnaroundTime(time - p.getArrivalTime());
                p.setWaitingTime(p.getTurnaroundTime() - p.getBurstTime());

                totalWT += p.getWaitingTime();
                totalTAT += p.getTurnaroundTime();
                scheduled.add(p);
            }
        }

        printMetrics(totalWT, totalTAT, scheduled.size());
        return scheduled;
    }

    private void printMetrics(int totalWT, int totalTAT, int n) {
        System.out.println("\nAverage Waiting Time: " + (float) totalWT / n);
        System.out.println("Average Turnaround Time: " + (float) totalTAT / n);
    }
}
