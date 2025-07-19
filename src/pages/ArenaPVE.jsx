// src/pages/ArenaPVE.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import HealthBar from "../components/HealthBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ArenaPVE = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState(null);
  const [ai, setAI] = useState(null);
  const [loading, setLoading] = useState(false);
  const [turn, setTurn] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

        setProvider(provider);
        setSigner(signer);
        setContract(contract);

        const address = await signer.getAddress();
        const data = await contract.getStatus(address);
        setPlayer(data);
        setAI({ hp: 100 }); // AI default
        setTurn(data.isTurn ? "You" : "AI");
      }
    };
    init();
  }, []);

  const performAction = async (action) => {
    if (!contract || !signer || loading) return;
    setLoading(true);
    try {
      const tx = await contract.takeTurn(action);
      await tx.wait();
      const address = await signer.getAddress();
      const updated = await contract.getStatus(address);
      setPlayer(updated);
      setTurn(updated.isTurn ? "You" : "AI");
    } catch (error) {
      console.error("Action failed:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <h1 className="text-3xl font-bold">Arena PvE</h1>

      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <HealthBar name="Player" hp={player?.hp || 0} />
          <HealthBar name="AI Monster" hp={ai?.hp || 100} />
          <p className="text-muted-foreground">Current Turn: {turn}</p>

          <div className="flex gap-4">
            <Button onClick={() => performAction(1)} disabled={turn !== "You" || loading}>
              Attack
            </Button>
            <Button onClick={() => performAction(2)} disabled={turn !== "You" || loading}>
              Defend
            </Button>
            <Button onClick={() => performAction(3)} disabled={turn !== "You" || loading}>
              Heal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArenaPVE;
