export interface Agent { input_key: string; type: string; name: string; system_message: string; description: string; icon: string; index_name: string; }

import h1 from '@/assets/h1.png';
import lBrain from '@/assets/l-brain.png';
import lPen from '@/assets/l-pen.png';
import lSearch from '@/assets/l-search.png';
import lAi from '@/assets/l-ai.png';
import lSensor from '@/assets/l-sensor.png';
import lAnalyzer from '@/assets/l-analyzer.png';
import lRag from '@/assets/l-rag.png';
  // Helper functions to get avatar source and fallback
export const getAvatarSrc = (user: string) => {
    switch (user.toLowerCase()) {
      case 'user':
        return h1;
      case 'magenticoneorchestrator':
        return lBrain;
      case 'coder':
        return lPen;
      case 'filesurfer':
        return lSearch;
      case 'websurfer':
        return lSearch;
      case 'ragagent':
        return lSearch;
      case 'executor':
        return lPen;
      case 'taskresult':
        return lAi;
      case 'sensorsentinel':
        return lSensor;
      case 'compliancesentinel':
        return lSensor;
      case 'trendanalyzer':
        return lAnalyzer;
      case 'transactiontrendanalyzer':
        return lAnalyzer;
      case 'oilgasknowledge':
        return lRag;
      case 'KBAgent'.toLowerCase():
          return lRag;
      case 'MaintanceKBAgent'.toLowerCase():
          return lRag;
      case 'CreditOpportunityRecommender'.toLocaleLowerCase():
          return lAnalyzer;
      default:
        if (user.toLowerCase().includes('rag')) {
          return lRag;
        }
        if (user.toLowerCase().includes('analyzer')) {
          return lAnalyzer;
        }
        if (user.toLowerCase().includes('monitor')) {
          return lSensor;
        }
        return 'https://example.com/default.png';
    }
  };
export  const getAvatarFallback = (user: string) => {
    switch (user.toLowerCase()) {
      case 'user':
        return 'U';
      case 'magenticoneorchestrator':
        return 'O';
      case 'coder':
        return 'C';
      case 'filesurfer':
        return 'F';
      case 'websurfer':
        return 'W';
      case 'ragagent':
        return 'R';
      case 'executor':
        return 'E';
      case 'ai':
        return 'AI';
      default:
        return 'D';
    }
  };



// Default MagenticOne Agents
export const agentsTeam1: Agent[] = [
    {
      input_key: "0001",
      type: "MagenticOne",
      name: "Coder",
      system_message: "",
      description: "",
      icon: "👨‍💻",
      index_name: ""
    },
    {
      input_key: "0002",
      type: "MagenticOne",
      name: "Executor",
      system_message: "",
      description: "",
      icon: "💻",
      index_name: ""
    },
    {
      input_key: "0003",
      type: "MagenticOne",
      name: "FileSurfer",
      system_message: "",
      description: "",
      icon: "📂",
      index_name: ""
    },
    {
      input_key: "0004",
      type: "MagenticOne",
      name: "WebSurfer",
      system_message: "",
      description: "",
      icon: "🏄‍♂️",
      index_name: ""
    }
  ];


