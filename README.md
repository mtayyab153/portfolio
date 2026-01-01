# Welcome to your My Porfolio project

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/mtayyab153/portfolio

# Step 2: Navigate to the project directory.
cd portfolio

# Step 3: Install the necessary dependencies.
npm i / npm install
```

**Environment Variables Setup (Required)**

This project uses EmailJS for the contact form.
You must configure environment variables for it to work.

**Step 4: Create a .env file in the project root**
```sh
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

**⚠️ Important Notes**

- .env should be placed in the root directory (same level as package.json)
- Environment variables must start with VITE_
- The .env file is ignored by Git and should not be committed

**Step 5: Run the development server**
```sh
npm run dev
```

The app will be available at:
```sh
http://localhost:8080
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- ⚡ Vite

- 🧠 TypeScript

- ⚛️ React

- 🎨 shadcn/ui

- 💨 Tailwind CSS