import { InfuraProvider } from "ethers";

async function checkContract() {
  const contractAddress = "0xF526C4fB3A22f208058163A34278989D1f953619";
  const provider = new InfuraProvider("sepolia");

  try {
    const code = await provider.getCode(contractAddress);
    if (code === "0x") {
      console.log("Контракт по указанному адресу не найден.");
    } else {
      console.log("Контракт успешно найден.");
    }
  } catch (error) {
    console.error("Ошибка при проверке контракта:", error);
  }
}

export default checkContract;
