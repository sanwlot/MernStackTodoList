import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const [updateInput, setUpdateInput] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  function addItem() {
    // add item to POST request
    fetch("http://localhost:8787/tasks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: todoInput,
        completed: false,
        date: new Date(),
      }),
    })
      .then(() => {
        loadItems();
        setTodoInput("");
        console.log("Item Added");
      })
      .catch((error) => {
        console.log(error);
        console.log("Item Not Added");
      });
  }
  async function loadItems() {
    const response = await fetch("http://localhost:8787/tasks/");
    const data = await response.json();
    setTodoList(data);
  }
  function updateItem(id) {
    // update request with id
    fetch(`http://localhost:8787/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: updateInput,
      }),
    })
      .then(() => {
        loadItems();
        console.log("Item Updated");
      })
      .catch((error) => {
        console.log(error);
        console.log("Item Not Updated");
      });
  }
  function deleteItem(id) {
    // delete request with id
    fetch(`http://localhost:8787/tasks/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        loadItems();
        console.log("Item Deleted");
      })
      .catch((error) => {
        console.log(error);
        console.log("Item Not Deleted");
      });
  }

  function toggleDoneClass(id) {
    // Find the item in the todo list
    const item = todoList.find((item) => item._id === id);

    if (!item) {
      console.error(`Item with id ${id} not found`);
      return;
    }

    console.log(`Toggling item: ${item.name}, completed: ${item.completed}`);

    // Send PATCH request to update the item's completion status
    fetch(`http://localhost:8787/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: !item.completed,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to update item with id ${id}`);
        }
        console.log(`Item with id ${id} updated successfully`);
        // Reload items after successful update
        return loadItems();
      })
      .then(() => {
        console.log("Items reloaded");
      })
      .catch((error) => {
        console.error(`Error updating item: ${error.message}`);
      });
  }

  return (
    <div className="app-container container">
      <h1>MERN TodoList</h1>
      <input
        onChange={(e) => setTodoInput(e.target.value)}
        value={todoInput}
        className="todo-input"
        type="text"
        placeholder="Add Todo"
      />
      <button onClick={addItem}>Add</button>
      <ul className="todo-list-container">
        {todoList.map((item) => {
          return (
            <li key={item._id} className="todo-item">
              <div className="todo-item-container">
                <div
                  className={
                    "todo-item-title" + (item.completed ? " done" : "")
                  }
                  onClick={() => toggleDoneClass(item._id)}
                >
                  {item.name}
                </div>
                <div>
                  <input
                    type="text"
                    className="update-input"
                    placeholder="Update Todo"
                    // value={updateInput}
                    onChange={(e) => setUpdateInput(e.target.value)}
                  />
                </div>
                <div className="todo-item-buttons">
                  <button onClick={() => updateItem(item._id)}>Update</button>
                  <button onClick={() => deleteItem(item._id)}>Delete</button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
