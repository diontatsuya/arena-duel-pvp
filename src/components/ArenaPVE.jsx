// src/components/ArenaPVE.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ArenaUI from "./ArenaUI";
import contractABI from "../utils/contractABI.json";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVE = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [player, setPlayer] = useState({ hp: 100 });
  const [enemy, setEnemy] = useState({ hp: 100 });
  const [isTurn, setIsTurn] = useState(true);
  const [log, setLog] = useState([]);

  // Inisialisasi provider dan signer
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const _signer = await _provider.getSigner();
        const _account = await _signer.getAddress();
        const _contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, _signer);

        setProvider(_provider);
        setSigner(_signer);
        setContract(_contract);
        setAccount(_account);
      }
    };

    init();
  }, []);

  const addLog = (message) => {
    setLog((prev) => [message, ...prev.slice(0, 4)]);
  };

  const enemyAction = () => {
    const action = Math.floor(Math.random() * 3); // 0: attack, 1: defend, 2: heal
    let newEnemy = { ...enemy };
    let newPlayer = { ...player };

    if (action === 0) {
      newPlayer.hp -= 10;
      addLog("Enemy attacks! -10 HP");
    } else if (action === 1) {
      addLog("Enemy defends!");
    } else {
      newEnemy.hp += 5;
      if (newEnemy.hp > 100) newEnemy.hp = 100;
      addLog("Enemy heals +5 HP");
    }

    setPlayer(newPlayer);
    setEnemy(newEnemy);
    setIsTurn(true);
  };

  const handleAction = async (action) => {
    if (!isTurn) return;

    let newPlayer = { ...player };
    let newEnemy = { ...enemy };

    if (action === 0) {
      newEnemy.hp -= 10;
      addLog("You attack! -10 HP to enemy");
    } else if (action === 1) {
      addLog("You defend!");
    } else if (action === 2) {
      newPlayer.hp += 5;
      if (newPlayer.hp > 100) newPlayer.hp = 100;
      addLog("You heal +5 HP");
    }

    setPlayer(newPlayer);
    setEnemy(newEnemy);
    setIsTurn(false);

    setTimeout(() => {
      enemyAction();
    }, 1000);
  };

  return (
    <ArenaUI
      isPVP={false}
      isTurn={isTurn}
      playerHP={player.hp}
      enemyHP={enemy.hp}
      onAction={handleAction}
      debugData={{ account, player, enemy, log }}
    />
  );
};

export default ArenaPVE;
