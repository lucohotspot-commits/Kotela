# **App Name**: Kotela

## Core Features:

- Tap Increment: Implements an incrementing value that adjusts tap strength based on tap duration and frequency, starting at an initial value.
- Timer: A countdown timer starts upon the first tap and continues for 30 seconds.
- Progress Display: Clearly display both the current increment value and the remaining time, with appropriate styling for the timer.
- Score Tracker: A tool using AI that stores scores after 30 second game periods in local storage. An LLM determines if any personal details could be inferred from the game data, and issues a warning if that is possible. Leaderboard scores are saved without retaining unique local identifiers to ensure security.

## Style Guidelines:

- Primary color: Black (#000000) to convey action.
- Background color: White (#FFFFFF) for a clean, uncluttered interface.
- Accent color: Gray (#808080) to highlight the increment value and the timer, grabbing user attention.
- Body and headline font: 'Inter', sans-serif, known for its readability and modern feel.
- Use simple icons to represent tapping and timing, to reinforce their meaning.
- The layout should feature a centered numeric value with timer appearing directly below in the form of a progress bar.
- Subtle pulse animation on the numeric tap value. The progress bar smoothly transitions.