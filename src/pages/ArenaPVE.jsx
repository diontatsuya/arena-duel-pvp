import React from "react";
import ArenaUI from "../components/ArenaUI";
import { useGameLogic } from "../utils/GameLogic";

const ArenaPVE = () => {
  const { player, opponent, turn, actionStatus, takeAction } = useGameLogic("pve");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Arena Duel PvE</h1>
      <ArenaUI
        player={player}
        opponent={opponent}
        turn={turn}
        actionStatus={actionStatus}
        takeAction={takeAction}
      />
    </div>
  );
};

export default ArenaPVE;
