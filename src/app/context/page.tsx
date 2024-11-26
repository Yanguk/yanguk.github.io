'use client'

import  { createContext, Dispatch, PropsWithChildren, useContext, useReducer } from 'react'

const TasksContext = createContext<string[] | null>([]);
const TasksDispatchContext = createContext<Dispatch<Action> | null>(null);

type Action = 
  { type: 'ADD_TASK', payload: string }

const taskReducer = (state: string[], action: Action) => {
  if (action.type === 'ADD_TASK') {
    return [...state, action.payload]
  }

  return state;
}

function Provider({children}: PropsWithChildren) {
  const [tasks, dispatch] = useReducer(taskReducer, []);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  )
}

const useValContext = () => {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error('useContext must be used within a Provider')
  }
  return context;
}

const useDispatchContext = () => {
  const context = useContext(TasksDispatchContext);
  if (!context) {
    throw new Error('useDispatchContext must be used within a Provider')
  }
  return context;
}

export default function Page() {
  console.log('page')
  return (
    <Provider>
      <Title />
      <Button />
      <div className='flex flex-col'>
        <Tasks />
      </div>
    </Provider>
  )
}

let i = 1;

function Button() {
  const dispatch = useDispatchContext();
  console.log('button')

  return (
    <button onClick={() => dispatch({type: 'ADD_TASK', payload: `new task ${i++}`})}>Add Task</button>
  )
}

function Title () {
  console.log('title')
  return (
    <h1>Tasks</h1>
  )
}

function Tasks () {
  const tasks = useValContext();

  console.log('task')

  return <div>
  {tasks.map(task => (<h2 key={task}>{task}</h2>))}
  </div>

}
