import React, { useState } from "react";
import ShiftSchedulerCard from "./ShiftSchedulerCard";
import ShiftsSchedulerTable from "./ShiftsSchedulerTable";

const ShiftScheduler = () => {
  const [tableRefresh,setTableRefresh] = useState(true);

  return (
    <div>
      <div>
        <ShiftSchedulerCard
          setTableRefresh={setTableRefresh}
          tableRefresh={tableRefresh}
        />
      </div>
      <div>
        <ShiftsSchedulerTable
          setTableRefresh={setTableRefresh}
          tableRefresh={tableRefresh}
        />
      </div>
    </div>
  );
};

export default ShiftScheduler;
