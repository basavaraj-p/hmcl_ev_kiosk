import React, { useState } from "react";
import SBHFilterCard from "./SBHFilterCard";
import SBHTable from "./SBHTable";

const ShiftScheduleHistory = () => {
  return (
    <div>
      <div>
        <SBHFilterCard />
      </div>
      <div>
        <SBHTable />
      </div>
    </div>
  );
};

export default ShiftScheduleHistory;
