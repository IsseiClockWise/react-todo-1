import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import logo from './logo.svg';
import './App.css';

//To do listのタスクの状態
const listName = {
  list1: 'todo',
  list2: 'progress',
  list3: 'done'
};

//To do list内のタスクの順番を変更
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

//To do list内のタスクを削除
const deleteItem = (list, index) => {
  const result = Array.from(list);
  result.splice(index, 1);
  return result;
};

//To do listのタスクの状態を変更
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);
  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;
  return result;
};

//To do list内のアイテム(タスク)のcss
const getItemStyle = draggableStyle => ({
  displey: 'flex',
  padding: '1rem',
  marginBottom: '0.5rem',
  background: '#fff8e8',
  borderLeft: 'solid 0.5rem #ffc06e',
  color: '#282c34',

  ...draggableStyle
});

//To do listのcss
const getListStyle = isDraggingOver => ({
  padding: '1rem',
  margin: '1rem',
  background: 'white',
  minWidth: '200px',
  height: '70vh',
  border: isDraggingOver ? 'solid 5px lightgray' : 'solid 5px white',
  borderRadius: '0.5rem',
  textAlign: 'left',
});

function List(props) {
  const listTitle = {
    list1: 'To do',
    list2: 'In progress',
    list3: 'Done'
  };

  return (
    <div className="To-do-list">
      <Droppable droppableId={props.id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            <h2>{listTitle[props.id]}</h2>
            {props.list.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(provided.draggableProps.style)}
                  >
                    <input
                      type="text"
                      className="Item-form"
                      placeholder="Please enter your task"
                      value={item.text}
                      onChange={e => props.onUpdateItems(props.id, index, e)}
                    />
                    <button className="Delete-item-btn" onClick={() => props.onDeleteItemForList(props.id, index)}></button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <button className="Add-item-btn" onClick={() => props.onAddItems(props.id)}></button>
          </div>
        )}
      </Droppable>
    </div>
  );
}

function ToDoListContainer() {
  const [todo, setTodoList] = useState([
    {
      id: 'item-1',
      text: ''
    }
  ]);
  const [progress, setProgressList] = useState([]);
  const [done, setDoneList] = useState([]);
  const [itemCount, setItemCount] = useState(1);

  const getList = id => {
    if (listName[id] === 'todo') {
      return todo;
    } else if (listName[id] === 'progress') {
      return progress;
    } else if (listName[id] === 'done') {
      return done;
    }
  }

  const setItemInList = (id, list) => {
    if (listName[id] === 'todo') {
      setTodoList(list);
    } else if (listName[id] === 'progress') {
      setProgressList(list);
    } else if (listName[id] === 'done') {
      setDoneList(list);
    }
  }

  const onDragEnd = result => {
    const { source, destination } = result;
    if (!result.destination) {
      return;
    }
    if (source.droppableId === destination.droppableId) {
      const update = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      );
      setItemInList(source.droppableId, update);
    } else {
      const result = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );
      setItemInList(source.droppableId, result[source.droppableId]);
      setItemInList(destination.droppableId, result[destination.droppableId]);
    }
  }

  const addItems = id => {
    setItemInList(
      id,
      getList(id).concat(
        {
          id: `item-${itemCount + 1}`,
          text: ''
        }
      )
    );
    setItemCount(itemCount + 1);
  }

  const updateItems = (id, idx, e) => {
    const list_copy = getList(id).slice();
    list_copy[idx].text = e.target.value;
    setItemInList(id, list_copy);
  }

  const deleteItemForList = (id, idx) => {
    const removed = deleteItem(getList(id),idx);
    setItemInList(id, removed);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="To-do-list-container">
        {Object.keys(listName).map(key =>
          <List
            key={key}
            id={key}
            list={getList(key)}
            onAddItems={addItems}
            onUpdateItems={updateItems}
            onDeleteItemForList={deleteItemForList}
          />
        )}
      </div>
    </DragDropContext>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>
          To do list
        </h1>
      </header>
      <ToDoListContainer />
    </div>
  );
}

export default App;
