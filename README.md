# Chess Game with React DnD

A modern, interactive chess game that combines the classic rules of chess with contemporary web technologies. Built with React and TypeScript, this application features an intuitive drag-and-drop interface, real-time move validation, and a sleek glass-morphism design.

![Chess Game Demo](demo.gif)

## Key Highlights
- 🎮 Full chess rules implementation with move validation
- 🖱️ Smooth drag-and-drop piece movement
- 💅 Modern glass-morphism UI with responsive design
- ⚡ Built with React 19, TypeScript, and Tailwind CSS
- ♟️ Complete support for special moves (castling, en passant, promotion)
- 🎯 Visual feedback for moves, checks, and game states
- 📱 Touch-device friendly and keyboard accessible

## About

This chess game is a full-featured web application that combines classic chess rules with modern web technologies. Built with React and TypeScript, it offers:

### Game Features
- Complete chess rules implementation using chess.js
- Legal move validation and enforcement
- Special moves support (castling, en passant, pawn promotion)
- Game state tracking (check, checkmate, draw)
- Move history with last move highlighting

### User Interface
- Intuitive drag and drop piece movement
- Visual feedback for:
  - Available moves for selected pieces
  - Currently selected piece
  - Last move played
  - Check and checkmate states
  - Invalid move attempts
- Responsive design that works on all screen sizes
- Modern glass-morphism UI effects
- Smooth animations and transitions

### Technical Implementation
- Built with React 19 and TypeScript for type safety
- Uses chess.js for game logic and move validation
- Implements React DnD for smooth drag and drop interactions
- Styled with Tailwind CSS for modern design
- Modular component architecture for maintainability
- Efficient state management using React hooks

### Accessibility
- Keyboard navigation support
- High contrast piece colors
- Clear visual feedback for game states
- Screen reader friendly move announcements
- Touch device support

## Features

- Full chess game implementation using chess.js
- Drag and Drop piece movement with React DnD
- Modern UI with Tailwind CSS
- Responsive design
- Move validation and game state management
- Visual feedback for:
  - Possible moves
  - Selected pieces
  - Last move played
  - Check and checkmate states

## Drag and Drop Implementation

The game uses React DnD (react-dnd) for handling piece movements. Here's how it works:

### DnD Setup

1. The game is wrapped in a `DndProvider` with HTML5 backend:
```tsx
<DndProvider backend={HTML5Backend}>
  <ChessBoard game={game} onMove={handleMove} />
</DndProvider>
```

### Draggable Pieces

Each chess piece is a draggable component using the `useDrag` hook:
```tsx
const [{ isDragging }, dragRef] = useDrag({
  type: 'piece',
  item: { type: 'piece', position, piece },
  collect: (monitor) => ({
    isDragging: !!monitor.isDragging(),
  }),
});
```

### Droppable Squares

Each square on the board is a drop target using the `useDrop` hook:
```tsx
const [{ isOver }, dropRef] = useDrop({
  accept: 'piece',
  drop: (item) => {
    if (item.position !== position) {
      onDrop(item.position, position);
    }
  },
  collect: (monitor) => ({
    isOver: !!monitor.isOver(),
  }),
});
```

### Visual Feedback

The DnD implementation includes visual feedback for:
- Dragging pieces (opacity and scale changes)
- Hovering over valid drop targets
- Invalid moves
- Successful moves

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

## Dependencies

- React
- TypeScript
- chess.js - For chess game logic and validation
- react-dnd - For drag and drop functionality
- react-dnd-html5-backend - HTML5 backend for react-dnd
- Tailwind CSS - For styling

## Project Structure

```
src/
  components/
    ChessBoard.tsx - Main chess board component
    Game.tsx      - Game state management
    Piece.tsx     - Draggable piece component
    Square.tsx    - Droppable square component
    Footer.tsx    - Footer component
```

## How Drag and Drop Works

1. **Piece Selection**
   - Pieces are made draggable using `useDrag`
   - When dragging starts, the piece's position and type are stored

2. **Square Targeting**
   - Each square is a drop target using `useDrop`
   - Squares collect hover state for visual feedback

3. **Move Validation**
   - When a piece is dropped, the move is validated using chess.js
   - If valid, the move is executed and the game state updates
   - If invalid, the piece returns to its original position

4. **Visual Feedback**
   - Dragged pieces show reduced opacity
   - Valid drop targets highlight on hover
   - Invalid moves trigger error messages
   - Successful moves update the board and highlight the move

## Contributing

Feel free to submit issues and pull requests.

## License

MIT License - feel free to use this code for your own projects.
