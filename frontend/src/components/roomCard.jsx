import React from "react";

const RoomCard = ({ roomName, onClick, active }) => {
  return (
    <li
        className={`flex-1 w-30 h-15 p-2 text-[var(--color-on-surface)] font-body-md text-body-md rounded-md transition-colors duration-150 border border-primary flex items-center justify-center gap-2 cursor-pointer ${active ? "bg-[var(--color-on-primary)]" : "bg-[var(--color-surface-variant)]"}`}
        onClick={onClick}
        active={active}
    >
        {roomName}
    </li>
  );
};

export default RoomCard;