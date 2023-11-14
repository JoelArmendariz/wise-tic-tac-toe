import Button from "@/components/common/Button";
import TextInput from "@/components/common/TextInput";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import { useRouter } from "next/router";

export default function GameCodeForm() {
  const router = useRouter();

  const [inputValue, setInputValue] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setInputValue(event.target.value);

  const handleStartGame = () => {
    router.push(inputValue);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      router.push(inputValue);
    }
  };

  return (
    <div className="space-x-2 mt-72 ">
      <TextInput
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        placeholder="Enter game code"
      />
      <Button onClick={handleStartGame}>Start Game</Button>
    </div>
  );
}
