import React, { useState, useEffect } from "react";

function Applist() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);

  const url = "https://assets.breatheco.de/apis/fake/todos/user/sebaaguayou";

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (editingIndex !== -1) {
      actualizarapi(todos);
    }
  }, [editingIndex]);

  const actualizarapi = (todos) => {
    fetch(url, {
      method: "PUT",
      body: JSON.stringify(todos),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        console.log(resp.ok);
        console.log(resp.status);
        console.log(resp.json());
        return resp.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddTodo = () => {
    if (inputValue.trim() === "") {
      return;
    }
    if(editingIndex === -1){
      const newTodos=[...todos, { label: inputValue, done: false }];
      setTodos (newTodos);
      actualizarapi(newTodos);
    } else {
      const newTodos=[...todos];
      newTodos[editingIndex].label=inputValue;
      setTodos(newTodos);
      setEditingIndex(-1);
      actualizarapi(newTodos)
    }
      setInputValue("");
  };
  const handleDeleteTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
    actualizarapi(newTodos);
  };

  const handleEditTodo= (index) => {
    setEditingIndex(index);
    setInputValue(todos[index].label);
  }

  function remainingTasks() {
    const numCompleted = todos.filter((todo) => todo.done).length;
    const numRemaining = todos.length - numCompleted;
    return numRemaining;
  }

  return (
    <div className="Applist">
      <h1>Todo List</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Tareas por hacer"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <button onClick={handleAddTodo}>{editingIndex === -1 ? "Añadir" : "Actualizar"}</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo, index) => (
          <li key={index}>
            {todo.label}
            <button className="btn btnEditar" onClick={() => handleEditTodo(index)}>Editar</button>
            <button onClick={() => handleDeleteTodo(index)}>Borrar</button>
          </li>
        ))}
        <p>{remainingTasks()} Tareas restantes</p>
      </ul>
    </div>
  );
}

export default Applist;
