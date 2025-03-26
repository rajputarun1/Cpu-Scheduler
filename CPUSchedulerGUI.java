// CPUSchedulerGUI.java
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

public class CPUSchedulerGUI extends JFrame {

    private JTable processTable;
    private DefaultTableModel tableModel;
    private JTextArea outputArea;
    private JComboBox<String> algorithmSelector;

    public CPUSchedulerGUI() {
        setTitle("CPU Scheduler Simulator");
        setSize(700, 500);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        // Table Setup
        JPanel tablePanel = new JPanel(new BorderLayout());
        String[] columnNames = {"Process ID", "Arrival Time", "Burst Time", "Priority"};
        tableModel = new DefaultTableModel(columnNames, 0);
        processTable = new JTable(tableModel);
        tablePanel.add(new JScrollPane(processTable), BorderLayout.CENTER);

        // Add/Remove Process Buttons
        JPanel controlPanel = new JPanel();
        JButton addProcessButton = new JButton("Add Process");
        JButton removeProcessButton = new JButton("Remove Process");

        controlPanel.add(addProcessButton);
        controlPanel.add(removeProcessButton);

        addProcessButton.addActionListener(e -> tableModel.addRow(new Object[]{tableModel.getRowCount() + 1, 0, 0, 0}));

        removeProcessButton.addActionListener(e -> {
            int selectedRow = processTable.getSelectedRow();
            if (selectedRow != -1) {
                tableModel.removeRow(selectedRow);
            }
        });

        tablePanel.add(controlPanel, BorderLayout.SOUTH);
        add(tablePanel, BorderLayout.NORTH);

        // Algorithm Selection
        JPanel topPanel = new JPanel();
        String[] algorithms = {"FCFS", "SJF", "Priority", "Round Robin"};
        algorithmSelector = new JComboBox<>(algorithms);
        topPanel.add(new JLabel("Algorithm:"));
        topPanel.add(algorithmSelector);

        // Run Button
        JButton runButton = new JButton("Run Scheduler");
        runButton.addActionListener(e -> runScheduler()); // Corrected action listener assignment
        topPanel.add(runButton); // Added to topPanel
        add(topPanel, BorderLayout.CENTER);

        // Output Area
        outputArea = new JTextArea();
        outputArea.setEditable(false);
        outputArea.setRows(10);
        add(new JScrollPane(outputArea), BorderLayout.SOUTH);
    }

    private void runScheduler() {
        // Disable the run button while the scheduler is running
        SwingUtilities.invokeLater(() -> ((JButton) ((JPanel) algorithmSelector.getParent()).getComponent(2)).setEnabled(false));

        List<Process> processList = new ArrayList<>();
        // Read user input
        for (int i = 0; i < tableModel.getRowCount(); i++) {
            try {
                int pid = Integer.parseInt(tableModel.getValueAt(i, 0).toString());
                int arrival = Integer.parseInt(tableModel.getValueAt(i, 1).toString());
                int burst = Integer.parseInt(tableModel.getValueAt(i, 2).toString());
                int priority = Integer.parseInt(tableModel.getValueAt(i, 3).toString());
                processList.add(new Process(pid, arrival, burst, priority));
            } catch (Exception e) {
                outputArea.setText("Error: Invalid input in table.");
                return;
            }
        }

        if (processList.isEmpty()) {
            outputArea.setText("Error: No processes entered.");
            return;
        }

        String selectedAlgorithm = (String) algorithmSelector.getSelectedItem();

        // Use SwingWorker to run the scheduler in a background thread
        new SwingWorker<String, Void>() {
            @Override
            protected String doInBackground() throws Exception {
                CPUScheduler scheduler = new CPUScheduler(processList);
                List<Process> scheduledProcesses;

                switch (selectedAlgorithm) {
                    case "FCFS":
                        scheduledProcesses = scheduler.runFCFS();
                        break;
                    case "SJF":
                         scheduledProcesses = scheduler.runSJF();
                         break;
                    case "Priority":
                        scheduledProcesses = scheduler.runPriority();
                        break;
                    case "Round Robin":
                        String quantumStr = JOptionPane.showInputDialog(CPUSchedulerGUI.this, "Enter Quantum Time:");
                        if (quantumStr != null && !quantumStr.isEmpty()) {
                            try {
                                int quantum = Integer.parseInt(quantumStr);
                                scheduledProcesses = scheduler.runRoundRobin(quantum);
                            } catch (NumberFormatException e) {
                                return "Error: Invalid quantum value.";
                            }
                        } else {
                            return "Error: Quantum value required for Round Robin.";
                        }
                        break;
                    default:
                        return "Error: Invalid algorithm selected.";
                }

                StringBuilder result = new StringBuilder("Scheduled Order (" + selectedAlgorithm + "):\n");
                StringBuilder ganttChart = new StringBuilder("Gantt Chart:\n");
                double totalWT = 0, totalTAT = 0;

                for (Process p : scheduledProcesses) {
                    result.append("Process ").append(p.getProcessID()).append("\n");
                    ganttChart.append(" | P").append(p.getProcessID());
                    totalWT += p.getWaitingTime();
                    totalTAT += p.getTurnaroundTime();
                }
                ganttChart.append(" |\n");

                double avgWT = (scheduledProcesses.isEmpty()) ? 0 : totalWT / scheduledProcesses.size();
                double avgTAT = (scheduledProcesses.isEmpty()) ? 0 : totalTAT / scheduledProcesses.size();

                return result.toString() + "\n" + ganttChart.toString() +
                        "\n\nAverage Waiting Time: " + String.format("%.2f", avgWT) +
                        "\nAverage Turnaround Time: " + String.format("%.2f", avgTAT);
            }

            @Override
            protected void done() {
                try {
                    outputArea.setText(get());
                } catch (InterruptedException | ExecutionException e) {
                    outputArea.setText("Error: " + e.getMessage());
                } finally {
                    // Re-enable the run button after the scheduler is done
                    SwingUtilities.invokeLater(() -> ((JButton) ((JPanel) algorithmSelector.getParent()).getComponent(2)).setEnabled(true));
                }
            }
        }.execute();
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            new CPUSchedulerGUI().setVisible(true);
        });
    }
}
