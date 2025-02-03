import React, { useState } from "react";
import SSHFilterCard from "./SSHFilterCard";
import SSHTable from "./SSHTable";

const ShiftScheduleHistory = () => {
  return (
    <div>
      <div>
        <SSHFilterCard />
      </div>
      <div>
        <SSHTable />
      </div>
    </div>
  );
};

export default ShiftScheduleHistory;
