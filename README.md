# EV Kiosk Frontend Application

## Overview
This is the EV Kiosk Frontend Application reconfigured as a work sample. It was originally created by myself and Rahul Kulkarni from Senseops Tech Solutions. The design was inspired by Creative Tim's Vision UI template but was built from the ground up using Vite for enhanced performance and responsiveness. Since this is a work sample, all the functionality could not be reproduced due to NDAs.

This Kiosk was required by Hero to track the various lines and machines throughout their manufacturing plants all over India and also to schedule shifts across them.

**Link:** [https://hmcl-ev-kiosk.web.app](https://hmcl-ev-kiosk.web.app)

## Setup Instructions

### Prerequisites
- Node version 18 or higher

### To Run Locally
```
npm install
npm run dev
```

## Application Walkthrough

### 1. Login Screen
In the original Application, an ADID and VPN credentials are required to log into the application but for this work sample clicking submit will redirect you into the Dashboard Screen.

### 2. Sidebar
All the routes throughout the application can be accessed through the sidebar which will be present on every page but can be minimized by clicking the hamburger icon on the header. Some of the options on the sidebar also have a downward arrow icon. These options upon clicking will render suboptions.

### 3. Header
The header contains the name of the route clicked on the sidebar as well as the icons (from left to right):
- Bell icon that indicates if there are any alarms
- Hamburger icon which is used to either expand or minimize the Sidebar
- Factory Operator icon which upon hovering will render the user credentials used to log into the application
- Logout icon which is used to log out of the application

### 4. Dashboard Screen
In the Dashboard there are 2 cards:
1. **Machine Stopages:** Indicates the total number of machines stopped today/the total number of machines that have stopped since the beginning of the project.
2. **Machine Alarms:** Indicates the total number of alarms generated today/the total number of alarms that have been generated since the beginning of the project.

### 5. Losses

#### 5.1. Rejection and Rework
In this screen the user can add any batteries which have to be either rejected or reworked based on their barcodes. The batteries in this context are used to power EV vehicles. Clicking the "Add" button will render a console card where the user can add barcodes and other details as follows:

a. **Barcodes textbox:** The user can enter a total of 30 barcodes containing exactly 12 characters each separated by a comma. Below that there are 3 dropdowns.
b. **Machine selection dropdown:** The user must select any one machine where the defect in the battery was detected.
c. **Defect Type Dropdown:** The user must select any one defect type (Rejection/Rework).
d. **Defect Names Dropdown:** The contents of this dropdown will conditionally render based on the values selected in the last 2 dropdowns. This dropdown has the option of multiple select with which the user can select multiple defects.
e. **Reason Textbox:** The user can enter a reason that must not be longer than 20 characters.

A table is present below the card which will by default show the latest rejections/reworks and will automatically update whenever there are new rejections/reworks added.

#### 5.2. Stoppage Reasons
In this screen, all the machines which have stopped for whatever reason are tabulated, and the user can also add the reason they stopped. By default, the table will load the latest stoppage reasons. However, if the user wants to filter the stoppages by Date, zone, and machine, a filter card is present where the user can select a date range, a single zone, and any number of machines. The far right column is an actions column which upon clicking will open a dialog box through which the loss type can be selected and a reason can be added.

### 6. Maintenance

#### 6.1. MTTR and MTBF
In this screen there is a console card at the top and 3 graphs below. The console card consists of 3 dropdowns with which the year, month, and zone can be selected. Based on the selected values the graphs will render the respective data.*(For this sample select the month of January 2025 and the option "3.1" in the Zones dropdown)* The graphs are as follows:

a. **Uptime Graph:** This graph contains 2 bars and a y-axis on the left and 2 lines and a y-axis on the right. BD Minutes represents the total amount of time the machines in that particular zone were in breakdown state. BD numbers represent the total amount of breakdowns encountered by all the machines for that particular zone in that month and year. Uptime Variable represents the total run time of the machines in the zone after subtracting the breakdown time. Uptime Constant time represents the total run time of the machine if they did not enter into a breakdown state.

b. **MTTR Graph:** MTTR stands for "Mean Time To Repair" which indicates the mean time required to repair the machines once they enter into a breakdown stage. The graph contains 2 lines which are "MTTR" and "Target MTTR". The "MTTR" line represents the actual time to repair the machines in that particular zone. The "Target MTTR" line represents the ideal time required to repair the machine in that particular zone.

c. **MTBF Graph:** MTBF stands for "Mean Time Between Failures" which indicates the mean time between machine failure once they enter into a breakdown stage. The graph contains 2 lines which are "MTBF" and "Target MTBF". The "MTBF" line represents the actual time between machine failure in that particular zone. The "Target MTBF" line represents the ideal time between machine failure in that particular zone.

### 7. Shifts

#### 7.1. Current Shifts
This screen consists of 3 parts:

a. **Shift Scheduler:** This consists of a console card where the user can schedule shifts based on the date range selection, the zone and shifts (Shift - A, Shift - B, Shift - C). There are multiple select options for zone and shift. The timings for each shift are tabulated in the Shift Configuration card in the bottom left. Right below the console card there is a table where all the shifts scheduled for the past month can be viewed. The table has 4 columns "Scheduled Date", "Shift", "Zone" and "Delete". The "Delete" column contains a delete icon for every row and upon clicking can delete the shift scheduled for that particular day.

b. **Shift Configuration:** This card consists of a table with all the shift details and timings and a "view" button in the last column which upon clicking will render the Shift Breaks for that particular shift in another card next to the current one.

c. **Shift Breaks:** This card consists of a table which contains any shift breaks, their duration and the reason added for that particular shift. There is an "Actions" column at the end which contains a Delete icon for each row. Upon clicking it, the shift break will be deleted. There is an Add icon at the top right corner of the card which on clicking will render a dialog box with 1 non-editable text box which contains shift name and 3 editable text boxes through which the user can add a break description, start time and an end time and click the check icon button.

#### 7.2. Shift History
This screen consists of 2 parts:

a. **Shift Schedule History:** This consists of a console card through which the date range, zones and shifts can be selected. After the selection, the check icon button can be clicked which will render the filtered data based on the selected values in the table below the console card. The table contains 5 columns "ADID" which is the user ID of the person who created or deleted a shift, Date, Shift, Zone and Action (either of two values Create or Delete). *(For this sample select the month of February 2025 and the option "All" in the Zones and Shifts dropdown)*

b. **Shift Break History:** This consists of a console card through which the date range and shifts can be selected. After the selection, the check icon button can be clicked which will render the filtered data based on the selected values in the table below the console card. The table contains 5 columns "ADID" which is the user ID of the person who created or deleted a break, Date, Shift, Break description and Action (either of two values Create or Delete). *(For this sample select the month of February 2025 and the option "All" in the Shifts dropdown)*

### 8. Zones and Machines
This screen consists of 2 parts:

a. **Zone Cycle Time:** This card contains a table in which all the bottlenecked Zones and Machines in this particular plant are ordered with 4 columns which are Machine Name, Zone, Cycle Time(ms) and Actions. The Actions column contains the edit icon which on clicking will render a dialog box through which the cycletime can be updated.

b. **Zone Cycletime History:** This card contains a console card which can be opened by clicking the "Open" button through which the date range, zones and machines can be selected and based on the selection the history data will be rendered out in a table below. *(For this sample select the month of February 2025 and the option "All" in the Zones and Machines dropdown)*
