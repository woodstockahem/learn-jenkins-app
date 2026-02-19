import logo from './logo.svg';
import './App.css';

function App() {
  const appVersion = process.env.REACT_APP_VERSION || '1';

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Jenkins on Udemy
        </a>
      </header>
      <p>
          Application version: {appVersion}
      </p>
    </div>
  );
}

export default App;
