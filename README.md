# Who Sent This
A Web app to send, receive and reply anonymous messages without revealing your identity.

# Features
- Login/Registeration is optional
- Responsive
- Shareable links
- Post Questions
- Reply feature for both sender and receiver
- Optionally disallow replies and pause receiving messages
- Backend is built with Anonymity in mind

# Tech Stack
- Frontend: ReactJS, TailwindCSS
- Backend: NodeJS, ExpressJS
- Database: MongoDB

# Build
## Frontend
```bash
git clone https://github.com/sahaj-b/who-sent-this.git
cd who-sent-this/frontend
npm install
npm run dev
```

## Backend
```bash
git clone https://github.com/sahaj-b/who-sent-this.git
cd who-sent-this/backend
npm install
npm run dev # For development
npm run build && node dist/index.js # For production
```

