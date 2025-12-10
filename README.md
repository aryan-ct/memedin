# 🎭 Memedin - Fun Meme Creator App

A playful, bubbly meme creation app with claymorphism design built with Next.js.

## Features

- 🎨 Beautiful claymorphism design with playful, bubbly UI
- 📸 Real-time camera streaming for meme creation
- 👥 Employee management with CRUD operations
- 🖼️ Meme-style card layout (caption above, image below)
- 💾 JSON file-based data persistence

## Pages

### 1. Main Page (Host Control) - `/`
- View all employee memes in a grid layout
- Click on any meme to open detailed view
- Select employee for camera streaming
- Capture pictures from the camera stream
- Host-controlled page for managing the meme creation process

### 2. Meme Yourself Page - `/meme-yourself`
- Display selected employee's meme with live camera feed
- Camera automatically activates when host selects an employee
- Real-time preview of how you'll appear in the meme
- Picture captured by host from Main page

### 3. Employees Page - `/employees`
- Add, edit, and delete employees
- Each employee has a name and custom caption
- Full CRUD operations
- Data persisted in JSON file

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Usage Workflow

1. **Set up employees**: Go to `/employees` and add team members with funny captions
2. **Host opens Main page**: Navigate to `/` to see all memes
3. **Participant opens Meme Yourself**: Open `/meme-yourself` in another tab/browser
4. **Host selects meme**: Click on a meme card and choose "Choose for Camera Stream"
5. **Camera activates**: The participant's camera will start automatically
6. **Capture photo**: Host clicks "Capture Picture" when ready
7. **Photo saved**: The captured image is saved to the employee's meme

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom claymorphism utilities
- **Camera**: Browser MediaStream API
- **State Management**: React Context + localStorage for cross-tab communication
- **Data Storage**: JSON file persistence

## Design Style

The app features a **claymorphism** design with:
- Soft, rounded edges
- Layered shadow effects (clay-card, clay-button, clay-input)
- Gradient backgrounds
- Playful, bubbly aesthetics
- Smooth transitions and hover effects

## Project Structure

```
meme-app/
├── app/
│   ├── api/employees/      # Employee CRUD API routes
│   ├── employees/          # Employees management page
│   ├── meme-yourself/      # Camera streaming page
│   ├── page.tsx            # Main host control page
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles with claymorphism
├── components/
│   ├── MemeCard.tsx        # Reusable meme card component
│   └── Providers.tsx       # Context providers wrapper
├── lib/
│   ├── types.ts            # TypeScript types
│   ├── db.ts               # JSON file operations
│   └── CameraContext.tsx   # Camera state management
└── data/
    └── employees.json      # Employee data storage
```

## Features Implementation

### Cross-Tab Communication
Uses localStorage events and React Context to synchronize state between:
- Main page (host control)
- Meme Yourself page (participant view)

### Camera Streaming
- Browser's MediaStream API for camera access
- Real-time video preview in meme frame
- Canvas-based image capture

### Data Persistence
- File-system based JSON storage
- CRUD API routes for employee management
- Automatic data synchronization

## Browser Requirements

- Modern browser with camera support
- Camera permissions required for "Meme Yourself" page
- localStorage enabled for cross-tab communication

## Tips

- Use two browser windows side-by-side for best experience
- Grant camera permissions when prompted
- Make sure captions are funny! 😄

---

Built with ❤️ using Next.js and TypeScript
