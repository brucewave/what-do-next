import React from 'react'
import {useState, useEffect} from 'react'
export default function OperationToDo() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    function addToDo() {
        setTodos([...todos,{id: Date.now(), title: newTodo}])
        setNewTodo('');
    } 

    function deleteToDo(id) {
        setTodos(todos.filter(todo => todo.id !== id));
    }







  return (
    <div id='form'>
    <input value={newTodo} onChange={(e)=> setNewTodo(e.target.value)} placeholder='Nhập tên việc' style={{padding: '10px'}}></input>
    <button className='' onClick={addToDo} style={{marginLeft: '20px', padding: '10px'}}>Thêm Việc</button>
    <ul>
        {todos.map(key => (
            <li>{key.title}
            <button onClick={() => deleteToDo(key.id)}>X</button>
            </li>
        ))}
    </ul>
    </div>
  )
}