// Predictive Maintenance Scenario
export const agentsTeam2: Agent[] = [
  {
    input_key: "0001",
    type: "MagenticOne",
    name: "Coder",
    system_message: "",
    description: "",
    icon: "👨‍💻",
    index_name: ""
  },
  {
    input_key: "0002",
    type: "MagenticOne",
    name: "Executor",
    system_message: "",
    description: "",
    icon: "💻",
    index_name: ""
  },
  // {
  //   input_key: "0003",
  //   type: "MagenticOne",
  //   name: "FileSurfer",
  //   system_message: "",
  //   description: "",
  //   icon: "📂",
  //   index_name: ""
  // },
  // {
  //   input_key: "0004",
  //   type: "MagenticOne",
  //   name: "WebSurfer",
  //   system_message: "",
  //   description: "",
  //   icon: "🏄‍♂️",
  //   index_name: ""
  // },
  {
    input_key:"0005",
    type:"Custom",
    name:"SensorSentinel",
    system_message:`
You are Sensor Sentinel, the real‑time data guardian for our high‑pressure gas compressor. Your primary responsibility is to continuously monitor sensor streams—including temperature, vibration, pressure, and running hours—and detect subtle trends or anomalies that deviate from the manufacturer’s thresholds as described in Emerson’s Predictive Maintenance Guide. Always validate that your anomaly detection is statistically robust, flag potential issues early, and generate a concise summary of deviations for further review.

Datasets

You are provided with detailed datasets for seven transformers (T1001 to T1007). Your task is to analyze these datasets. No additional data needed. Do not use any other data than below.

### Dataset 1: Sensor Data for High‑Pressure G

| Timestamp           | EquipmentID | Temperature (°C) | Vibration (mm/s) | Pressure (bar) | RunningHours |  
|---------------------|-------------|------------------|------------------|----------------|--------------|  
| 2024-04-01 08:00:00 | COMP-001    | 78.0             | 3.20             | 12.00          | 1500.0       |  
| 2024-04-01 08:05:00 | COMP-001    | 78.2             | 3.22             | 12.00          | 1500.1       |  
| 2024-04-01 08:10:00 | COMP-001    | 78.4             | 3.24             | 12.00          | 1500.2       |  
| 2024-04-01 08:15:00 | COMP-001    | 78.6             | 3.26             | 12.01          | 1500.3       |  
| 2024-04-01 08:20:00 | COMP-001    | 78.8             | 3.28             | 12.01          | 1500.4       |  
| 2024-04-01 08:25:00 | COMP-001    | 79.0             | 3.30             | 12.01          | 1500.5       |  
| 2024-04-01 08:30:00 | COMP-001    | 79.2             | 3.32             | 12.02          | 1500.6       |  
| 2024-04-01 08:35:00 | COMP-001    | 79.4             | 3.34             | 12.02          | 1500.7       |  
| 2024-04-01 08:40:00 | COMP-001    | 79.6             | 3.36             | 12.02          | 1500.8       |  
| 2024-04-01 08:45:00 | COMP-001    | 79.8             | 3.38             | 12.03          | 1500.9       |  
| 2024-04-01 08:50:00 | COMP-001    | 80.0             | 3.40             | 12.03          | 1501.0       |  
| 2024-04-01 08:55:00 | COMP-001    | 80.0             | 3.40             | 12.03          | 1501.1       |  
| 2024-04-01 09:00:00 | COMP-001    | 80.1             | 3.41             | 12.03          | 1501.2       |  
| 2024-04-01 09:05:00 | COMP-001    | 80.2             | 3.42             | 12.03          | 1501.3       |  
| 2024-04-01 09:10:00 | COMP-001    | 80.3             | 3.43             | 12.04          | 1501.4       |  
| 2024-04-01 09:15:00 | COMP-001    | 88.0             | 4.80             | 11.80          | 1501.5       |  
| 2024-04-01 09:20:00 | COMP-001    | 88.5             | 4.85             | 11.79          | 1501.6       |  
| 2024-04-01 09:25:00 | COMP-001    | 89.0             | 4.90             | 11.78          | 1501.7       |  
| 2024-04-01 09:30:00 | COMP-001    | 89.2             | 4.92             | 11.78          | 1501.8       |  
| 2024-04-01 09:35:00 | COMP-001    | 89.5             | 4.95             | 11.77          | 1501.9       |  
| 2024-04-01 09:40:00 | COMP-001    | 89.7             | 4.98             | 11.77          | 1502.0       |  
| 2024-04-01 09:45:00 | COMP-001    | 90.0             | 5.00             | 11.76          | 1502.1       |  
| 2024-04-01 09:50:00 | COMP-001    | 90.2             | 5.02             | 11.76          | 1502.2       |  
| 2024-04-01 09:55:00 | COMP-001    | 90.5             | 5.05             | 11.75          | 1502.3       |  
| 2024-04-01 10:00:00 | COMP-001    | 90.7             | 5.08             | 11.75          | 1502.4       |  
| 2024-04-01 10:05:00 | COMP-001    | 88.0             | 4.20             | 12.00          | 1502.5       |  
| 2024-04-01 10:10:00 | COMP-001    | 86.0             | 3.90             | 12.02          | 1502.6       |  
| 2024-04-01 10:15:00 | COMP-001    | 84.0             | 3.70             | 12.03          | 1502.7       |  
| 2024-04-01 10:20:00 | COMP-001    | 82.0             | 3.55             | 12.03          | 1502.8       |  
| 2024-04-01 10:25:00 | COMP-001    | 81.0             | 3.50             | 12.04          | 1502.9       |  
| 2024-04-01 10:30:00 | COMP-001    | 80.5             | 3.48             | 12.04          | 1503.0       |  
| 2024-04-01 10:35:00 | COMP-001    | 80.3             | 3.46             | 12.04          | 1503.1       |  
| 2024-04-01 10:40:00 | COMP-001    | 80.2             | 3.45             | 12.04          | 1503.2       |  
| 2024-04-01 10:45:00 | COMP-001    | 80.1             | 3.44             | 12.05          | 1503.3       |  
| 2024-04-01 10:50:00 | COMP-001    | 80.0             | 3.43             | 12.05          | 1503.4       |  
| 2024-04-01 10:55:00 | COMP-001    | 79.9             | 3.42             | 12.05          | 1503.5       |  
| 2024-04-01 11:00:00 | COMP-001    | 79.8             | 3.41             | 12.05          | 1503.6       |  
| 2024-04-01 11:05:00 | COMP-001    | 79.7             | 3.40             | 12.05          | 1503.7       |  
| 2024-04-01 11:10:00 | COMP-001    | 79.6             | 3.39             | 12.06          | 1503.8       |  
| 2024-04-01 11:15:00 | COMP-001    | 79.5             | 3.38             | 12.06          | 1503.9       |  
| 2024-04-01 11:20:00 | COMP-001    | 79.4             | 3.37             | 12.06          | 1504.0       |  
| 2024-04-01 11:25:00 | COMP-001    | 79.3             | 3.36             | 12.06          | 1504.1       |  
| 2024-04-01 11:30:00 | COMP-001    | 79.2             | 3.35             | 12.06          | 1504.2       |  
| 2024-04-01 11:35:00 | COMP-001    | 79.1             | 3.34             | 12.07          | 1504.3       |  
| 2024-04-01 11:40:00 | COMP-001    | 79.0             | 3.33             | 12.07          | 1504.4       |  
| 2024-04-01 11:45:00 | COMP-001    | 78.9             | 3.32             | 12.07          | 1504.5       |  
| 2024-04-01 11:50:00 | COMP-001    | 78.8             | 3.31             | 12.07          | 1504.6       |  
| 2024-04-01 11:55:00 | COMP-001    | 78.7             | 3.30             | 12.07          | 1504.7       |  
| 2024-04-01 12:00:00 | COMP-001    | 78.6             | 3.29             | 12.08          | 1504.8       |  
| 2024-04-01 12:05:00 | COMP-001    | 78.5             | 3.28             | 12.08          | 1504.9       |  

### Dataset 2: Maintenance Log Data for High‑P

| MaintenanceDate | EquipmentID | MaintenanceType     | Description                                                          | Duration (hrs) | Comments                                              |  
|-----------------|-------------|---------------------|----------------------------------------------------------------------|----------------|-------------------------------------------------------|  
| 2024-03-01      | COMP-001    | Preventive Repair    | Replaced compressor bearings and adjusted belt tension               | 3.0            | Noted slight vibration increase pre-repair           |  
| 2024-03-03      | COMP-001    | Calibration          | Calibrated temperature and pressure sensors per vendor guidelines    | 1.5            | Temperature readings marginally high                  |  
| 2024-03-05      | COMP-001    | Inspection           | Visual inspection and ultrasonic testing of compressor casing        | 2.0            | Minor wear observed on mounting brackets              |  
| 2024-03-07      | COMP-001    | Lubrication          | Performed complete lubrication renewal of rotating components        | 1.0            | Lubricant viscosity within specification post-service  |  
| 2024-03-09      | COMP-001    | Preventive Repair    | Replaced worn-out seals on compressor inlet                          | 2.5            | Leak detected during routine check                    |  
| 2024-03-11      | COMP-001    | Software Update      | Updated data acquisition software to version 4.2 as per Emerson bulletin | 1.0            | Improved sensor data accuracy observed                 |  
| 2024-03-13      | COMP-001    | Inspection           | Infrared and vibration analysis of compressor motor                 | 2.0            | Temperature anomaly noted on infrared scan            |  
| 2024-03-15      | COMP-001    | Calibration          | Recalibrated vibration sensors and verified firmware update         | 1.5            | Minor drift detected in baseline readings             |  
| 2024-03-17      | COMP-001    | Preventive Repair    | Replaced compressor oil filter and performed oil analysis           | 2.0            | Oil analysis indicated slight contamination            |  
| 2024-03-19      | COMP-001    | Inspection           | Ultrasonic inspection of compressor drive system                    | 2.5            | No structural issues detected                          |  
| 2024-03-21      | COMP-001    | Lubrication          | Applied high-performance lubricant to compressor gears              | 1.0            | Lubricant level optimized                              |  
| 2024-03-23      | COMP-001    | Preventive Repair    | Replaced worn bearing adapter plates                                 | 3.0            | Vibration levels reduced post-repair                  |  
| 2024-03-25      | COMP-001    | Calibration          | Calibrated pressure transducer on compressor discharge              | 1.5            | Pressure readings now within acceptable range         |  
| 2024-03-27      | COMP-001    | Inspection           | Visual and thermal inspection of compressor base and mounts         | 2.0            | Minor thermal hotspots observed                        |  
| 2024-03-29      | COMP-001    | Preventive Repair    | Adjusted compressor belt alignment and tension                      | 2.5            | Post-adjustment vibration levels satisfactory          |  
| 2024-03-31      | COMP-001    | Software Update      | Updated sensor integration module per Emerson guidelines            | 1.0            | Data acquisition improved                              |  
| 2024-04-02      | COMP-001    | Inspection           | Comprehensive system diagnostic using vibration and thermal analysis | 2.5            | Anomalies noted; further investigation required         |  
| 2024-04-04      | COMP-001    | Lubrication          | Replenished compressor hydraulic fluid and checked leak points      | 1.0            | Fluid levels optimal                                   |  
| 2024-04-06      | COMP-001    | Preventive Repair    | Replaced compressor inlet valve seals due to leak                  | 2.0            | Leak eliminated post-repair                            |  
| 2024-04-08      | COMP-001    | Calibration          | Recalibrated all sensor arrays on the compressor                   | 1.5            | Baseline reset completed successfully                   |  
| 2024-04-10      | COMP-001    | Inspection           | Conducted detailed ultrasonic test on compressor casing integrity   | 2.0            | No further corrosion detected                          |  
| 2024-04-12      | COMP-001    | Preventive Repair    | Replaced aging sensor cables and connectors                         | 1.5            | Intermittent signal drop eliminated                    |  
| 2024-04-14      | COMP-001    | Software Update      | Installed patch for predictive maintenance algorithm per Emerson guidelines | 1.0            | Algorithm performance improved                         |  
| 2024-04-16      | COMP-001    | Inspection           | Visual inspection of compressor skid and support structures         | 2.0            | Minor abrasions noted; no immediate risk              |  
| 2024-04-18      | COMP-001    | Lubrication          | Performed scheduled lubrication of compressor bearings              | 1.0            | No issues post-lubrication                             |  
| 2024-04-20      | COMP-001    | Preventive Repair    | Replaced compressor drive motor brushes due to wear                | 2.5            | Performance improved post-repair                       |  
| 2024-04-22      | COMP-001    | Calibration          | Calibrated temperature sensors after repair work                   | 1.5            | Readings now stable                                    |  
| 2024-04-24      | COMP-001    | Inspection           | Conducted infrared thermography on compressor housing              | 2.0            | Identified cooling inefficiency; flagged for monitoring|  
| 2024-04-26      | COMP-001    | Preventive Repair    | Adjusted compressor valve timings and replaced worn gaskets        | 3.0            | Performance improved significantly                     |  
| 2024-04-28      | COMP-001    | Inspection           | Detailed vibration analysis during startup revealed high anomaly   | 2.5            | Anomaly correlates with sensor spike period           |  
| 2024-04-30      | COMP-001    | Lubrication          | Performed lubrication top-up and oil analysis                     | 1.0            | Oil quality remains within limits                      |  
| 2024-05-02      | COMP-001    | Preventive Repair    | Replaced damaged components on compressor discharge side           | 2.0            | Pressure stability improved                            |  
| 2024-05-04      | COMP-001    | Calibration          | Calibrated all measurement devices after routine maintenance       | 1.5            | All sensor readings normalized                         |  
| 2024-05-06      | COMP-001    | Inspection           | Visual and acoustic inspection during operation                    | 2.0            | No unusual noises detected                             |  
| 2024-05-08      | COMP-001    | Preventive Repair    | Adjusted cooling system and cleaned heat exchangers               | 2.5            | Cooling performance enhanced                           |  
| 2024-05-10      | COMP-001    | Software Update      | Implemented Emerson-recommended update for diagnostic software    | 1.0            | Real-time analytics now more precise                  |  
| 2024-05-12      | COMP-001    | Inspection           | Conducted full operational test with vibration and pressure monitoring | 2.0            | Test results within thresholds                         |  
| 2024-05-14      | COMP-001    | Lubrication          | Replaced lubricant with high-temperature resistant formula         | 1.0            | Temperature stability slightly improved                |  
| 2024-05-16      | COMP-001    | Preventive Repair    | Replaced aging compressor seals and gaskets                       | 2.5            | Leakage eliminated post-repair                         |  
| 2024-05-18      | COMP-001    | Calibration          | Calibrated vibration sensor module after component replacement     | 1.5            | Vibration baseline updated                             |  
| 2024-05-20      | COMP-001    | Inspection           | Performed detailed ultrasonic inspection of compressor bearings    | 2.0            | Bearing condition marginal; further monitoring required |  
| 2024-05-22      | COMP-001    | Preventive Repair    | Realigned compressor rotor and adjusted shaft balance              | 3.0            | Vibration levels significantly reduced                 |  
| 2024-05-24      | COMP-001    | Software Update      | Updated firmware on pressure transducers per new guidelines       | 1.0            | Pressure consistency improved                          |  
| 2024-05-26      | COMP-001    | Inspection           | Comprehensive diagnostic test on compressor performance            | 2.5            | Minor thermal anomalies noted; recommend continued monitoring |  
| 2024-05-28      | COMP-001    | Lubrication          | Performed lubrication of compressor drive and rechecked sensor outputs | 1.0            | No further issues detected                             |  
| 2024-05-30      | COMP-001    | Preventive Repair    | Replaced worn compressor motor components                          | 2.0            | Post-repair performance normal                         |  
| 2024-06-01      | COMP-001    | Inspection           | Final operational test and certification after series of repairs  | 2.5            | Compressor now meets all performance criteria          |  

Reply "TERMINATE" in the end when everything is done.
`,
    description:"An agent that monitors sensor streams and detects trends or anomalies for particular device or equipment. Agent has access to all necessary data.",
    icon:"🎻",
    index_name:""
    },
  {
    input_key:"0006",
    type:"RAG",
    name:"MaintanceKBAgent",
    system_message:"",
    description:"An agent that has access to internal index and can handle RAG tasks, call this agent if you are getting questions on Emerson’s Predictive Maintenance Guide.",
    icon:"📖",
    index_name:"ag-demo-pred-maint"
    }
];

  
// Safety Scenario
export const agentsTeam3: Agent[] = [
    {
      input_key: "0001",
      type: "MagenticOne",
      name: "Coder",
      system_message: "",
      description: "",
      icon: "👨‍💻",
      index_name: ""
    },
    {
      input_key: "0002",
      type: "MagenticOne",
      name: "Executor",
      system_message: "",
      description: "",
      icon: "💻",
      index_name: ""
    },
    // {
    //   input_key: "0003",
    //   type: "MagenticOne",
    //   name: "FileSurfer",
    //   system_message: "",
    //   description: "",
    //   icon: "📂",
    //   index_name: ""
    // },
    // {
    //   input_key: "0004",
    //   type: "MagenticOne",
    //   name: "WebSurfer",
    //   system_message: "",
    //   description: "",
    //   icon: "🏄‍♂️",
    //   index_name: ""
    // },
    {
      input_key:"0005",
      type:"Custom",
      name:"ComplianceSentinel",
      system_message:`
You are Compliance Sentinel, the watchdog for our incident reporting system at Well Site A-17. Your mission is to rigorously compare internal incident reports against the latest BSEE Incident Reporting & HSE Compliance Guidelines 2024. Check for missing or incomplete fields, delayed report submissions, and discrepancies in incident classifications. Flag any non‑compliance issues and generate a detailed report highlighting areas for improvement to ensure full regulatory adherence.

Datasets

You are provided with detailed datasets. Your task is to analyze these datasets. No additional data needed.

### Dataset 1: Internal Incident Reports for Well Site (BSEE Incident Reporting)

| IncidentID | Date       | Location     | IncidentType   | Description                                                           | Outcome                       | Comments                                                   |  
|------------|------------|--------------|----------------|-----------------------------------------------------------------------|-------------------------------|------------------------------------------------------------|  
| IR-1001    | 2024-03-01 | Well Site A-17 | Near Miss      | Operator observed a minor slip on a wet surface near the control panel.| No injury                    | Reported immediately; corrective action taken.             |  
| IR-1002    | 2024-03-02 | Well Site A-17 | Safety         | Temporary loss of lighting during shift change caused disorientation.  | No injury                    | Shift supervisor notified; lights restored within 5 minutes.|  
| IR-1003    | 2024-03-03 | Well Site A-17 | Environmental  | Small oil spill detected near the storage tank.                       | Spill contained               | Clean-up initiated; incident report filed.                 |  
| IR-1004    | 2024-03-04 | Well Site A-17 | Near Miss      | Loose guard rail near processing unit nearly caused a fall.           | No injury                    | Maintenance alerted; guard rail fixed.                      |  
| IR-1005    | 2024-03-05 | Well Site A-17 | Safety         | Worker reported dizziness in high-heat area.                          | No injury                    | Area temperature monitored; cooling improved.               |  
| IR-1006    | 2024-03-06 | Well Site A-17 | Safety         | Equipment guard missing on drilling rig; near miss.                   | No injury                    | Immediate replacement ordered.                              |  
| IR-1007    | 2024-03-07 | Well Site A-17 | Environmental  | Minor gas leak detected from auxiliary valve.                         | Leak repaired                 | Investigation revealed valve corrosion.                     |  
| IR-1008    | 2024-03-08 | Well Site A-17 | Near Miss      | Falling tool incident during rig maintenance.                         | No injury                    | Tool tethering policy reinforced.                           |  
| IR-1009    | 2024-03-09 | Well Site A-17 | Safety         | Operator delayed in reporting malfunctioning alarm.                   | No injury                    | Training session scheduled on prompt reporting.            |  
| IR-1010    | 2024-03-10 | Well Site A-17 | Near Miss      | Slippery walkway due to condensation; near fall observed.             | No injury                    | Surface treatment applied.                                  |  
| IR-1011    | 2024-03-11 | Well Site A-17 | Safety         | Improper PPE observed during routine inspection.                       | No injury                    | Reminder issued; PPE compliance improved.                   |  
| IR-1012    | 2024-03-12 | Well Site A-17 | Environmental  | Minor spill of hydraulic fluid in maintenance bay.                   | Spill contained               | Corrective measures taken; source identified.               |  
| IR-1013    | 2024-03-13 | Well Site A-17 | Near Miss      | Equipment vibration anomaly noted during startup.                     | No injury                    | Data logged; further analysis required.                     |  
| IR-1014    | 2024-03-14 | Well Site A-17 | Safety         | Worker tripped over exposed cable in control room.                   | No injury                    | Cable secured; hazard removed.                              |  
| IR-1015    | 2024-03-15 | Well Site A-17 | Environmental  | Small release of cooling water detected.                              | No environmental impact       | Leak repair completed promptly.                             |  
| IR-1016    | 2024-03-16 | Well Site A-17 | Safety         | Unsecured ladder nearly fell during inspection.                       | No injury                    | Ladder secured; safety briefing held.                       |  
| IR-1017    | 2024-03-17 | Well Site A-17 | Near Miss      | Brief power outage in operating area.                                | No injury                    | Backup system confirmed operational.                        |  
| IR-1018    | 2024-03-18 | Well Site A-17 | Safety         | Worker experienced minor burn from hot equipment.                    | Minor injury                  | First aid administered; investigation ongoing.              |  
| IR-1019    | 2024-03-19 | Well Site A-17 | Environmental  | Unplanned emission spike from vent system.                           | Emission within limits        | Continuous monitoring in place.                             |  
| IR-1020    | 2024-03-20 | Well Site A-17 | Near Miss      | Falling debris near drilling area observed.                          | No injury                    | Inspection conducted; debris removed.                       |  
| IR-1021    | 2024-03-21 | Well Site A-17 | Safety         | Delayed emergency shutdown during a minor fire.                      | No injury                    | Procedure reviewed; training updated.                       |  
| IR-1022    | 2024-03-22 | Well Site A-17 | Environmental  | Leak in chemical storage area detected.                              | Leak contained                | Immediate repair; sensor recalibrated.                      |  
| IR-1023    | 2024-03-23 | Well Site A-17 | Near Miss      | Tool drop from height without injury.                                | No injury                    | Tool safety protocols re-emphasized.                       |  
| IR-1024    | 2024-03-24 | Well Site A-17 | Safety         | Worker lost balance on wet floor.                                    | No injury                    | Floor cleaned and anti-slip mats installed.                |  
| IR-1025    | 2024-03-25 | Well Site A-17 | Environmental  | Minor flare system anomaly recorded.                                  | No environmental impact       | System diagnostics performed.                                |  
| IR-1026    | 2024-03-26 | Well Site A-17 | Safety         | Incorrect labeling on hazardous material container.                   | No injury                    | Labeling corrected; staff retrained.                        |  
| IR-1027    | 2024-03-27 | Well Site A-17 | Near Miss      | Near collision of service vehicle with rig.                          | No injury                    | Traffic routes revised; warning signs installed.            |  
| IR-1028    | 2024-03-28 | Well Site A-17 | Safety         | Improper storage of tools in break area.                             | No injury                    | Storage procedures updated.                                  |  
| IR-1029    | 2024-03-29 | Well Site A-17 | Environmental  | Unexpected odor detected near vent outlet.                           | No environmental impact       | Air quality sensor data reviewed.                            |  
| IR-1030    | 2024-03-30 | Well Site A-17 | Safety         | Worker reported fatigue during long shift.                           | No injury                    | Shift rotation reviewed; rest breaks enforced.              |  
| IR-1031    | 2024-03-31 | Well Site A-17 | Near Miss      | Slippery conditions on loading dock due to rain.                    | No injury                    | Anti-slip coating applied.                                  |  
| IR-1032    | 2024-04-01 | Well Site A-17 | Safety         | Unattended hot surface near control panel.                           | No injury                    | Surface cooled; monitoring increased.                       |  
| IR-1033    | 2024-04-02 | Well Site A-17 | Environmental  | Minor solvent spill in lab area.                                     | Spill contained               | Proper disposal measures followed.                          |  
| IR-1034    | 2024-04-03 | Well Site A-17 | Safety         | Inadequate ventilation in work area observed.                        | No injury                    | Ventilation system checked and improved.                    |  
| IR-1035    | 2024-04-04 | Well Site A-17 | Near Miss      | Unsecured guard rail on elevated platform.                           | No injury                    | Guard rail secured; inspection logged.                      |  
| IR-1036    | 2024-04-05 | Well Site A-17 | Safety         | Worker reported dizziness near fuel pump area.                       | No injury                    | Area ventilated; incident documented.                       |  
| IR-1037    | 2024-04-06 | Well Site A-17 | Environmental  | Small leak from containment sump detected.                           | Leak repaired                 | Sump integrity rechecked.                                   |  
| IR-1038    | 2024-04-07 | Well Site A-17 | Safety         | Delayed reporting of equipment malfunction.                          | No injury                    | Reporting procedure re-emphasized.                          |  
| IR-1039    | 2024-04-08 | Well Site A-17 | Near Miss      | Falling object narrowly missed personnel.                            | No injury                    | Drop zone established; training reiterated.                 |  
| IR-1040    | 2024-04-09 | Well Site A-17 | Safety         | Failure of personal protective equipment noted.                      | No injury                    | PPE inspection increased; replacements ordered.             |  
| IR-1041    | 2024-04-10 | Well Site A-17 | Environmental  | Unexpected emission from flaring unit recorded.                      | Emission within limits        | Continuous monitoring confirmed.                            |  
| IR-1042    | 2024-04-11 | Well Site A-17 | Safety         | Worker tripped over uneven surface in yard.                         | No injury                    | Surface leveled; hazard communicated.                       |  
| IR-1043    | 2024-04-12 | Well Site A-17 | Near Miss      | Brief communication loss in safety system.                           | No injury                    | System check completed; no fault found.                    |  
| IR-1044    | 2024-04-13 | Well Site A-17 | Safety         | Operator fatigue led to delayed reaction during drill startup.       | No injury                    | Rest period enforced; schedule adjusted.                    |  
| IR-1045    | 2024-04-14 | Well Site A-17 | Environmental  | Minor chemical splash during mixing operation.                       | No environmental impact       | Protective measures reinforced.                              |  
| IR-1046    | 2024-04-15 | Well Site A-17 | Safety         | Inadequate signage near hazardous zone observed.                     | No injury                    | Signage updated; additional barriers installed.             |  
| IR-1047    | 2024-04-16 | Well Site A-17 | Near Miss      | Service vehicle nearly collided with equipment.                      | No injury                    | Traffic management revised; incident reviewed.             |  
| IR-1048    | 2024-04-17 | Well Site A-17 | Safety         | Worker experienced mild heat stress.                                 | No injury                    | Cooling protocols reviewed; hydration station added.       |  
| IR-1049    | 2024-04-18 | Well Site A-17 | Environmental  | Minor leak in waste collection area detected.                       | Leak contained                | Waste management protocol updated.                          |  
| IR-1050    | 2024-04-19 | Well Site A-17 | Safety         | Unplanned shutdown due to sensor failure.                            | No injury                    | Sensor maintenance scheduled; root cause analysis initiated.|  




Reply "TERMINATE" in the end when everything is done.
`,
      description:"An Compliance agent that compare internal incident reports (BSEE Incident Reporting) and has access to data for Internal Incident Reports for Well Site. Agent has access to all necessary data.",
      icon:"🎻",
      index_name:""
      },
    {
      input_key:"0006",
      type:"RAG",
      name:"KBAgent",
      system_message:"",
      description:"An agent that has access to internal index and can handle RAG tasks, call this agent if you are getting questions on HSE Compliance Guidelines 2024.",
      icon:"📖",
      index_name:"ag-demo-safety"
      },
      {
        input_key:"0007",
        type:"Custom",
        name:"TrendAnalyzer",
        system_message:`
  You are Incident Trend Analyzer, responsible for scrutinizing historical incident data to identify recurring patterns and underlying causes. Analyze trends in near misses, safety violations, and environmental events. Cross‑validate these trends against the regulatory updates from BSEE and EPA. Your goal is to perform root cause analysis, pinpoint systemic weaknesses, and recommend targeted corrective measures to enhance overall safety performance and prevent future incidents.
  
  Datasets
  
  You are provided with detailed datasets. Your task is to analyze these datasets. No additional data needed.
  
  ### Dataset 1: Internal Incident Reports for Well Site
  
  | IncidentID | Date       | Location     | IncidentType   | Description                                                           | Outcome                       | Comments                                                   |  
  |------------|------------|--------------|----------------|-----------------------------------------------------------------------|-------------------------------|------------------------------------------------------------|  
  | IR-1001    | 2024-03-01 | Well Site A-17 | Near Miss      | Operator observed a minor slip on a wet surface near the control panel.| No injury                    | Reported immediately; corrective action taken.             |  
  | IR-1002    | 2024-03-02 | Well Site A-17 | Safety         | Temporary loss of lighting during shift change caused disorientation.  | No injury                    | Shift supervisor notified; lights restored within 5 minutes.|  
  | IR-1003    | 2024-03-03 | Well Site A-17 | Environmental  | Small oil spill detected near the storage tank.                       | Spill contained               | Clean-up initiated; incident report filed.                 |  
  | IR-1004    | 2024-03-04 | Well Site A-17 | Near Miss      | Loose guard rail near processing unit nearly caused a fall.           | No injury                    | Maintenance alerted; guard rail fixed.                      |  
  | IR-1005    | 2024-03-05 | Well Site A-17 | Safety         | Worker reported dizziness in high-heat area.                          | No injury                    | Area temperature monitored; cooling improved.               |  
  | IR-1006    | 2024-03-06 | Well Site A-17 | Safety         | Equipment guard missing on drilling rig; near miss.                   | No injury                    | Immediate replacement ordered.                              |  
  | IR-1007    | 2024-03-07 | Well Site A-17 | Environmental  | Minor gas leak detected from auxiliary valve.                         | Leak repaired                 | Investigation revealed valve corrosion.                     |  
  | IR-1008    | 2024-03-08 | Well Site A-17 | Near Miss      | Falling tool incident during rig maintenance.                         | No injury                    | Tool tethering policy reinforced.                           |  
  | IR-1009    | 2024-03-09 | Well Site A-17 | Safety         | Operator delayed in reporting malfunctioning alarm.                   | No injury                    | Training session scheduled on prompt reporting.            |  
  | IR-1010    | 2024-03-10 | Well Site A-17 | Near Miss      | Slippery walkway due to condensation; near fall observed.             | No injury                    | Surface treatment applied.                                  |  
  | IR-1011    | 2024-03-11 | Well Site A-17 | Safety         | Improper PPE observed during routine inspection.                       | No injury                    | Reminder issued; PPE compliance improved.                   |  
  | IR-1012    | 2024-03-12 | Well Site A-17 | Environmental  | Minor spill of hydraulic fluid in maintenance bay.                   | Spill contained               | Corrective measures taken; source identified.               |  
  | IR-1013    | 2024-03-13 | Well Site A-17 | Near Miss      | Equipment vibration anomaly noted during startup.                     | No injury                    | Data logged; further analysis required.                     |  
  | IR-1014    | 2024-03-14 | Well Site A-17 | Safety         | Worker tripped over exposed cable in control room.                   | No injury                    | Cable secured; hazard removed.                              |  
  | IR-1015    | 2024-03-15 | Well Site A-17 | Environmental  | Small release of cooling water detected.                              | No environmental impact       | Leak repair completed promptly.                             |  
  | IR-1016    | 2024-03-16 | Well Site A-17 | Safety         | Unsecured ladder nearly fell during inspection.                       | No injury                    | Ladder secured; safety briefing held.                       |  
  | IR-1017    | 2024-03-17 | Well Site A-17 | Near Miss      | Brief power outage in operating area.                                | No injury                    | Backup system confirmed operational.                        |  
  | IR-1018    | 2024-03-18 | Well Site A-17 | Safety         | Worker experienced minor burn from hot equipment.                    | Minor injury                  | First aid administered; investigation ongoing.              |  
  | IR-1019    | 2024-03-19 | Well Site A-17 | Environmental  | Unplanned emission spike from vent system.                           | Emission within limits        | Continuous monitoring in place.                             |  
  | IR-1020    | 2024-03-20 | Well Site A-17 | Near Miss      | Falling debris near drilling area observed.                          | No injury                    | Inspection conducted; debris removed.                       |  
  | IR-1021    | 2024-03-21 | Well Site A-17 | Safety         | Delayed emergency shutdown during a minor fire.                      | No injury                    | Procedure reviewed; training updated.                       |  
  | IR-1022    | 2024-03-22 | Well Site A-17 | Environmental  | Leak in chemical storage area detected.                              | Leak contained                | Immediate repair; sensor recalibrated.                      |  
  | IR-1023    | 2024-03-23 | Well Site A-17 | Near Miss      | Tool drop from height without injury.                                | No injury                    | Tool safety protocols re-emphasized.                       |  
  | IR-1024    | 2024-03-24 | Well Site A-17 | Safety         | Worker lost balance on wet floor.                                    | No injury                    | Floor cleaned and anti-slip mats installed.                |  
  | IR-1025    | 2024-03-25 | Well Site A-17 | Environmental  | Minor flare system anomaly recorded.                                  | No environmental impact       | System diagnostics performed.                                |  
  | IR-1026    | 2024-03-26 | Well Site A-17 | Safety         | Incorrect labeling on hazardous material container.                   | No injury                    | Labeling corrected; staff retrained.                        |  
  | IR-1027    | 2024-03-27 | Well Site A-17 | Near Miss      | Near collision of service vehicle with rig.                          | No injury                    | Traffic routes revised; warning signs installed.            |  
  | IR-1028    | 2024-03-28 | Well Site A-17 | Safety         | Improper storage of tools in break area.                             | No injury                    | Storage procedures updated.                                  |  
  | IR-1029    | 2024-03-29 | Well Site A-17 | Environmental  | Unexpected odor detected near vent outlet.                           | No environmental impact       | Air quality sensor data reviewed.                            |  
  | IR-1030    | 2024-03-30 | Well Site A-17 | Safety         | Worker reported fatigue during long shift.                           | No injury                    | Shift rotation reviewed; rest breaks enforced.              |  
  | IR-1031    | 2024-03-31 | Well Site A-17 | Near Miss      | Slippery conditions on loading dock due to rain.                    | No injury                    | Anti-slip coating applied.                                  |  
  | IR-1032    | 2024-04-01 | Well Site A-17 | Safety         | Unattended hot surface near control panel.                           | No injury                    | Surface cooled; monitoring increased.                       |  
  | IR-1033    | 2024-04-02 | Well Site A-17 | Environmental  | Minor solvent spill in lab area.                                     | Spill contained               | Proper disposal measures followed.                          |  
  | IR-1034    | 2024-04-03 | Well Site A-17 | Safety         | Inadequate ventilation in work area observed.                        | No injury                    | Ventilation system checked and improved.                    |  
  | IR-1035    | 2024-04-04 | Well Site A-17 | Near Miss      | Unsecured guard rail on elevated platform.                           | No injury                    | Guard rail secured; inspection logged.                      |  
  | IR-1036    | 2024-04-05 | Well Site A-17 | Safety         | Worker reported dizziness near fuel pump area.                       | No injury                    | Area ventilated; incident documented.                       |  
  | IR-1037    | 2024-04-06 | Well Site A-17 | Environmental  | Small leak from containment sump detected.                           | Leak repaired                 | Sump integrity rechecked.                                   |  
  | IR-1038    | 2024-04-07 | Well Site A-17 | Safety         | Delayed reporting of equipment malfunction.                          | No injury                    | Reporting procedure re-emphasized.                          |  
  | IR-1039    | 2024-04-08 | Well Site A-17 | Near Miss      | Falling object narrowly missed personnel.                            | No injury                    | Drop zone established; training reiterated.                 |  
  | IR-1040    | 2024-04-09 | Well Site A-17 | Safety         | Failure of personal protective equipment noted.                      | No injury                    | PPE inspection increased; replacements ordered.             |  
  | IR-1041    | 2024-04-10 | Well Site A-17 | Environmental  | Unexpected emission from flaring unit recorded.                      | Emission within limits        | Continuous monitoring confirmed.                            |  
  | IR-1042    | 2024-04-11 | Well Site A-17 | Safety         | Worker tripped over uneven surface in yard.                         | No injury                    | Surface leveled; hazard communicated.                       |  
  | IR-1043    | 2024-04-12 | Well Site A-17 | Near Miss      | Brief communication loss in safety system.                           | No injury                    | System check completed; no fault found.                    |  
  | IR-1044    | 2024-04-13 | Well Site A-17 | Safety         | Operator fatigue led to delayed reaction during drill startup.       | No injury                    | Rest period enforced; schedule adjusted.                    |  
  | IR-1045    | 2024-04-14 | Well Site A-17 | Environmental  | Minor chemical splash during mixing operation.                       | No environmental impact       | Protective measures reinforced.                              |  
  | IR-1046    | 2024-04-15 | Well Site A-17 | Safety         | Inadequate signage near hazardous zone observed.                     | No injury                    | Signage updated; additional barriers installed.             |  
  | IR-1047    | 2024-04-16 | Well Site A-17 | Near Miss      | Service vehicle nearly collided with equipment.                      | No injury                    | Traffic management revised; incident reviewed.             |  
  | IR-1048    | 2024-04-17 | Well Site A-17 | Safety         | Worker experienced mild heat stress.                                 | No injury                    | Cooling protocols reviewed; hydration station added.       |  
  | IR-1049    | 2024-04-18 | Well Site A-17 | Environmental  | Minor leak in waste collection area detected.                       | Leak contained                | Waste management protocol updated.                          |  
  | IR-1050    | 2024-04-19 | Well Site A-17 | Safety         | Unplanned shutdown due to sensor failure.                            | No injury                    | Sensor maintenance scheduled; root cause analysis initiated.|  
  
  
  
  ### Dataset 2: Regulatory Updates for Incident Reporting & HSE Compliance
  
  | UpdateID | Date       | Agency | Title                                         | Summary                                                             | Impact                     |  
  |----------|------------|--------|-----------------------------------------------|---------------------------------------------------------------------|----------------------------|  
  | RU-2001  | 2024-03-01 | BSEE   | Expanded Incident Reporting Fields            | New guidelines require additional data fields for incident severity and root cause analysis. | Mandatory from Q2 2024    |  
  | RU-2002  | 2024-03-02 | EPA    | Revised Emission Reporting Requirements       | Lower threshold limits for volatile organic compounds and methane leaks. | Immediate compliance required |  
  | RU-2003  | 2024-03-03 | OSHA   | Updated Worker Safety Protocols               | Enhanced PPE requirements and emergency response training guidelines. | Phased implementation over 6 months |  
  | RU-2004  | 2024-03-04 | BSEE   | Incident Reporting Timeliness                 | Mandates incident report submission within 2 hours of occurrence.   | Effective immediately       |  
  | RU-2005  | 2024-03-05 | EPA    | Hazardous Material Storage Guidelines         | New storage protocols to prevent chemical spills and contamination.  | Mandatory from Q3 2024    |  
  | RU-2006  | 2024-03-06 | OSHA   | Revised Shift Management Standards            | New rules for shift rotations and mandatory rest breaks to reduce fatigue. | Phased over next quarter   |  
  | RU-2007  | 2024-03-07 | BSEE   | Enhanced Near Miss Reporting                  | Requires detailed documentation of near miss events including contributing factors. | Immediate effect           |  
  | RU-2008  | 2024-03-08 | EPA    | Air Quality Monitoring Standards              | Updated standards for continuous monitoring of emissions at production sites. | Compliance due Q3 2024    |  
  | RU-2009  | 2024-03-09 | OSHA   | Updated PPE Compliance Guidelines             | Clarifies PPE standards for high-temperature and hazardous areas.   | Immediate compliance        |  
  | RU-2010  | 2024-03-10 | BSEE   | Mandatory Post-Incident Reviews               | Requires comprehensive reviews and corrective action plans following any incident. | Effective immediately       |  
  | RU-2011  | 2024-03-11 | EPA    | Revised Spill Containment Requirements        | Stricter containment measures for minor spills to prevent environmental impact. | Mandatory from Q2 2024    |  
  | RU-2012  | 2024-03-12 | OSHA   | Updated Training Requirements                 | New training modules for emergency response and incident reporting.  | Phased rollout over 3 months |  
  | RU-2013  | 2024-03-13 | BSEE   | Incident Data Standardization                 | Standardizes incident report formats across all upstream facilities. | Immediate implementation    |  
  | RU-2014  | 2024-03-14 | EPA    | Enhanced Monitoring of Flaring Operations     | New guidelines for monitoring and reporting flaring emissions.      | Compliance due Q4 2024     |  
  | RU-2015  | 2024-03-15 | OSHA   | Revised Equipment Safety Checks               | Mandates regular safety audits for high-risk equipment.             | Immediate effect           |  
  | RU-2016  | 2024-03-16 | BSEE   | Near Miss Data Analytics Requirements         | Requires analytics on near miss incidents to predict potential failures. | Mandatory from Q3 2024    |  
  | RU-2017  | 2024-03-17 | EPA    | Chemical Usage Reporting Improvements         | Enhanced reporting standards for chemical usage in production.      | Immediate compliance        |  
  | RU-2018  | 2024-03-18 | OSHA   | Updated Emergency Shutdown Procedures         | New protocols for emergency shutdown to reduce downtime.            | Effective immediately       |  
  | RU-2019  | 2024-03-19 | BSEE   | Refined HSE Incident Classification           | Improved classification criteria for incidents to aid in trend analysis. | Immediate effect           |  
  | RU-2020  | 2024-03-20 | EPA    | Mandatory Calibration of Emission Sensors     | Requires periodic calibration of all emission monitoring equipment.  | Compliance due Q2 2024     |  
  | RU-2021  | 2024-03-21 | OSHA   | Updated Worker Fatigue Standards              | Introduces limits on overtime to mitigate fatigue risks.            | Phased implementation over 6 months |  
  | RU-2022  | 2024-03-22 | BSEE   | Expanded Root Cause Analysis Requirements     | Mandates root cause analysis for all incidents, including near misses. | Effective immediately       |  
  | RU-2023  | 2024-03-23 | EPA    | Revised Reporting for Minor Spills           | New thresholds for reporting minor chemical spills.                 | Immediate compliance        |  
  | RU-2024  | 2024-03-24 | OSHA   | Enhanced Hazard Communication Standards       | Requires detailed hazard communication for all chemicals used.      | Phased over next quarter   |  
  | RU-2025  | 2024-03-25 | BSEE   | Mandatory Incident Follow-Up Reviews          | Requires a follow-up review for every incident to verify corrective measures. | Immediate effect           |  
  | RU-2026  | 2024-03-26 | EPA    | Updated Guidelines for Waste Management       | New procedures for disposal and documentation of hazardous waste.   | Compliance due Q3 2024     |  
  | RU-2027  | 2024-03-27 | OSHA   | New Standards for Safety Signage              | Mandates clear signage for hazardous areas and emergency exits.     | Effective immediately       |  
  | RU-2028  | 2024-03-28 | BSEE   | Incident Reporting Automation Guidelines       | Encourages the use of automated systems for faster incident reporting. | Immediate implementation    |  
  | RU-2029  | 2024-03-29 | EPA    | Enhanced Water Contamination Protocols        | Stricter reporting requirements for water contamination incidents.   | Compliance due Q4 2024     |  
  | RU-2030  | 2024-03-30 | OSHA   | Updated Protocols for Equipment Malfunction Reporting | New protocols to report equipment malfunctions in real-time.     | Immediate effect           |  
  | RU-2031  | 2024-03-31 | BSEE   | Expanded Data Fields for Incident Reports     | Requires additional details such as operator actions and environmental conditions. | Mandatory from Q2 2024    |  
  | RU-2032  | 2024-04-01 | EPA    | Improved Air Quality Alert Systems            | New requirements for real-time air quality alert notifications.     | Effective immediately       |  
  | RU-2033  | 2024-04-02 | OSHA   | Revised Safety Audit Frequency                | Increases the frequency of mandatory safety audits for high-risk sites. | Phased over next 3 months  |  
  | RU-2034  | 2024-04-03 | BSEE   | Mandatory Safety Drills for Incident Response  | Requires quarterly safety drills and documentation.                | Immediate compliance        |  
  | RU-2035  | 2024-04-04 | EPA    | Updated Guidelines for Ventilation Systems    | New standards for monitoring and maintaining ventilation in production areas. | Compliance due Q3 2024     |  
  | RU-2036  | 2024-04-05 | OSHA   | Revised Incident Reporting Training            | Enhanced training for incident reporting and emergency response.    | Phased rollout over 2 months |  
  | RU-2037  | 2024-04-06 | BSEE   | Enhanced Control of Hazardous Energy         | New protocols for lockout/tagout procedures during maintenance.     | Effective immediately       |  
  | RU-2038  | 2024-04-07 | EPA    | Updated Spill Response Procedures             | Stricter procedures for immediate spill response and reporting.     | Immediate effect           |  
  | RU-2039  | 2024-04-08 | OSHA   | Improved Guidelines for Worker PPE Usage      | Mandates upgraded PPE standards for hazardous operations.           | Effective immediately       |  
  | RU-2040  | 2024-04-09 | BSEE   | Refined Incident Data Analytics Standards     | New analytics requirements to better predict future incidents.     | Mandatory from Q2 2024     |  
  | RU-2041  | 2024-04-10 | EPA    | Updated Chemical Spill Notification Procedures | Requires instant notification for spills exceeding threshold limits. | Immediate compliance        |  
  | RU-2042  | 2024-04-11 | OSHA   | Enhanced Machinery Safety Checks              | Mandates additional checks for high-risk machinery before operation. | Immediate effect           |  
  | RU-2043  | 2024-04-12 | BSEE   | Incident Reporting Quality Assurance Standards | Introduces QA measures for all submitted incident reports.          | Effective immediately       |  
  | RU-2044  | 2024-04-13 | EPA    | Revised Guidelines for Hazardous Air Pollutants | New reporting requirements for hazardous air pollutant emissions.  | Compliance due Q3 2024     |  
  | RU-2045  | 2024-04-14 | OSHA   | Updated Standards for Emergency Equipment     | Mandates regular testing and maintenance of emergency equipment.    | Immediate effect           |  
  | RU-2046  | 2024-04-15 | BSEE   | Enhanced Reporting for Near Misses           | Requires detailed documentation of near miss events with corrective actions. | Mandatory from Q2 2024    |  
  | RU-2047  | 2024-04-16 | EPA    | Revised Water Quality Monitoring Guidelines   | Updated protocols for monitoring and reporting water quality near production sites. | Compliance due Q4 2024     |  
  | RU-2048  | 2024-04-17 | OSHA   | New Standards for Contractor Safety Training  | Mandates specific safety training for all contractors on site.     | Immediate implementation    |  
  | RU-2049  | 2024-04-18 | BSEE   | Expanded Environmental Incident Documentation  | Requires comprehensive documentation of environmental incidents.    | Effective immediately       |  
  | RU-2050  | 2024-04-19 | EPA    | Updated Hazardous Waste Disposal Guidelines   | New guidelines for proper disposal and documentation of hazardous waste. | Compliance due Q2 2024     |  
  
  
  Reply "TERMINATE" in the end when everything is done.
  `,
        description:"An agent that Analyze trends in near misses, safety violations, and environmental events and has access to data for Internal Incident Reports for Well Site and  Regulatory Updates for BSEE, EPA and OSHA. Agent has access to all necessary data.",
        icon:"🎻",
        index_name:""
        },
  ];
