# Ethers.js Final Project

This repository contains the final project built with **Ethers.js**, **Next.js**, and **TypeScript**, designed for seamless blockchain interactions. The application demonstrates wallet management, token operations, and contract interaction on the Ethereum blockchain.

## Features

- **Wallet Connection:** Easily connect to MetaMask or other wallets using `wagmi` and `ConnectKit`.
- **Network Switching:** Switch between Ethereum networks such as Sepolia.
- **Token Operations:** Interact with ERC-20 tokens, check allowances, and approve tokens for spending.
- **Contract Interaction:** View and update contract state variables.
- **Transaction Management:** Send ETH between addresses.

## Technologies Used

- **Framework:** [Next.js](https://nextjs.org/)
- **Blockchain Library:** [Ethers.js](https://docs.ethers.org/)
- **UI Components:** [Tailwind CSS](https://tailwindcss.com/) for styling
- **Wallet Management:** [Wagmi](https://wagmi.sh/) and [ConnectKit](https://docs.connectkit.dev/)
- **TypeScript:** For robust type safety

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Fantasista766/ethers-js-final.git
   cd ethers-js-final
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root of the project and add the following:

   ```plaintext
   NEXT_PUBLIC_INFURA_ID=your_infura_project_id
   NEXT_PUBLIC_ALCHEMY_KEY=your_alchemy_api_key
   ```

4. **Run the Application**

   - **Development:**
     ```bash
     npm run dev
     ```
   - **Production Build:**
     ```bash
     npm run build
     npm start
     ```

5. **Access the App**
   Open your browser and navigate to `http://localhost:3000`.

## Project Structure

```plaintext
src/
├── components/        # React components for UI
├── pages/             # Next.js pages
├── styles/            # Global and component-level styles
├── utils/             # Helper functions and configurations
└── app/               # Main app structure
```

## Scripts

- `npm run dev` - Run the development server
- `npm run build` - Build the app for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint checks

## Contributions

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](./LICENSE).

## Acknowledgements

- [Ethers.js Documentation](https://docs.ethers.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi](https://wagmi.sh/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ by Fantasista766.

### Что включено:

1. **Описание проекта** с акцентом на его функциональность.
2. **Установка и запуск**: пошаговые инструкции.
3. **Структура проекта** для понимания, как организован код.
