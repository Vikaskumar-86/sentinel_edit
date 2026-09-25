# White-screen fix

Added `react-is` as a runtime dependency required by the Recharts setup used by this project. Recharts' npm documentation lists `react-is` in its recommended installation command.

After extracting:
1. Open the project folder in VS Code.
2. Run `npm install --legacy-peer-deps`.
3. Run `npm run dev`.