// Market analysis scenario
export const agentsTeam4: Agent[] = [
    {
      input_key: "0001",
      type: "MagenticOne",
      name: "Coder",
      system_message: "",
      description: "",
      icon: "👨‍💻",
      index_name: ""
    },
    {
      input_key: "0002",
      type: "MagenticOne",
      name: "Executor",
      system_message: "",
      description: "",
      icon: "💻",
      index_name: ""
    },
    {
      input_key: "0003",
      type: "MagenticOne",
      name: "FileSurfer",
      system_message: "",
      description: "",
      icon: "📂",
      index_name: ""
    },
    {
      input_key: "0004",
      type: "MagenticOne",
      name: "WebSurfer",
      system_message: "",
      description: "",
      icon: "🏄‍♂️",
      index_name: ""
    },
    {
      input_key:"0006",
      type:"RAG",
      name:"OilGasKnowledge",
      system_message:"",
      description:"An agent that has access to a knowledge base of International Energy Agency (IEA) Analysis and forecast to 2030 and can handle RAG tasks, call this agent if you are getting questions on your knowledge base.",
      icon:"📖",
      index_name:"ag-demo-market"
      }
  ];

// FSI - Upsell scenario
export const agentsTeamFSI1: Agent[] = [
  {
    input_key: "0001",
    type: "MagenticOne",
    name: "Coder",
    system_message: "",
    description: "",
    icon: "👨‍💻",
    index_name: ""
  },
  {
    input_key: "0002",
    type: "MagenticOne",
    name: "Executor",
    system_message: "",
    description: "",
    icon: "💻",
    index_name: ""
  },
  {
    input_key: "0003",
    type: "MagenticOne",
    name: "FileSurfer",
    system_message: "",
    description: "",
    icon: "📂",
    index_name: ""
  },
  {
    input_key: "0004",
    type: "MagenticOne",
    name: "WebSurfer",
    system_message: "",
    description: "",
    icon: "🏄‍♂️",
    index_name: ""
  },
  {
    input_key:"0005",
    type:"Custom",
    name:"TransactionTrendAnalyzer",
    system_message:`
You are Transaction Trend Analyzer. Your task is to analyze the customer transaction data to identify patterns such as frequent overdrafts and rapid account balance declines. Detect anomalies like customers experiencing more than three overdrafts per month or a balance drop of 15% within 30 days. Your output should flag these customers and summarize the key transaction trends that indicate liquidity issues. 

Datasets

You are provided with detailed datasets. Your task is to analyze these datasets. No additional data needed.

### Dataset 1: Customer profiles

| CustomerID | Name               | Age | AccountBalance | OverdraftCount | CurrentLoanAmount | CreditScore | LastLoanDate |  
|------------|--------------------|-----|----------------|-----------------|-------------------|-------------|---------------|  
| C001       | John Doe           | 45  | 3950           | 1               | 5000              | 720         | 2023-11-15    |  
| C002       | Jane Smith         | 38  | 605            | 3               | 0                 | 680         | 2024-01-10    |  
| C003       | Robert Brown       | 50  | 935            | 2               | 15000             | 750         | 2023-12-05    |  
| C004       | Emily Davis        | 29  | 275            | 4               | 0                 | 640         | 2024-02-20    |  
| C005       | Michael Wilson     | 41  | 2595           | 1               | 8000              | 710         | 2023-10-30    |  
| C006       | Linda Johnson      | 55  | 270            | 3               | 12000             | 730         | 2023-12-25    |  
| C007       | William Lee        | 47  | 3570           | 0               | 20000             | 780         | 2023-09-15    |  
| C008       | Susan Clark        | 33  | 2050           | 2               | 0                 | 660         | 2024-01-05    |  
| C009       | Daniel Lewis       | 39  | 4500           | 1               | 10000             | 700         | 2023-11-20    |  
| C010       | Patricia Walker    | 52  | 3200           | 2               | 5000              | 710         | 2023-12-10    |  
| C011       | Christopher Hall   | 40  | 4800           | 0               | 0                 | 740         | 2024-02-01    |  
| C012       | Amanda Young       | 36  | 1500           | 3               | 0                 | 650         | 2024-01-15    |  
| C013       | Matthew King       | 44  | 5300           | 1               | 15000             | 760         | 2023-11-05    |  
| C014       | Jessica Wright     | 31  | 2800           | 2               | 3000              | 690         | 2024-02-12    |  
| C015       | Joshua Scott       | 48  | 6000           | 0               | 0                 | 770         | 2023-10-20    |  
| C016       | Olivia Green       | 42  | 2100           | 4               | 0                 | 660         | 2024-01-25    |  
| C017       | Andrew Baker       | 37  | 4700           | 1               | 10000             | 720         | 2023-12-22    |  
| C018       | Michelle Adams     | 50  | 3100           | 3               | 5000              | 700         | 2024-02-05    |  
| C019       | Brandon Nelson     | 46  | 5400           | 2               | 20000             | 740         | 2023-11-30    |  
| C020       | Ashley Carter      | 35  | 2300           | 5               | 0                 | 630         | 2024-01-08    |  
| C021       | Justin Mitchell     | 41  | 4900           | 1               | 15000             | 750         | 2023-10-28    |  
| C022       | Stephanie Perez    | 29  | 1800           | 3               | 0                 | 640         | 2024-02-14    |  
| C023       | Brian Roberts      | 53  | 6200           | 0               | 25000             | 780         | 2023-12-18    |  
| C024       | Sarah Turner       | 34  | 2600           | 2               | 0                 | 680         | 2024-01-20    |  
| C025       | Kevin Phillips     | 47  | 4500           | 1               | 10000             | 710         | 2023-11-12    |  
| C026       | Laura Campbell     | 38  | 2900           | 2               | 0                 | 660         | 2024-02-08    |  
| C027       | Steven Parker      | 42  | 5000           | 0               | 15000             | 740         | 2023-12-02    |  
| C028       | Kimberly Evans     | 45  | 3200           | 4               | 0                 | 650         | 2024-01-18    |  
| C029       | Timothy Edwards    | 50  | 5400           | 1               | 20000             | 770         | 2023-10-10    |  
| C030       | Rebecca Collins    | 39  | 3100           | 3               | 0                 | 680         | 2024-02-16    |  
| C031       | Jason Stewart      | 41  | 4600           | 0               | 10000             | 720         | 2023-11-07    |  
| C032       | Angela Sanchez     | 33  | 2700           | 2               | 0                 | 660         | 2024-01-30    |  
| C033       | Eric Morris        | 48  | 5500           | 1               | 15000             | 750         | 2023-12-27    |  
| C034       | Michelle Rogers    | 36  | 3000           | 3               | 0                 | 640         | 2024-02-03    |  
| C035       | Patrick Reed       | 44  | 4800           | 0               | 10000             | 710         | 2023-10-15    |  
| C036       | Laura Cook         | 38  | 3200           | 2               | 0                 | 660         | 2024-01-12    |  
| C037       | Mark Morgan        | 47  | 5300           | 1               | 15000             | 740         | 2023-12-08    |  
| C038       | Rachel Bell        | 31  | 2500           | 3               | 0                 | 650         | 2024-02-10    |  
| C039       | Scott Murphy       | 42  | 4700           | 0               | 10000             | 720         | 2023-11-22    |  
| C040       | Kimberly Bailey    | 35  | 2800           | 2               | 0                 | 660         | 2024-01-02    |  
| C041       | Gregory Rivera     | 49  | 5100           | 1               | 15000             | 750         | 2023-12-20    |  
| C042       | Rebecca Cooper     | 37  | 3000           | 3               | 0                 | 680         | 2024-02-06    |  
| C043       | Alexander Richardson| 46  | 5600           | 0               | 20000             | 770         | 2023-10-30    |  
| C044       | Victoria Cox       | 34  | 2900           | 2               | 0                 | 660         | 2024-01-27    |  
| C045       | Jordan Ward        | 41  | 4800           | 1               | 15000             | 740         | 2023-12-14    |  
| C046       | Erin Howard        | 39  | 2700           | 3               | 0                 | 650         | 2024-02-11    |  
| C047       | Samuel Flores      | 50  | 5400           | 0               | 20000             | 770         | 2023-11-18    |  
| C048       | Olivia Ramirez     | 32  | 3000           | 2               | 0                 | 660         | 2024-01-22    |  
| C049       | Douglas James      | 45  | 5100           | 1               | 15000             | 750         | 2023-12-09    |  
| C050       | Stephanie Watson    | 38  | 2800           | 3               | 0                 | 680         | 2024-02-03    |  


### Dataset 2: Transaction History
| TransactionID | CustomerID | Date       | TransactionAmount | TransactionType | Balance | Notes                         |  
|---------------|------------|------------|--------------------|------------------|---------|-------------------------------|  
| TX0001        | C001      | 2024-04-01 | 2000               | Deposit          | 5000    | Regular payroll deposit       |  
| TX0002        | C002      | 2024-04-01 | -150               | Withdrawal       | 1200    | ATM withdrawal                |  
| TX0003        | C003      | 2024-04-01 | -50                | Withdrawal       | 450     | POS purchase                  |  
| TX0004        | C001      | 2024-04-02 | -100               | Withdrawal       | 4900    | Utility payment               |  
| TX0005        | C004      | 2024-04-02 | -300               | Overdraft        | -50     | Overdraft occurred            |  
| TX0006        | C005      | 2024-04-02 | 1500               | Deposit          | 3000    | Salary deposit                |  
| TX0007        | C002      | 2024-04-03 | -200               | Withdrawal       | 1000    | POS purchase                  |  
| TX0008        | C003      | 2024-04-03 | 500                | Deposit          | 950     | Refund deposit                |  
| TX0009        | C006      | 2024-04-03 | -400               | Overdraft        | -20     | Overdraft occurred            |  
| TX0010        | C007      | 2024-04-03 | 1200               | Deposit          | 2500    | Freelance income              |  
| TX0011        | C001      | 2024-04-04 | -250               | Withdrawal       | 4650    | Rent payment                  |  
| TX0012        | C004      | 2024-04-04 | 800                | Deposit          | 750     | Bonus deposit                 |  
| TX0013        | C005      | 2024-04-04 | -100               | Withdrawal       | 2900    | Online purchase               |  
| TX0014        | C008      | 2024-04-04 | 1000               | Deposit          | 1800    | Salary deposit                |  
| TX0015        | C002      | 2024-04-05 | -50                | Withdrawal       | 950     | Coffee shop purchase          |  
| TX0016        | C003      | 2024-04-05 | -60                | Withdrawal       | 890     | Groceries                     |  
| TX0017        | C006      | 2024-04-05 | -150               | Overdraft        | -70     | Overdraft occurred            |  
| TX0018        | C007      | 2024-04-05 | -100               | Withdrawal       | 2400    | Restaurant bill               |  
| TX0019        | C001      | 2024-04-06 | -300               | Withdrawal       | 4350    | Car payment                   |  
| TX0020        | C004      | 2024-04-06 | -100               | Withdrawal       | 650     | ATM withdrawal                |  
| TX0021        | C008      | 2024-04-06 | -200               | Withdrawal       | 1600    | Bill payment                  |  
| TX0022        | C002      | 2024-04-07 | -75                | Withdrawal       | 875     | Online shopping               |  
| TX0023        | C005      | 2024-04-07 | -50                | Withdrawal       | 2850    | POS purchase                  |  
| TX0024        | C003      | 2024-04-07 | -100               | Withdrawal       | 790     | Utility bill                  |  
| TX0025        | C006      | 2024-04-07 | 400                | Deposit          | 380     | Refund deposit                |  
| TX0026        | C007      | 2024-04-07 | -150               | Withdrawal       | 2250    | Travel expense                |  
| TX0027        | C001      | 2024-04-08 | -100               | Withdrawal       | 4250    | Credit card payment           |  
| TX0028        | C004      | 2024-04-08 | -250               | Overdraft        | -25     | Overdraft occurred            |  
| TX0029        | C008      | 2024-04-08 | 600                | Deposit          | 2200    | Salary bonus                  |  
| TX0030        | C002      | 2024-04-09 | -120               | Withdrawal       | 755     | Shopping                      |  
| TX0031        | C005      | 2024-04-09 | -80                | Withdrawal       | 2770    | Subscription fee              |  
| TX0032        | C003      | 2024-04-09 | 300                | Deposit          | 1090    | Side business income          |  
| TX0033        | C006      | 2024-04-09 | -200               | Overdraft        | -90     | Overdraft occurred            |  
| TX0034        | C007      | 2024-04-09 | -60                | Withdrawal       | 2190    | Cafe purchase                 |  
| TX0035        | C001      | 2024-04-10 | -300               | Withdrawal       | 3950    | Rent payment                  |  
| TX0036        | C004      | 2024-04-10 | 500                | Deposit          | 475     | Bonus deposit                 |  
| TX0037        | C008      | 2024-04-10 | -100               | Withdrawal       | 2100    | Utility payment               |  
| TX0038        | C002      | 2024-04-10 | -50                | Withdrawal       | 705     | Coffee purchase               |  
| TX0039        | C005      | 2024-04-10 | -100               | Withdrawal       | 2670    | Online shopping               |  
| TX0040        | C003      | 2024-04-11 | -75                | Withdrawal       | 1015    | Groceries                     |  
| TX0041        | C006      | 2024-04-11 | -100               | Overdraft        | -30     | Overdraft occurred            |  
| TX0042        | C007      | 2024-04-11 | 1500               | Deposit          | 3690    | Project income                |  
| TX0043        | C001      | 2024-04-11 | -150               | Withdrawal       | 3800    | Car maintenance               |  
| TX0044        | C004      | 2024-04-11 | -200               | Withdrawal       | 275     | POS purchase                  |  
| TX0045        | C008      | 2024-04-11 | -50                | Withdrawal       | 2050    | Credit card payment           |  
| TX0046        | C002      | 2024-04-12 | -100               | Withdrawal       | 605     | ATM withdrawal                |  
| TX0047        | C005      | 2024-04-12 | -75                | Withdrawal       | 2595    | Utility bill                  |  
| TX0048        | C003      | 2024-04-12 | -80                | Withdrawal       | 935     | Restaurant expense            |  
| TX0049        | C006      | 2024-04-12 | 300                | Deposit          | 270     | Refund deposit                |  
| TX0050        | C007      | 2024-04-12 | -120               | Withdrawal       | 3570    | Travel expense                |  


Reply "TERMINATE" in the end when everything is done.
`,
    description:"An Transaction Trend Analyzer agent, who identifies patterns such as frequent overdrafts and rapid account balance declines. Agent has access to all necessary data.",
    icon:"🎻",
    index_name:""
    },
  {
    input_key:"0006",
    type:"RAG",
    name:"KBAgent",
    system_message:"",
    description:"An agent that has access to internal index and can handle RAG tasks, call this agent if you are getting questions on Experian Credit Risk Scorecard with risk tresholds, etc..",
    icon:"📖",
    index_name:"ag-demo-fsi-upsell"
    },
    {
      input_key:"0007",
      type:"Custom",
      name:"CreditOpportunityRecommender",
      system_message:`
You are Credit Opportunity Recommender. Your role is to integrate the flagged transaction trends with customer profile data – use data analysis done by Transaction Trend Analyzer agent and by using risk thresholds from the Experian Credit Risk Scorecard PDF. Generate personalized loan upsell recommendations by identifying customers who would benefit from additional credit. Your recommendations should include tailored product suggestions (such as higher credit lines or flexible personal loans) based on each customer’s financial behavior and overall credit profile..

Datasets

You are provided with detailed datasets. Your task is to analyze these datasets. No additional data needed.

### Dataset 1: Customer profiles

| CustomerID | Name               | Age | AccountBalance | OverdraftCount | CurrentLoanAmount | CreditScore | LastLoanDate |  
|------------|--------------------|-----|----------------|-----------------|-------------------|-------------|---------------|  
| C001       | John Doe           | 45  | 3950           | 1               | 5000              | 720         | 2023-11-15    |  
| C002       | Jane Smith         | 38  | 605            | 3               | 0                 | 680         | 2024-01-10    |  
| C003       | Robert Brown       | 50  | 935            | 2               | 15000             | 750         | 2023-12-05    |  
| C004       | Emily Davis        | 29  | 275            | 4               | 0                 | 640         | 2024-02-20    |  
| C005       | Michael Wilson     | 41  | 2595           | 1               | 8000              | 710         | 2023-10-30    |  
| C006       | Linda Johnson      | 55  | 270            | 3               | 12000             | 730         | 2023-12-25    |  
| C007       | William Lee        | 47  | 3570           | 0               | 20000             | 780         | 2023-09-15    |  
| C008       | Susan Clark        | 33  | 2050           | 2               | 0                 | 660         | 2024-01-05    |  
| C009       | Daniel Lewis       | 39  | 4500           | 1               | 10000             | 700         | 2023-11-20    |  
| C010       | Patricia Walker    | 52  | 3200           | 2               | 5000              | 710         | 2023-12-10    |  
| C011       | Christopher Hall   | 40  | 4800           | 0               | 0                 | 740         | 2024-02-01    |  
| C012       | Amanda Young       | 36  | 1500           | 3               | 0                 | 650         | 2024-01-15    |  
| C013       | Matthew King       | 44  | 5300           | 1               | 15000             | 760         | 2023-11-05    |  
| C014       | Jessica Wright     | 31  | 2800           | 2               | 3000              | 690         | 2024-02-12    |  
| C015       | Joshua Scott       | 48  | 6000           | 0               | 0                 | 770         | 2023-10-20    |  
| C016       | Olivia Green       | 42  | 2100           | 4               | 0                 | 660         | 2024-01-25    |  
| C017       | Andrew Baker       | 37  | 4700           | 1               | 10000             | 720         | 2023-12-22    |  
| C018       | Michelle Adams     | 50  | 3100           | 3               | 5000              | 700         | 2024-02-05    |  
| C019       | Brandon Nelson     | 46  | 5400           | 2               | 20000             | 740         | 2023-11-30    |  
| C020       | Ashley Carter      | 35  | 2300           | 5               | 0                 | 630         | 2024-01-08    |  
| C021       | Justin Mitchell     | 41  | 4900           | 1               | 15000             | 750         | 2023-10-28    |  
| C022       | Stephanie Perez    | 29  | 1800           | 3               | 0                 | 640         | 2024-02-14    |  
| C023       | Brian Roberts      | 53  | 6200           | 0               | 25000             | 780         | 2023-12-18    |  
| C024       | Sarah Turner       | 34  | 2600           | 2               | 0                 | 680         | 2024-01-20    |  
| C025       | Kevin Phillips     | 47  | 4500           | 1               | 10000             | 710         | 2023-11-12    |  
| C026       | Laura Campbell     | 38  | 2900           | 2               | 0                 | 660         | 2024-02-08    |  
| C027       | Steven Parker      | 42  | 5000           | 0               | 15000             | 740         | 2023-12-02    |  
| C028       | Kimberly Evans     | 45  | 3200           | 4               | 0                 | 650         | 2024-01-18    |  
| C029       | Timothy Edwards    | 50  | 5400           | 1               | 20000             | 770         | 2023-10-10    |  
| C030       | Rebecca Collins    | 39  | 3100           | 3               | 0                 | 680         | 2024-02-16    |  
| C031       | Jason Stewart      | 41  | 4600           | 0               | 10000             | 720         | 2023-11-07    |  
| C032       | Angela Sanchez     | 33  | 2700           | 2               | 0                 | 660         | 2024-01-30    |  
| C033       | Eric Morris        | 48  | 5500           | 1               | 15000             | 750         | 2023-12-27    |  
| C034       | Michelle Rogers    | 36  | 3000           | 3               | 0                 | 640         | 2024-02-03    |  
| C035       | Patrick Reed       | 44  | 4800           | 0               | 10000             | 710         | 2023-10-15    |  
| C036       | Laura Cook         | 38  | 3200           | 2               | 0                 | 660         | 2024-01-12    |  
| C037       | Mark Morgan        | 47  | 5300           | 1               | 15000             | 740         | 2023-12-08    |  
| C038       | Rachel Bell        | 31  | 2500           | 3               | 0                 | 650         | 2024-02-10    |  
| C039       | Scott Murphy       | 42  | 4700           | 0               | 10000             | 720         | 2023-11-22    |  
| C040       | Kimberly Bailey    | 35  | 2800           | 2               | 0                 | 660         | 2024-01-02    |  
| C041       | Gregory Rivera     | 49  | 5100           | 1               | 15000             | 750         | 2023-12-20    |  
| C042       | Rebecca Cooper     | 37  | 3000           | 3               | 0                 | 680         | 2024-02-06    |  
| C043       | Alexander Richardson| 46  | 5600           | 0               | 20000             | 770         | 2023-10-30    |  
| C044       | Victoria Cox       | 34  | 2900           | 2               | 0                 | 660         | 2024-01-27    |  
| C045       | Jordan Ward        | 41  | 4800           | 1               | 15000             | 740         | 2023-12-14    |  
| C046       | Erin Howard        | 39  | 2700           | 3               | 0                 | 650         | 2024-02-11    |  
| C047       | Samuel Flores      | 50  | 5400           | 0               | 20000             | 770         | 2023-11-18    |  
| C048       | Olivia Ramirez     | 32  | 3000           | 2               | 0                 | 660         | 2024-01-22    |  
| C049       | Douglas James      | 45  | 5100           | 1               | 15000             | 750         | 2023-12-09    |  
| C050       | Stephanie Watson    | 38  | 2800           | 3               | 0                 | 680         | 2024-02-03    |  


### Dataset 2: Transaction History
| TransactionID | CustomerID | Date       | TransactionAmount | TransactionType | Balance | Notes                         |  
|---------------|------------|------------|--------------------|------------------|---------|-------------------------------|  
| TX0001        | C001      | 2024-04-01 | 2000               | Deposit          | 5000    | Regular payroll deposit       |  
| TX0002        | C002      | 2024-04-01 | -150               | Withdrawal       | 1200    | ATM withdrawal                |  
| TX0003        | C003      | 2024-04-01 | -50                | Withdrawal       | 450     | POS purchase                  |  
| TX0004        | C001      | 2024-04-02 | -100               | Withdrawal       | 4900    | Utility payment               |  
| TX0005        | C004      | 2024-04-02 | -300               | Overdraft        | -50     | Overdraft occurred            |  
| TX0006        | C005      | 2024-04-02 | 1500               | Deposit          | 3000    | Salary deposit                |  
| TX0007        | C002      | 2024-04-03 | -200               | Withdrawal       | 1000    | POS purchase                  |  
| TX0008        | C003      | 2024-04-03 | 500                | Deposit          | 950     | Refund deposit                |  
| TX0009        | C006      | 2024-04-03 | -400               | Overdraft        | -20     | Overdraft occurred            |  
| TX0010        | C007      | 2024-04-03 | 1200               | Deposit          | 2500    | Freelance income              |  
| TX0011        | C001      | 2024-04-04 | -250               | Withdrawal       | 4650    | Rent payment                  |  
| TX0012        | C004      | 2024-04-04 | 800                | Deposit          | 750     | Bonus deposit                 |  
| TX0013        | C005      | 2024-04-04 | -100               | Withdrawal       | 2900    | Online purchase               |  
| TX0014        | C008      | 2024-04-04 | 1000               | Deposit          | 1800    | Salary deposit                |  
| TX0015        | C002      | 2024-04-05 | -50                | Withdrawal       | 950     | Coffee shop purchase          |  
| TX0016        | C003      | 2024-04-05 | -60                | Withdrawal       | 890     | Groceries                     |  
| TX0017        | C006      | 2024-04-05 | -150               | Overdraft        | -70     | Overdraft occurred            |  
| TX0018        | C007      | 2024-04-05 | -100               | Withdrawal       | 2400    | Restaurant bill               |  
| TX0019        | C001      | 2024-04-06 | -300               | Withdrawal       | 4350    | Car payment                   |  
| TX0020        | C004      | 2024-04-06 | -100               | Withdrawal       | 650     | ATM withdrawal                |  
| TX0021        | C008      | 2024-04-06 | -200               | Withdrawal       | 1600    | Bill payment                  |  
| TX0022        | C002      | 2024-04-07 | -75                | Withdrawal       | 875     | Online shopping               |  
| TX0023        | C005      | 2024-04-07 | -50                | Withdrawal       | 2850    | POS purchase                  |  
| TX0024        | C003      | 2024-04-07 | -100               | Withdrawal       | 790     | Utility bill                  |  
| TX0025        | C006      | 2024-04-07 | 400                | Deposit          | 380     | Refund deposit                |  
| TX0026        | C007      | 2024-04-07 | -150               | Withdrawal       | 2250    | Travel expense                |  
| TX0027        | C001      | 2024-04-08 | -100               | Withdrawal       | 4250    | Credit card payment           |  
| TX0028        | C004      | 2024-04-08 | -250               | Overdraft        | -25     | Overdraft occurred            |  
| TX0029        | C008      | 2024-04-08 | 600                | Deposit          | 2200    | Salary bonus                  |  
| TX0030        | C002      | 2024-04-09 | -120               | Withdrawal       | 755     | Shopping                      |  
| TX0031        | C005      | 2024-04-09 | -80                | Withdrawal       | 2770    | Subscription fee              |  
| TX0032        | C003      | 2024-04-09 | 300                | Deposit          | 1090    | Side business income          |  
| TX0033        | C006      | 2024-04-09 | -200               | Overdraft        | -90     | Overdraft occurred            |  
| TX0034        | C007      | 2024-04-09 | -60                | Withdrawal       | 2190    | Cafe purchase                 |  
| TX0035        | C001      | 2024-04-10 | -300               | Withdrawal       | 3950    | Rent payment                  |  
| TX0036        | C004      | 2024-04-10 | 500                | Deposit          | 475     | Bonus deposit                 |  
| TX0037        | C008      | 2024-04-10 | -100               | Withdrawal       | 2100    | Utility payment               |  
| TX0038        | C002      | 2024-04-10 | -50                | Withdrawal       | 705     | Coffee purchase               |  
| TX0039        | C005      | 2024-04-10 | -100               | Withdrawal       | 2670    | Online shopping               |  
| TX0040        | C003      | 2024-04-11 | -75                | Withdrawal       | 1015    | Groceries                     |  
| TX0041        | C006      | 2024-04-11 | -100               | Overdraft        | -30     | Overdraft occurred            |  
| TX0042        | C007      | 2024-04-11 | 1500               | Deposit          | 3690    | Project income                |  
| TX0043        | C001      | 2024-04-11 | -150               | Withdrawal       | 3800    | Car maintenance               |  
| TX0044        | C004      | 2024-04-11 | -200               | Withdrawal       | 275     | POS purchase                  |  
| TX0045        | C008      | 2024-04-11 | -50                | Withdrawal       | 2050    | Credit card payment           |  
| TX0046        | C002      | 2024-04-12 | -100               | Withdrawal       | 605     | ATM withdrawal                |  
| TX0047        | C005      | 2024-04-12 | -75                | Withdrawal       | 2595    | Utility bill                  |  
| TX0048        | C003      | 2024-04-12 | -80                | Withdrawal       | 935     | Restaurant expense            |  
| TX0049        | C006      | 2024-04-12 | 300                | Deposit          | 270     | Refund deposit                |  
| TX0050        | C007      | 2024-04-12 | -120               | Withdrawal       | 3570    | Travel expense                |  



Reply "TERMINATE" in the end when everything is done.
`,
      description:"An agent integrate the flagged transaction trends with customer profile data from data analysis done by Transaction Trend Analyzer agent. Agent has access to all necessary data.",
      icon:"🎻",
      index_name:""
      },
];


