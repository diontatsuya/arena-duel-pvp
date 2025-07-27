import { useEffect, useState } from "react";
import { ethers } from "ethers";
import JoinPVP from "./JoinPVP";
import BattlePVP from "./BattlePVP";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const _signer = await _provider.getSigner();
        const _contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, _signer);

        setProvider(_provider);
        setSigner(_signer);
        setContract(_contract);

        try {
          const userAddress = await _signer.getAddress();
          const player = await _contract.getPlayerStatus(userAddress);

          // Status berdasarkan player struct:
          // player.opponent = address(0) berarti belum bertarung
          // player.isTurn = true/false menunjukkan apakah sedang bertarung
          if (player.opponent !== ethers.ZeroAddress) {
            setStatus("battle");
          } else {
            setStatus("join");
          }
        } catch (err) {
          console.error("Gagal mengambil status pemain:", err);
          setStatus("error");
        }
      } else {
        alert("Harap install MetaMask untuk bermain!");
        setStatus("no-wallet");
      }
    };

    init();
  }, []);

  if (status === "loading") {
    return <div className="text-center mt-10">Memuat Arena PvP...</div>;
  }

  if (status === "battle") {
    return <BattlePVP provider={provider} signer={signer} contract={contract} />;
  }

  return <JoinPVP provider={provider} signer={signer} contract={contract} />;
};

export default ArenaPVP;
