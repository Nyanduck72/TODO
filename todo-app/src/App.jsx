import React, { useState, useEffect } from 'react';
import './App.css';

import { app } from './firebase';
import { getFirestore, collection, onSnapshot, deleteDoc, addDoc, doc } from 'firebase/firestore';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const db = getFirestore(app); // Initialize Firestore using the Firebase app instance

    const todosRef = collection(db, 'notes');

    const unsubscribe = onSnapshot(todosRef, (snapshot) => {
      const todosData = [];
      snapshot.forEach((doc) => {
        todosData.push({ id: doc.id, ...doc.data() });
      });
      setTodos(todosData);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteTodo = async (id) => {
    const db = getFirestore(app);
    const todoDocRef = doc(db, 'notes', id);

    try {
      await deleteDoc(todoDocRef);
      console.log('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleAddTodo = async () => {
    if (newTodo.trim() === '') return;

    const db = getFirestore(app);

    try {
      await addDoc(collection(db, 'notes'), {
        desc: newTodo
      });
      console.log('Task added successfully');
      setNewTodo('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <>
    <div className='overlay'>
    <div className="container w-full">
        <div className='mx-auto bg-neutral-50 px-16 py-8 shadow-xl shadow-neutral-950/50 rounded'>
          <h1 className='text-center text-emerald-600 font-bold'>TO-DO APP</h1>
          <p className='text-neutral-600 font-bold'>For your forgetfulness :P</p>
          <div className="items-center space-x-2 pt-8">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Enter new task: "
              className="text-neutral-700 bg-transparent border-b-2 border-neutral-700 px-3 py-1 focus:outline-none focus:border-b-2 focus:border-emerald-600"
            />
            <button onClick={handleAddTodo} className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">Add Task</button>
        </div>
        </div>
      </div>

      <div className='container mt-8 w-full'>
        <div className='mx-auto bg-neutral-50 px-16 py-8 shadow-xl shadow-neutral-950/50 rounded'>
          <h2 className='text-center text-emerald-600 font-bold'>STUFF TO DO</h2>
          <ul>
            {todos.map(todo => (
              <div className='py-4 border-b-2 border-solid border-neutral-700 last:border-b-0'>
                <li className='text-neutral-700 px-4 ' key={todo.id}>{todo.desc}<button onClick={() => handleDeleteTodo(todo.id)} className='bg-neutral-700 ml-4 px-2 py-2 rounded text-emerald-600 hover:outline hover:outline-4 hover:outline-emerald-600 hover:transition-all'>Done with it!</button></li>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
    </>
  );
}

export default App;