import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [signerAddress, setSignerAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState({ address: "", hp: 100, isTurn: false });
  const [opponent, setOpponent] = useState({ address: "", hp: 100 });

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const _signer = await _provider.getSigner();
        const _address = await _signer.getAddress();
        const _contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, _signer);

        setProvider(_provider);
        setSigner(_signer);
        setSignerAddress(_address);
        setContract(_contract);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!contract || !signerAddress) return;

    const joinGame = async () => {
      try {
        const playerData = await contract.players(signerAddress);
        if (playerData.opponent === ethers.ZeroAddress) {
          const tx = await contract.joinGame();
          await tx.wait();
        }
      } catch (error) {
        console.error("Gagal join game:", error);
      }
    };

    joinGame();
  }, [contract, signerAddress]);

  useEffect(() => {
    if (!contract || !signerAddress) return;

    const interval = setInterval(async () => {
      try {
        const playerData = await contract.players(signerAddress);
        const opponentAddress = playerData.opponent;
        const isTurn = playerData.isTurn;
        const hp = playerData.hp;

        setPlayer((prev) => ({
          ...prev,
          address: signerAddress,
          hp: hp.toNumber(),
          isTurn,
        }));

        if (opponentAddress !== ethers.ZeroAddress) {
          const opponentData = await contract.players(opponentAddress);
          setOpponent((prev) => ({
            ...prev,
            address: opponentAddress,
            hp: opponentData.hp.toNumber(),
          }));
        }
      } catch (error) {
        console.error("Gagal polling data PvP:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [contract, signerAddress]);

  return (
    <div className="p-4 text-center">
      <h1 className="text-3xl font-bold mb-6">Arena PVP</h1>

      {opponent.address === "" || opponent.address === ethers.ZeroAddress ? (
        <p className="text-yellow-400 text-lg">Menunggu lawan bergabung...</p>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 items-center justify-center">
            <div>
              <p className="font-semibold text-green-400">Kamu</p>
              <p className="break-words text-xs">{player.address}</p>
              <p className="text-2xl mt-2">{player.hp} / 100</p>
            </div>
            <div>
              <p className="font-semibold text-red-400">Lawan</p>
              <p className="break-words text-xs">{opponent.address}</p>
              <p className="text-2xl mt-2">{opponent.hp} / 100</p>
            </div>
          </div>

          {player.isTurn ? (
            <p className="text-blue-400">Giliran kamu bermain!</p>
          ) : (
            <p className="text-gray-400">Menunggu giliran lawan...</p>
          )}
        </>
      )}
    </div>
  );
};

export default ArenaPVP;
