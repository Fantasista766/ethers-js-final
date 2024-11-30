import { useState, useEffect } from "react";
import { ethers, BrowserProvider, formatEther } from "ethers";

export default function Home() {
  const contractAddress = "0xF526C4fB3A22f208058163A34278989D1f953619";
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contractABI = [
    "function isTrue() public view returns (bool)",
    "function setTrue(bool _isTrue) public",
  ];
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  const [isTrue, setIsTrue] = useState(false);

  useEffect(() => {
    // Обновление данных при загрузке компонента
    updateContractState();
  }, []);

  // Обновление состояния переменной isTrue
  const updateContractState = async () => {
    try {
      const value = await contract.isTrue();
      setIsTrue(value);
    } catch (error) {
      console.error("Ошибка при чтении контракта:", error);
    }
  };

  // Отправка транзакции
  const handleClick = async (newValue: boolean) => {
    try {
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      const transaction = await contractWithSigner.setTrue(newValue);
      console.log("Транзакция отправлена:", transaction);

      await transaction.wait(); // Ждём подтверждения транзакции
      console.log("Транзакция подтверждена");

      // Обновление данных после транзакции
      updateContractState();
    } catch (error) {
      console.error("Ошибка при отправке транзакции:", error);
    }
  };

  return (
    <div>
      <h2>Интерактив с контрактом</h2>
      <p>Текущее состояние: {isTrue ? "Истина" : "Ложь"}</p>
      <button onClick={() => handleClick(true)}>Установить в Истину</button>
      <br></br>
      <button onClick={() => handleClick(false)}>Установить в Ложь</button>
    </div>
  );
}
