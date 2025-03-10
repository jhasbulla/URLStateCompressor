# URL State Compressor

A React hook to synchronize individual state variables with URL parameters.  
This library allows you to easily share application state via URL by compressing the state and storing it in the URL, enabling deep linking and state persistence without a backend.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Example](#basic-example)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Client-Side State Management:**  
  No backend required; the state is stored entirely in the URL.

- **Granular Control:**  
  Manage multiple independent state variables instead of a single aggregated state object, reducing unnecessary re-renders.

- **URL Compression:**  
  Uses [JSONCrush](https://github.com/KilledByAPixel/JSONCrush) to compress state data, ensuring that even complex state objects can be stored in the URL.

- **Seamless Navigation:**  
  Synchronizes state with the browser history, so that the state is updated when navigating back and forth.

---

## Installation

Install the package using npm:

```bash
npm i @jhasbulla/url-state-compressor
```

## Usage

### Basic Example

Below is a basic example of how to use the `useURLState` hook to synchronize multiple state variables with a URL parameter:

```jsx
import React from 'react';
import { useURLState } from '@jhasbulla/url-state-compressor';

const Dashboard: React.FC = () => {
  // Synchronize the "filter" parameter
  const [filter, setFilter] = useURLState<string>('filter', 'active');
  // Synchronize the "selection" parameter
  const [selection, setSelection] = useURLState<number[]>('selection', []);

  const changeFilter = (newFilter: string) => {
    setFilter(newFilter);
  };

  const addSelectionItem = (item: number) => {
    setSelection(prev => [...prev, item]);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Filter</h2>
        <p>Current filter: {filter}</p>
        <button onClick={() => changeFilter('inactive')}>Set Inactive</button>
        <button onClick={() => changeFilter('active')}>Set Active</button>
      </div>
      <div>
        <h2>Selection</h2>
        <p>Selected items: {selection.join(', ')}</p>
        <button onClick={() => addSelectionItem(42)}>Add 42</button>
      </div>
    </div>
  );
};

export default Dashboard;

```

## API

### `useURLState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>]`

- **Parameters:**
  - `key` (string): The URL parameter key to associate with this state.
  - `defaultValue` (T): The default value used if the URL parameter does not exist or fails to parse.

- **Returns:**  
  A tuple `[state, setState]` similar to React's `useState`, where:
  - `state`: The current state value.
  - `setState`: A function to update the state.

- **Behavior:**
  - On initialization, the hook reads and decompresses the value stored in the URL parameter.
  - When the state changes, the new state is serialized, compressed, and stored back in the URL.
  - The hook listens to the browser's `popstate` event to update the state when navigating through browser history.
  - **Important:** Keep in mind that the maximum URL length in most browsers is approximately 2000 characters. Therefore, avoid storing very large objects in the URL as they might exceed this limit.

---

## Contributing

Contributions are welcome! If you encounter issues or have suggestions for improvements, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with clear commit messages.
4. Open a pull request explaining your changes.
5. Ensure that your code follows the project's coding style and includes tests where applicable.

For any major changes, please open an issue first to discuss what you would like to change.

You can also open issues for bug reports or feature requests.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
