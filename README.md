# Static Games Collection

This project is a collection of simple static games built using React, TypeScript, and Vite. It serves as a playground for exploring different game mechanics and UI implementations with modern web technologies.

## ✨ Features

- Built with **React 19** for a component-based UI.
- Written in **TypeScript** for type safety and better developer experience.
- Powered by **Vite** for a fast development server and optimized builds.
- Styled with **Tailwind CSS** for rapid UI development.
- Includes examples of classic games.

## 🛠 Tech Stack

- **Frontend:** React, TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Linting:** ESLint

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:

- Node.js (v18.x or later recommended)
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AnestLarry/Static-Games-Collection
   cd static-games
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or npm install
   # or yarn install
   ```

### Running the Project

To start the development server:

```bash
pnpm dev
# or npm run dev
# or yarn dev
```

This will start the Vite development server, typically at `http://localhost:5173`.

## 📜 Available Scripts

In the project directory, you can run the following scripts:

- `pnpm dev`: Runs the app in development mode.
- `pnpm build`: Builds the app for production to the `dist` folder.
- `pnpm lint`: Lints the project files using ESLint.
- `pnpm preview`: Serves the production build locally for preview.

## 📁 Project Structure

Here's a brief overview of the project's directory structure:

```
static-games/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable UI components
│   │   └── layout/     # Layout components (e.g., Navbar, Footer)
│   ├── games/          # Game-specific components and logic
│   │   ├── 2048/
│   │   └── minesweeper/
│   ├── pages/          # Page components (e.g., HomePage, GamePage)
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Entry point of the application
│   └── index.css       # Global styles
├── .eslintrc.js        # ESLint configuration
├── package.json        # Project metadata and dependencies
├── tsconfig.json       # TypeScript compiler options
├── vite.config.ts      # Vite configuration
└── README.md           # This file
```

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or want to add new games, please feel free to:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is currently under the MIT.