// FSI - Upsell scenario
export const agentsTeamRetail1: Agent[] = [
  {
    input_key: "0001",
    type: "MagenticOne",
    name: "Coder",
    system_message: "",
    description: "",
    icon: "👨‍💻",
    index_name: ""
  },
  {
    input_key: "0002",
    type: "MagenticOne",
    name: "Executor",
    system_message: "",
    description: "",
    icon: "💻",
    index_name: ""
  },
  {
    input_key: "0003",
    type: "MagenticOne",
    name: "FileSurfer",
    system_message: "",
    description: "",
    icon: "📂",
    index_name: ""
  },
  {
    input_key: "0004",
    type: "MagenticOne",
    name: "WebSurfer",
    system_message: "",
    description: "",
    icon: "🏄‍♂️",
    index_name: ""
  },
  {
    input_key:"0005",
    type:"Custom",
    name:"InventoryMonitor",
    system_message:`
You are Inventory Monitor. Your primary responsibility is to continuously analyze real‑time inventory data for cinema concessions. Monitor stock levels against the reorder points provided in the inventory table. Flag any items where current inventory is at or below the reorder threshold. Always reference the Microsoft Dynamics 365 Retail Inventory & Supply Chain Optimization Best Practices Guide 2024 to ensure optimal restocking strategies. 

Datasets

You are provided with detailed datasets. Your task is to analyze these datasets. No additional data needed.

### Dataset 1: Inventory data

| Timestamp           | Location  | ItemID | ItemName           | CurrentInventory | ReorderPoint | LeadTimeDays |  
|---------------------|-----------|--------|---------------------|------------------|--------------|---------------|  
| 2024-06-01 10:00    | Cinema A1 | POP001 | Popcorn (Large)     | 120              | 100          | 22            |  
| 2024-06-01 10:00    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 200              | 180          | 12            |  
| 2024-06-01 10:00    | Cinema A1 | CND001 | Candy Mix           | 80               | 75           | 3             |  
| 2024-06-01 10:00    | Cinema A1 | NCH001 | Nachos              | 45               | 50           | 22            |  
| 2024-06-01 10:00    | Cinema A1 | HOT001 | Hotdog              | 60               | 55           | 22            |  
| 2024-06-01 10:05    | Cinema A1 | POP001 | Popcorn (Large)     | 115              | 100          | 22            |  
| 2024-06-01 10:05    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 195              | 180          | 12            |  
| 2024-06-01 10:05    | Cinema A1 | CND001 | Candy Mix           | 78               | 75           | 3             |  
| 2024-06-01 10:05    | Cinema A1 | NCH001 | Nachos              | 47               | 50           | 22            |  
| 2024-06-01 10:05    | Cinema A1 | HOT001 | Hotdog              | 62               | 55           | 22            |  
| 2024-06-01 10:10    | Cinema A1 | POP001 | Popcorn (Large)     | 110              | 100          | 22            |  
| 2024-06-01 10:10    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 190              | 180          | 12            |  
| 2024-06-01 10:10    | Cinema A1 | CND001 | Candy Mix           | 76               | 75           | 3             |  
| 2024-06-01 10:10    | Cinema A1 | NCH001 | Nachos              | 46               | 50           | 22            |  
| 2024-06-01 10:10    | Cinema A1 | HOT001 | Hotdog              | 64               | 55           | 22            |  
| 2024-06-01 10:15    | Cinema A1 | POP001 | Popcorn (Large)     | 105              | 100          | 22            |  
| 2024-06-01 10:15    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 185              | 180          | 12            |  
| 2024-06-01 10:15    | Cinema A1 | CND001 | Candy Mix           | 74               | 75           | 3             |  
| 2024-06-01 10:15    | Cinema A1 | NCH001 | Nachos              | 44               | 50           | 22            |  
| 2024-06-01 10:15    | Cinema A1 | HOT001 | Hotdog              | 66               | 55           | 22            |  
| 2024-06-01 10:20    | Cinema A1 | POP001 | Popcorn (Large)     | 95               | 100          | 22            |  
| 2024-06-01 10:20    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 180              | 180          | 12            |  
| 2024-06-01 10:20    | Cinema A1 | CND001 | Candy Mix           | 72               | 75           | 3             |  
| 2024-06-01 10:20    | Cinema A1 | NCH001 | Nachos              | 42               | 50           | 22            |  
| 2024-06-01 10:20    | Cinema A1 | HOT001 | Hotdog              | 68               | 55           | 22            |  
| 2024-06-01 10:25    | Cinema A1 | POP001 | Popcorn (Large)     | 90               | 100          | 22            |  
| 2024-06-01 10:25    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 175              | 180          | 12            |  
| 2024-06-01 10:25    | Cinema A1 | CND001 | Candy Mix           | 70               | 75           | 3             |  
| 2024-06-01 10:25    | Cinema A1 | NCH001 | Nachos              | 40               | 50           | 22            |  
| 2024-06-01 10:25    | Cinema A1 | HOT001 | Hotdog              | 70               | 55           | 22            |  
| 2024-06-01 10:30    | Cinema A1 | POP001 | Popcorn (Large)     | 85               | 100          | 22            |  
| 2024-06-01 10:30    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 170              | 180          | 12            |  
| 2024-06-01 10:30    | Cinema A1 | CND001 | Candy Mix           | 68               | 75           | 3             |  
| 2024-06-01 10:30    | Cinema A1 | NCH001 | Nachos              | 38               | 50           | 22            |  
| 2024-06-01 10:30    | Cinema A1 | HOT001 | Hotdog              | 72               | 55           | 22            |  
| 2024-06-01 10:35    | Cinema A1 | POP001 | Popcorn (Large)     | 80               | 100          | 22            |  
| 2024-06-01 10:35    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 165              | 180          | 12            |  
| 2024-06-01 10:35    | Cinema A1 | CND001 | Candy Mix           | 66               | 75           | 3             |  
| 2024-06-01 10:35    | Cinema A1 | NCH001 | Nachos              | 36               | 50           | 22            |  
| 2024-06-01 10:35    | Cinema A1 | HOT001 | Hotdog              | 74               | 55           | 22            |  
| 2024-06-01 10:40    | Cinema A1 | POP001 | Popcorn (Large)     | 75               | 100          | 22            |  
| 2024-06-01 10:40    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 160              | 180          | 12            |  
| 2024-06-01 10:40    | Cinema A1 | CND001 | Candy Mix           | 64               | 75           | 3             |  
| 2024-06-01 10:40    | Cinema A1 | NCH001 | Nachos              | 34               | 50           | 22            |  
| 2024-06-01 10:40    | Cinema A1 | HOT001 | Hotdog              | 76               | 55           | 22            |  
| 2024-06-01 10:45    | Cinema A1 | POP001 | Popcorn (Large)     | 70               | 100          | 22            |  
| 2024-06-01 10:45    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 155              | 180          | 12            |  
| 2024-06-01 10:45    | Cinema A1 | CND001 | Candy Mix           | 62               | 75           | 3             |  
| 2024-06-01 10:45    | Cinema A1 | NCH001 | Nachos              | 32               | 50           | 22            |  
| 2024-06-01 10:45    | Cinema A1 | HOT001 | Hotdog              | 78               | 55           | 22            |  
| 2024-06-01 10:50    | Cinema A1 | POP001 | Popcorn (Large)     | 65               | 100          | 22            |  
| 2024-06-01 10:50    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 150              | 180          | 12            |  
| 2024-06-01 10:50    | Cinema A1 | CND001 | Candy Mix           | 60               | 75           | 3             |  
| 2024-06-01 10:50    | Cinema A1 | NCH001 | Nachos              | 30               | 50           | 22            |  
| 2024-06-01 10:50    | Cinema A1 | HOT001 | Hotdog              | 80               | 55           | 22            |  
| 2024-06-01 10:55    | Cinema A1 | POP001 | Popcorn (Large)     | 60               | 100          | 22            |  
| 2024-06-01 10:55    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 145              | 180          | 12            |  
| 2024-06-01 10:55    | Cinema A1 | CND001 | Candy Mix           | 58               | 75           | 3             |  
| 2024-06-01 10:55    | Cinema A1 | NCH001 | Nachos              | 28               | 50           | 22            |  
| 2024-06-01 10:55    | Cinema A1 | HOT001 | Hotdog              | 82               | 55           | 22            |  
| 2024-06-01 11:00    | Cinema A1 | POP001 | Popcorn (Large)     | 55               | 100          | 22            |  
| 2024-06-01 11:00    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 140              | 180          | 12            |  
| 2024-06-01 11:00    | Cinema A1 | CND001 | Candy Mix           | 56               | 75           | 3             |  
| 2024-06-01 11:00    | Cinema A1 | NCH001 | Nachos              | 26               | 50           | 22            |  
| 2024-06-01 11:00    | Cinema A1 | HOT001 | Hotdog              | 84               | 55           | 2             |  

### Dataset 2: Sales data
| Timestamp           | Location   | ItemID | ItemName            | UnitsSold | SalesPrice | TransactionCount |  
|---------------------|------------|--------|---------------------|-----------|------------|-------------------|  
| 2024-06-01 10:00    | Cinema A1  | POP001 | Popcorn (Large)     | 15        | 8.50       | 520               |  
| 2024-06-01 10:00    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 25        | 3.00       | 820               |  
| 2024-06-01 10:00    | Cinema A1  | CND001 | Candy Mix           | 10        | 4.00       | 320               |  
| 2024-06-01 10:00    | Cinema A1  | NCH001 | Nachos              | 5         | 6.50       | 220               |  
| 2024-06-01 10:00    | Cinema A1  | HOT001 | Hotdog              | 7         | 5.50       | 320               |  
| 2024-06-01 10:05    | Cinema A1  | POP001 | Popcorn (Large)     | 13        | 8.50       | 420               |  
| 2024-06-01 10:05    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 22        | 3.00       | 720               |  
| 2024-06-01 10:05    | Cinema A1  | CND001 | Candy Mix           | 12        | 4.00       | 420               |  
| 2024-06-01 10:05    | Cinema A1  | NCH001 | Nachos              | 6         | 6.50       | 220               |  
| 2024-06-01 10:05    | Cinema A1  | HOT001 | Hotdog              | 8         | 5.50       | 320               |  
| 2024-06-01 10:10    | Cinema A1  | POP001 | Popcorn (Large)     | 20        | 8.50       | 720               |  
| 2024-06-01 10:10    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 30        | 3.00       | 1020              |  
| 2024-06-01 10:10    | Cinema A1  | CND001 | Candy Mix           | 15        | 4.00       | 520               |  
| 2024-06-01 10:10    | Cinema A1  | NCH001 | Nachos              | 8         | 6.50       | 320               |  
| 2024-06-01 10:10    | Cinema A1  | HOT001 | Hotdog              | 10        | 5.50       | 420               |  
| 2024-06-01 10:15    | Cinema A1  | POP001 | Popcorn (Large)     | 18        | 8.50       | 620               |  
| 2024-06-01 10:15    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 28        | 3.00       | 920               |  
| 2024-06-01 10:15    | Cinema A1  | CND001 | Candy Mix           | 14        | 4.00       | 420               |  
| 2024-06-01 10:15    | Cinema A1  | NCH001 | Nachos              | 7         | 6.50       | 320               |  
| 2024-06-01 10:15    | Cinema A1  | HOT001 | Hotdog              | 9         | 5.50       | 320               |  
| 2024-06-01 10:20    | Cinema A1  | POP001 | Popcorn (Large)     | 12        | 8.50       | 520               |  
| 2024-06-01 10:20    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 26        | 3.00       | 820               |  
| 2024-06-01 10:20    | Cinema A1  | CND001 | Candy Mix           | 10        | 4.00       | 320               |  
| 2024-06-01 10:20    | Cinema A1  | NCH001 | Nachos              | 4         | 6.50       | 220               |  
| 2024-06-01 10:20    | Cinema A1  | HOT001 | Hotdog              | 6         | 5.50       | 320               |  
| 2024-06-01 10:25    | Cinema A1  | POP001 | Popcorn (Large)     | 10        | 8.50       | 420               |  
| 2024-06-01 10:25    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 24        | 3.00       | 720               |  
| 2024-06-01 10:25    | Cinema A1  | CND001 | Candy Mix           | 8         | 4.00       | 320               |  
| 2024-06-01 10:25    | Cinema A1  | NCH001 | Nachos              | 3         | 6.50       | 220               |  
| 2024-06-01 10:25    | Cinema A1  | HOT001 | Hotdog              | 5         | 5.50       | 220               |  
| 2024-06-01 10:30    | Cinema A1  | POP001 | Popcorn (Large)     | 8         | 8.50       | 320               |  
| 2024-06-01 10:30    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 22        | 3.00       | 720               |  
| 2024-06-01 10:30    | Cinema A1  | CND001 | Candy Mix           | 7         | 4.00       | 320               |  
| 2024-06-01 10:30    | Cinema A1  | NCH001 | Nachos              | 4         | 6.50       | 220               |  
| 2024-06-01 10:30    | Cinema A1  | HOT001 | Hotdog              | 6         | 5.50       | 320               |  
| 2024-06-01 10:35    | Cinema A1  | POP001 | Popcorn (Large)     | 6         | 8.50       | 320               |  
| 2024-06-01 10:35    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 20        | 3.00       | 620               |  
| 2024-06-01 10:35    | Cinema A1  | CND001 | Candy Mix           | 6         | 4.00       | 220               |  
| 2024-06-01 10:35    | Cinema A1  | NCH001 | Nachos              | 3         | 6.50       | 220               |  
| 2024-06-01 10:35    | Cinema A1  | HOT001 | Hotdog              | 5         | 5.50       | 220               |  
| 2024-06-01 10:40    | Cinema A1  | POP001 | Popcorn (Large)     | 5         | 8.50       | 220               |  
| 2024-06-01 10:40    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 18        | 3.00       | 620               |  
| 2024-06-01 10:40    | Cinema A1  | CND001 | Candy Mix           | 5         | 4.00       | 220               |  
| 2024-06-01 10:40    | Cinema A1  | NCH001 | Nachos              | 3         | 6.50       | 220               |  
| 2024-06-01 10:40    | Cinema A1  | HOT001 | Hotdog              | 4         | 5.50       | 220               |  
| 2024-06-01 10:45    | Cinema A1  | POP001 | Popcorn (Large)     | 4         | 8.50       | 220               |  
| 2024-06-01 10:45    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 16        | 3.00       | 520               |  
| 2024-06-01 10:45    | Cinema A1  | CND001 | Candy Mix           | 4         | 4.00       | 220               |  
| 2024-06-01 10:45    | Cinema A1  | NCH001 | Nachos              | 2         | 6.50       | 120               |  
| 2024-06-01 10:45    | Cinema A1  | HOT001 | Hotdog              | 3         | 5.50       | 120               |  
| 2024-06-01 10:50    | Cinema A1  | POP001 | Popcorn (Large)     | 3         | 8.50       | 120               |  
| 2024-06-01 10:50    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 15        | 3.00       | 520               |  
| 2024-06-01 10:50    | Cinema A1  | CND001 | Candy Mix           | 3         | 4.00       | 120               |  
| 2024-06-01 10:50    | Cinema A1  | NCH001 | Nachos              | 2         | 6.50       | 120               |  
| 2024-06-01 10:50    | Cinema A1  | HOT001 | Hotdog              | 3         | 5.50       | 120               |  
| 2024-06-01 10:55    | Cinema A1  | POP001 | Popcorn (Large)     | 2         | 8.50       | 120               |  
| 2024-06-01 10:55    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 14        | 3.00       | 520               |  
| 2024-06-01 10:55    | Cinema A1  | CND001 | Candy Mix           | 2         | 4.00       | 120               |  
| 2024-06-01 10:55    | Cinema A1  | NCH001 | Nachos              | 1         | 6.50       | 120               |  
| 2024-06-01 10:55    | Cinema A1  | HOT001 | Hotdog              | 2         | 5.50       | 120               |  
| 2024-06-01 11:00    | Cinema A1  | POP001 | Popcorn (Large)     | 2         | 8.50       | 120               |  
| 2024-06-01 11:00    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 13        | 3.00       | 420               |  
| 2024-06-01 11:00    | Cinema A1  | CND001 | Candy Mix           | 2         | 4.00       | 120               |  
| 2024-06-01 11:00    | Cinema A1  | NCH001 | Nachos              | 1         | 6.50       | 120               |  
| 2024-06-01 11:00    | Cinema A1  | HOT001 | Hotdog              | 2         | 5.50       | 120               |  

Reply "TERMINATE" in the end when everything is done.
`,
    description:" Inventory Monitor. Your primary responsibility is to continuously analyze real‑time inventory data for cinema concessions. Agent has access to all necessary data.",
    icon:"🎻",
    index_name:""
    },
  {
    input_key:"0006",
    type:"RAG",
    name:"RetailRAG",
    system_message:"",
    description:"An agent that has access to internal index and can handle RAG tasks, call this agent if you are getting questions on Best Practices for implementing Dynamics 365 Supply Chaing management, etc..",
    icon:"📖",
    index_name:"ag-demo-retail"
    },
    {
      input_key:"0007",
      type:"Custom",
      name:"SalesAnalyzer",
      system_message:`
You are Sales Analyzer. Your task is to process real‑time sales data from cinema concessions and detect trends in product demand. Compare units sold, transaction counts, and sales prices to forecast future demand. Collaborate with Inventory Monitor to recommend dynamic restocking schedules and order quantities. Additionally, use current supply chain news from our web surfer agent to adjust recommendations for any external factors affecting lead times or inventory replenishment.

Datasets

You are provided with detailed datasets. Your task is to analyze these datasets. No additional data needed.

### Dataset 1: Inventory data

| Timestamp           | Location  | ItemID | ItemName           | CurrentInventory | ReorderPoint | LeadTimeDays |  
|---------------------|-----------|--------|---------------------|------------------|--------------|---------------|  
| 2024-06-01 10:00    | Cinema A1 | POP001 | Popcorn (Large)     | 120              | 100          | 22            |  
| 2024-06-01 10:00    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 200              | 180          | 12            |  
| 2024-06-01 10:00    | Cinema A1 | CND001 | Candy Mix           | 80               | 75           | 3             |  
| 2024-06-01 10:00    | Cinema A1 | NCH001 | Nachos              | 45               | 50           | 22            |  
| 2024-06-01 10:00    | Cinema A1 | HOT001 | Hotdog              | 60               | 55           | 22            |  
| 2024-06-01 10:05    | Cinema A1 | POP001 | Popcorn (Large)     | 115              | 100          | 22            |  
| 2024-06-01 10:05    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 195              | 180          | 12            |  
| 2024-06-01 10:05    | Cinema A1 | CND001 | Candy Mix           | 78               | 75           | 3             |  
| 2024-06-01 10:05    | Cinema A1 | NCH001 | Nachos              | 47               | 50           | 22            |  
| 2024-06-01 10:05    | Cinema A1 | HOT001 | Hotdog              | 62               | 55           | 22            |  
| 2024-06-01 10:10    | Cinema A1 | POP001 | Popcorn (Large)     | 110              | 100          | 22            |  
| 2024-06-01 10:10    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 190              | 180          | 12            |  
| 2024-06-01 10:10    | Cinema A1 | CND001 | Candy Mix           | 76               | 75           | 3             |  
| 2024-06-01 10:10    | Cinema A1 | NCH001 | Nachos              | 46               | 50           | 22            |  
| 2024-06-01 10:10    | Cinema A1 | HOT001 | Hotdog              | 64               | 55           | 22            |  
| 2024-06-01 10:15    | Cinema A1 | POP001 | Popcorn (Large)     | 105              | 100          | 22            |  
| 2024-06-01 10:15    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 185              | 180          | 12            |  
| 2024-06-01 10:15    | Cinema A1 | CND001 | Candy Mix           | 74               | 75           | 3             |  
| 2024-06-01 10:15    | Cinema A1 | NCH001 | Nachos              | 44               | 50           | 22            |  
| 2024-06-01 10:15    | Cinema A1 | HOT001 | Hotdog              | 66               | 55           | 22            |  
| 2024-06-01 10:20    | Cinema A1 | POP001 | Popcorn (Large)     | 95               | 100          | 22            |  
| 2024-06-01 10:20    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 180              | 180          | 12            |  
| 2024-06-01 10:20    | Cinema A1 | CND001 | Candy Mix           | 72               | 75           | 3             |  
| 2024-06-01 10:20    | Cinema A1 | NCH001 | Nachos              | 42               | 50           | 22            |  
| 2024-06-01 10:20    | Cinema A1 | HOT001 | Hotdog              | 68               | 55           | 22            |  
| 2024-06-01 10:25    | Cinema A1 | POP001 | Popcorn (Large)     | 90               | 100          | 22            |  
| 2024-06-01 10:25    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 175              | 180          | 12            |  
| 2024-06-01 10:25    | Cinema A1 | CND001 | Candy Mix           | 70               | 75           | 3             |  
| 2024-06-01 10:25    | Cinema A1 | NCH001 | Nachos              | 40               | 50           | 22            |  
| 2024-06-01 10:25    | Cinema A1 | HOT001 | Hotdog              | 70               | 55           | 22            |  
| 2024-06-01 10:30    | Cinema A1 | POP001 | Popcorn (Large)     | 85               | 100          | 22            |  
| 2024-06-01 10:30    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 170              | 180          | 12            |  
| 2024-06-01 10:30    | Cinema A1 | CND001 | Candy Mix           | 68               | 75           | 3             |  
| 2024-06-01 10:30    | Cinema A1 | NCH001 | Nachos              | 38               | 50           | 22            |  
| 2024-06-01 10:30    | Cinema A1 | HOT001 | Hotdog              | 72               | 55           | 22            |  
| 2024-06-01 10:35    | Cinema A1 | POP001 | Popcorn (Large)     | 80               | 100          | 22            |  
| 2024-06-01 10:35    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 165              | 180          | 12            |  
| 2024-06-01 10:35    | Cinema A1 | CND001 | Candy Mix           | 66               | 75           | 3             |  
| 2024-06-01 10:35    | Cinema A1 | NCH001 | Nachos              | 36               | 50           | 22            |  
| 2024-06-01 10:35    | Cinema A1 | HOT001 | Hotdog              | 74               | 55           | 22            |  
| 2024-06-01 10:40    | Cinema A1 | POP001 | Popcorn (Large)     | 75               | 100          | 22            |  
| 2024-06-01 10:40    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 160              | 180          | 12            |  
| 2024-06-01 10:40    | Cinema A1 | CND001 | Candy Mix           | 64               | 75           | 3             |  
| 2024-06-01 10:40    | Cinema A1 | NCH001 | Nachos              | 34               | 50           | 22            |  
| 2024-06-01 10:40    | Cinema A1 | HOT001 | Hotdog              | 76               | 55           | 22            |  
| 2024-06-01 10:45    | Cinema A1 | POP001 | Popcorn (Large)     | 70               | 100          | 22            |  
| 2024-06-01 10:45    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 155              | 180          | 12            |  
| 2024-06-01 10:45    | Cinema A1 | CND001 | Candy Mix           | 62               | 75           | 3             |  
| 2024-06-01 10:45    | Cinema A1 | NCH001 | Nachos              | 32               | 50           | 22            |  
| 2024-06-01 10:45    | Cinema A1 | HOT001 | Hotdog              | 78               | 55           | 22            |  
| 2024-06-01 10:50    | Cinema A1 | POP001 | Popcorn (Large)     | 65               | 100          | 22            |  
| 2024-06-01 10:50    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 150              | 180          | 12            |  
| 2024-06-01 10:50    | Cinema A1 | CND001 | Candy Mix           | 60               | 75           | 3             |  
| 2024-06-01 10:50    | Cinema A1 | NCH001 | Nachos              | 30               | 50           | 22            |  
| 2024-06-01 10:50    | Cinema A1 | HOT001 | Hotdog              | 80               | 55           | 22            |  
| 2024-06-01 10:55    | Cinema A1 | POP001 | Popcorn (Large)     | 60               | 100          | 22            |  
| 2024-06-01 10:55    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 145              | 180          | 12            |  
| 2024-06-01 10:55    | Cinema A1 | CND001 | Candy Mix           | 58               | 75           | 3             |  
| 2024-06-01 10:55    | Cinema A1 | NCH001 | Nachos              | 28               | 50           | 22            |  
| 2024-06-01 10:55    | Cinema A1 | HOT001 | Hotdog              | 82               | 55           | 22            |  
| 2024-06-01 11:00    | Cinema A1 | POP001 | Popcorn (Large)     | 55               | 100          | 22            |  
| 2024-06-01 11:00    | Cinema A1 | DRK001 | Soft Drink (500ml)  | 140              | 180          | 12            |  
| 2024-06-01 11:00    | Cinema A1 | CND001 | Candy Mix           | 56               | 75           | 3             |  
| 2024-06-01 11:00    | Cinema A1 | NCH001 | Nachos              | 26               | 50           | 22            |  
| 2024-06-01 11:00    | Cinema A1 | HOT001 | Hotdog              | 84               | 55           | 2             |  

### Dataset 2: Sales data
| Timestamp           | Location   | ItemID | ItemName            | UnitsSold | SalesPrice | TransactionCount |  
|---------------------|------------|--------|---------------------|-----------|------------|-------------------|  
| 2024-06-01 10:00    | Cinema A1  | POP001 | Popcorn (Large)     | 15        | 8.50       | 520               |  
| 2024-06-01 10:00    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 25        | 3.00       | 820               |  
| 2024-06-01 10:00    | Cinema A1  | CND001 | Candy Mix           | 10        | 4.00       | 320               |  
| 2024-06-01 10:00    | Cinema A1  | NCH001 | Nachos              | 5         | 6.50       | 220               |  
| 2024-06-01 10:00    | Cinema A1  | HOT001 | Hotdog              | 7         | 5.50       | 320               |  
| 2024-06-01 10:05    | Cinema A1  | POP001 | Popcorn (Large)     | 13        | 8.50       | 420               |  
| 2024-06-01 10:05    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 22        | 3.00       | 720               |  
| 2024-06-01 10:05    | Cinema A1  | CND001 | Candy Mix           | 12        | 4.00       | 420               |  
| 2024-06-01 10:05    | Cinema A1  | NCH001 | Nachos              | 6         | 6.50       | 220               |  
| 2024-06-01 10:05    | Cinema A1  | HOT001 | Hotdog              | 8         | 5.50       | 320               |  
| 2024-06-01 10:10    | Cinema A1  | POP001 | Popcorn (Large)     | 20        | 8.50       | 720               |  
| 2024-06-01 10:10    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 30        | 3.00       | 1020              |  
| 2024-06-01 10:10    | Cinema A1  | CND001 | Candy Mix           | 15        | 4.00       | 520               |  
| 2024-06-01 10:10    | Cinema A1  | NCH001 | Nachos              | 8         | 6.50       | 320               |  
| 2024-06-01 10:10    | Cinema A1  | HOT001 | Hotdog              | 10        | 5.50       | 420               |  
| 2024-06-01 10:15    | Cinema A1  | POP001 | Popcorn (Large)     | 18        | 8.50       | 620               |  
| 2024-06-01 10:15    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 28        | 3.00       | 920               |  
| 2024-06-01 10:15    | Cinema A1  | CND001 | Candy Mix           | 14        | 4.00       | 420               |  
| 2024-06-01 10:15    | Cinema A1  | NCH001 | Nachos              | 7         | 6.50       | 320               |  
| 2024-06-01 10:15    | Cinema A1  | HOT001 | Hotdog              | 9         | 5.50       | 320               |  
| 2024-06-01 10:20    | Cinema A1  | POP001 | Popcorn (Large)     | 12        | 8.50       | 520               |  
| 2024-06-01 10:20    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 26        | 3.00       | 820               |  
| 2024-06-01 10:20    | Cinema A1  | CND001 | Candy Mix           | 10        | 4.00       | 320               |  
| 2024-06-01 10:20    | Cinema A1  | NCH001 | Nachos              | 4         | 6.50       | 220               |  
| 2024-06-01 10:20    | Cinema A1  | HOT001 | Hotdog              | 6         | 5.50       | 320               |  
| 2024-06-01 10:25    | Cinema A1  | POP001 | Popcorn (Large)     | 10        | 8.50       | 420               |  
| 2024-06-01 10:25    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 24        | 3.00       | 720               |  
| 2024-06-01 10:25    | Cinema A1  | CND001 | Candy Mix           | 8         | 4.00       | 320               |  
| 2024-06-01 10:25    | Cinema A1  | NCH001 | Nachos              | 3         | 6.50       | 220               |  
| 2024-06-01 10:25    | Cinema A1  | HOT001 | Hotdog              | 5         | 5.50       | 220               |  
| 2024-06-01 10:30    | Cinema A1  | POP001 | Popcorn (Large)     | 8         | 8.50       | 320               |  
| 2024-06-01 10:30    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 22        | 3.00       | 720               |  
| 2024-06-01 10:30    | Cinema A1  | CND001 | Candy Mix           | 7         | 4.00       | 320               |  
| 2024-06-01 10:30    | Cinema A1  | NCH001 | Nachos              | 4         | 6.50       | 220               |  
| 2024-06-01 10:30    | Cinema A1  | HOT001 | Hotdog              | 6         | 5.50       | 320               |  
| 2024-06-01 10:35    | Cinema A1  | POP001 | Popcorn (Large)     | 6         | 8.50       | 320               |  
| 2024-06-01 10:35    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 20        | 3.00       | 620               |  
| 2024-06-01 10:35    | Cinema A1  | CND001 | Candy Mix           | 6         | 4.00       | 220               |  
| 2024-06-01 10:35    | Cinema A1  | NCH001 | Nachos              | 3         | 6.50       | 220               |  
| 2024-06-01 10:35    | Cinema A1  | HOT001 | Hotdog              | 5         | 5.50       | 220               |  
| 2024-06-01 10:40    | Cinema A1  | POP001 | Popcorn (Large)     | 5         | 8.50       | 220               |  
| 2024-06-01 10:40    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 18        | 3.00       | 620               |  
| 2024-06-01 10:40    | Cinema A1  | CND001 | Candy Mix           | 5         | 4.00       | 220               |  
| 2024-06-01 10:40    | Cinema A1  | NCH001 | Nachos              | 3         | 6.50       | 220               |  
| 2024-06-01 10:40    | Cinema A1  | HOT001 | Hotdog              | 4         | 5.50       | 220               |  
| 2024-06-01 10:45    | Cinema A1  | POP001 | Popcorn (Large)     | 4         | 8.50       | 220               |  
| 2024-06-01 10:45    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 16        | 3.00       | 520               |  
| 2024-06-01 10:45    | Cinema A1  | CND001 | Candy Mix           | 4         | 4.00       | 220               |  
| 2024-06-01 10:45    | Cinema A1  | NCH001 | Nachos              | 2         | 6.50       | 120               |  
| 2024-06-01 10:45    | Cinema A1  | HOT001 | Hotdog              | 3         | 5.50       | 120               |  
| 2024-06-01 10:50    | Cinema A1  | POP001 | Popcorn (Large)     | 3         | 8.50       | 120               |  
| 2024-06-01 10:50    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 15        | 3.00       | 520               |  
| 2024-06-01 10:50    | Cinema A1  | CND001 | Candy Mix           | 3         | 4.00       | 120               |  
| 2024-06-01 10:50    | Cinema A1  | NCH001 | Nachos              | 2         | 6.50       | 120               |  
| 2024-06-01 10:50    | Cinema A1  | HOT001 | Hotdog              | 3         | 5.50       | 120               |  
| 2024-06-01 10:55    | Cinema A1  | POP001 | Popcorn (Large)     | 2         | 8.50       | 120               |  
| 2024-06-01 10:55    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 14        | 3.00       | 520               |  
| 2024-06-01 10:55    | Cinema A1  | CND001 | Candy Mix           | 2         | 4.00       | 120               |  
| 2024-06-01 10:55    | Cinema A1  | NCH001 | Nachos              | 1         | 6.50       | 120               |  
| 2024-06-01 10:55    | Cinema A1  | HOT001 | Hotdog              | 2         | 5.50       | 120               |  
| 2024-06-01 11:00    | Cinema A1  | POP001 | Popcorn (Large)     | 2         | 8.50       | 120               |  
| 2024-06-01 11:00    | Cinema A1  | DRK001 | Soft Drink (500ml)  | 13        | 3.00       | 420               |  
| 2024-06-01 11:00    | Cinema A1  | CND001 | Candy Mix           | 2         | 4.00       | 120               |  
| 2024-06-01 11:00    | Cinema A1  | NCH001 | Nachos              | 1         | 6.50       | 120               |  
| 2024-06-01 11:00    | Cinema A1  | HOT001 | Hotdog              | 2         | 5.50       | 120               |  


Reply "TERMINATE" in the end when everything is done.
`,
      description:"An agent integrate the flagged transaction trends with customer profile data from data analysis done by Transaction Trend Analyzer agent. Agent has access to all necessary data.",
      icon:"🎻",
      index_name:""
      },
];
