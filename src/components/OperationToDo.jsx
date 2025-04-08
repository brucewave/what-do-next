import React from 'react'
import {useState, useEffect} from 'react'
import '../assets/OperationToDo.css'

export default function OperationToDo() {
    const [todos, setTodos] = useState(()=>{
        const saveToDos = localStorage.getItem('todos');
        return saveToDos ? JSON.parse(saveToDos) : [];
    });

    const [petLevel, setPetLevel] = useState(() => {
        const savedLevel = localStorage.getItem('petLevel');
        return savedLevel ? parseInt(savedLevel) : 1;
    });

    const [petName, setPetName] = useState(() => {
        return localStorage.getItem('petName') || 'Pikachu';
    });

    const [showLevelUp, setShowLevelUp] = useState(false);
    const [completedCount, setCompletedCount] = useState(0);
    const [showCompleted, setShowCompleted] = useState(false);

    const [showNameModal, setShowNameModal] = useState(false);
    const [newPetName, setNewPetName] = useState('');

    useEffect(()=>{
        localStorage.setItem('todos',JSON.stringify(todos))
    },[todos])

    useEffect(() => {
        localStorage.setItem('petLevel', petLevel.toString());
    }, [petLevel]);

    useEffect(() => {
        localStorage.setItem('petName', petName);
    }, [petName]);

    const [newTodo, setNewTodo] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    function addToDo(e) {
        e.preventDefault();
        if (newTodo.trim() !== '') {
            setTodos([...todos,{id: Date.now(), title: newTodo, states: 'no'}])
            setNewTodo('');
        }
    } 

    function deleteToDo(id) {
        setTodos(todos.filter(todo => todo.id !== id));
    }

    function changeState(id) {
        setTodos(todos.map(todo => {
            if (todo.id === id) {
                const newState = todo.states === 'no' ? 'yes' : 'no';
                if (newState === 'yes') {
                    const newCount = completedCount + 1;
                    setCompletedCount(newCount);
                    checkLevelUp(newCount);
                } else {
                    setCompletedCount(prev => prev - 1);
                }
                return {
                    ...todo,
                    states: newState
                };
            }
            return todo;
        }));
    }

    function checkLevelUp(completedTasks) {
        const levelThresholds = [10, 20, 30, 50, 75, 100];
        const newLevel = levelThresholds.findIndex(threshold => completedTasks < threshold) + 1;
        if (newLevel > petLevel) {
            setPetLevel(newLevel);
            setShowLevelUp(true);
            setTimeout(() => setShowLevelUp(false), 3000);
        }
    }

    function startEditing(todo) {
        setEditingId(todo.id);
        setEditText(todo.title);
    }

    function saveEdit(id) {
        if (editText.trim() !== '') {
            setTodos(todos.map(todo => {
                if (todo.id === id) {
                    return {
                        ...todo,
                        title: editText.trim()
                    };
                }
                return todo;
            }));
        }
        setEditingId(null);
    }

    function handleKeyDown(e, id) {
        if (e.key === 'Enter') {
            saveEdit(id);
        } else if (e.key === 'Escape') {
            setEditingId(null);
        }
    }

    function handleNameChange(e) {
        e.preventDefault();
        if (newPetName.trim() !== '') {
            setPetName(newPetName.trim());
            setShowNameModal(false);
        }
    }

    const getPetEmoji = () => {
        const pets = ['🐣', '🐥', '🐤', '🦆', '🦢', '🦅'];
        return pets[Math.min(petLevel - 1, pets.length - 1)];
    };

    const getNextLevel = () => {
        const thresholds = [10, 20, 30, 50, 75, 100];
        return thresholds[petLevel - 1] || 'MAX';
    };

    const uncompletedTodos = todos.filter(todo => todo.states === 'no');
    const completedTodos = todos.filter(todo => todo.states === 'yes');

    return (
        <div className="todo-container">
            <div className="todo-header">
                <h1>I know what we gonna to do today!</h1>
                <div className="pet-status">
                    <div className="pet-display">
                        <span className="pet-emoji">{getPetEmoji()}</span>
                        <div className="pet-info" onClick={() => setShowNameModal(true)}>
                            <span className="pet-name">{petName}</span>
                            <span className="edit-icon">✎</span>
                        </div>
                        <span className="pet-level">Level {petLevel}</span>
                    </div>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill"
                            style={{width: `${(completedCount / getNextLevel()) * 100}%`}}
                        ></div>
                    </div>
                    <div className="progress-text">
                        {completedCount} / {getNextLevel()} tasks completed
                    </div>
                </div>
                {showLevelUp && (
                    <div className="level-up-animation">
                        🎉 Level Up! {getPetEmoji()} is now level {petLevel}! 🎉
                    </div>
                )}
                {showNameModal && (
                    <div className="modal-overlay" onClick={() => setShowNameModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <h2>Change Pet Name</h2>
                            <form onSubmit={handleNameChange}>
                                <input
                                    type="text"
                                    value={newPetName}
                                    onChange={(e) => setNewPetName(e.target.value)}
                                    placeholder="Enter new name"
                                    className="name-input"
                                    autoFocus
                                />
                                <div className="modal-buttons">
                                    <button type="button" onClick={() => setShowNameModal(false)} className="cancel-button">
                                        Cancel
                                    </button>
                                    <button type="submit" className="save-button">
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                <form onSubmit={addToDo} className="todo-form">
                    <input 
                        value={newTodo} 
                        onChange={(e)=> setNewTodo(e.target.value)} 
                        placeholder='Add a new task...'
                        className="todo-input"
                    />
                    <button type="submit" className="add-button">
                        <span>+</span>
                    </button>
                </form>
            </div>
            
            <div className="todo-lists-container">
                <div className="todo-list-section">
                    <h2 className="section-title">Active Tasks</h2>
                    <div className="todo-list">
                        {uncompletedTodos.map(todo => (
                            <div key={todo.id} className="todo-item">
                                <div className="todo-content">
                                    <button 
                                        className={`checkbox ${todo.states === 'yes' ? 'checked' : ''}`}
                                        onClick={() => changeState(todo.id)}
                                    >
                                        {todo.states === 'yes' && <span>✓</span>}
                                    </button>
                                    {editingId === todo.id ? (
                                        <input
                                            type="text"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            onBlur={() => saveEdit(todo.id)}
                                            onKeyDown={(e) => handleKeyDown(e, todo.id)}
                                            className="edit-input"
                                            autoFocus
                                        />
                                    ) : (
                                        <span 
                                            className={`todo-title ${todo.states === 'yes' ? 'completed' : ''}`}
                                            onClick={() => startEditing(todo)}
                                        >
                                            {todo.title}
                                        </span>
                                    )}
                                </div>
                                <button 
                                    className="delete-button"
                                    onClick={() => deleteToDo(todo.id)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {completedTodos.length > 0 && (
                    <div className="todo-list-section completed-section">
                        <div className="section-header">
                            <h2 className="section-title">Completed Tasks</h2>
                            <button 
                                className="toggle-button"
                                onClick={() => setShowCompleted(!showCompleted)}
                            >
                                {showCompleted ? 'Hide' : 'Show'} ({completedTodos.length})
                            </button>
                        </div>
                        {showCompleted && (
                            <div className="todo-list completed-list">
                                {completedTodos.map(todo => (
                                    <div key={todo.id} className="todo-item completed-item">
                                        <div className="todo-content">
                                            <button 
                                                className="checkbox checked"
                                                onClick={() => changeState(todo.id)}
                                            >
                                                <span>✓</span>
                                            </button>
                                            {editingId === todo.id ? (
                                                <input
                                                    type="text"
                                                    value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                    onBlur={() => saveEdit(todo.id)}
                                                    onKeyDown={(e) => handleKeyDown(e, todo.id)}
                                                    className="edit-input"
                                                    autoFocus
                                                />
                                            ) : (
                                                <span 
                                                    className="todo-title completed"
                                                    onClick={() => startEditing(todo.id)}
                                                >
                                                    {todo.title}
                                                </span>
                                            )}
                                        </div>
                                        <button 
                                            className="delete-button"
                                            onClick={() => deleteToDo(todo.id)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
