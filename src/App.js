import logo from './logo.svg';
import './App.css';
import GetAllList from './components/ListToDo';
import OperationToDo from './components/OperationToDo';

function App() {
  return (
    <div className="App">
      {/* <GetAllList/> */}
      <OperationToDo/>
    </div>
  );
}

export default App;
