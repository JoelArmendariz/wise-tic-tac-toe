import axios from "axios";
import Button from "@/components/common/Button";
import TextInput from "@/components/common/TextInput";
import { useState } from "react";
import { useRouter } from "next/router";

export default function GameCodeForm() {
  const router = useRouter();

  const [newGamePlayerNameInputValue, setNewGamePlayerNameInputValue] =
    useState("");
  const [playerNameInputValue, setPlayerNameInputValue] = useState("");
  const [gameCodeInputValue, setGameCodeInputValue] = useState("");

  const handleCreateNewGame = async () => {
    const playerData = await axios.post("/api/player", {
      name: newGamePlayerNameInputValue,
    });
    const player = playerData.data;

    const gameData = await axios.post("/api/game", player);
    const game = gameData.data;

    router.push(`/${game.id}`);
  };

  const handleConnectToExistingGame = async () => {
    const playerData = await axios.post("/api/player", {
      name: playerNameInputValue,
    });
    const player = playerData.data;
    await axios.put("/api/game", { player, gameId: gameCodeInputValue });

    router.push(`/${gameCodeInputValue}`);
  };

  return (
    <div>
      <div className="flex flex-col mt-72 mb-4">
        <span>Create a new game</span>
        <div className="space-x-2 mt-2">
          <TextInput
            onChange={(event) =>
              setNewGamePlayerNameInputValue(event.target.value)
            }
            placeholder="Enter your player name"
          />
          <Button onClick={handleCreateNewGame}>Create New Game</Button>
        </div>
      </div>
      <div className="flex justify-center items-center rounded-full border border-secondary w-8 h-8 p-5">
        or
      </div>
      <div className="flex flex-col mt-4">
        <span>Connect to existing game</span>
        <div className="flex flex-row space-x-2 mb-4 mt-2">
          <div className="flex flex-col space-y-2">
            <TextInput
              onChange={(event) => setGameCodeInputValue(event.target.value)}
              placeholder="Enter game code"
            />
            <TextInput
              onChange={(event) => setPlayerNameInputValue(event.target.value)}
              placeholder="Enter your player name"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleConnectToExistingGame}>Join Game</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
