'use client'

import { Dispatch, PropsWithChildren, useContext, useReducer, createContext, useState } from 'react'
import { Button } from '@/components/ui/button'
import { createSelectorContext, useContextSelector } from './useContextSelector';

type State = { value: string[], description: string }

const TasksContext = createSelectorContext<State | null>(null);

const TasksDispatchContext = createContext<Dispatch<Action> | null>(null);

type Action =
  { type: 'ADD_TASK', payload: string } |
  { type: 'EDIT_DESCRIPTION', payload: string }

const taskReducer = (state: State, action: Action) => {
  if (action.type === 'ADD_TASK') {
    return { ...state, value: [...state.value, action.payload] }
  }

  if (action.type === 'EDIT_DESCRIPTION') {
    return { ...state, description: action.payload }
  }

  return state;
}

function Provider({ children }: PropsWithChildren) {
  const [count, setCount] = useState(0)
  const [tasks, dispatch] = useReducer(taskReducer, {
    value: ['tet', 'asdf', 'dsfeee', 'ewefwefew', 'wefewfwefewf'],
    description: 'good'
  });

  console.log('provider render!!')

  return (
    <TasksContext.Provider value={tasks}>
      <Button onClick={() => setCount(count + 1)}>
        count: {count}
      </Button>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  )
}

const useValContext = <R,>(selector: (s: State | null) => R) => {
  return useContextSelector(TasksContext, selector);
}

const useDispatchContext = () => {
  const context = useContext(TasksDispatchContext);
  if (!context) {
    throw new Error('useDispatchContext must be used within a Provider')
  }
  return context;
}

export default function Page() {
  return (
    <Provider>
      <Title />
      <ButtonA />
      <div className='flex flex-col'>
        <ItemOne />
        <Tasks />
      </div>
      <EditDescriptButton />
      <Descriptoin />
    </Provider>
  )
}

function ItemOne() {
  const item = useValContext(v => v.value);
  const itemOne = item[0];

  console.log('itemOne! render!!', itemOne)

  return <div>
    <h1>{itemOne}</h1>
  </div>
}

let j = 1;

function Descriptoin() {
  const description = useValContext(v => v.description);
  console.log('description render!!')
  return <h1>{description}</h1>
}

function EditDescriptButton() {
  const dispatch = useDispatchContext();
  console.log('EditDescript render!!')

  const newString = 'asdfsda'

  return <Button onClick={() => dispatch({ type: 'EDIT_DESCRIPTION', payload: `${newString} ${j++}` })}>Edit descriptino</Button>
}

let i = 1;

function ButtonA() {
  const dispatch = useDispatchContext();
  console.log('buttonA render!!')

  return (
    <Button onClick={() => dispatch({ type: 'ADD_TASK', payload: `new task ${i++}` })}>Add Task</Button>
  )
}

function Title() {
  console.log('title render!!')
  return (
    <h1>Tasks</h1>
  )
}

function Tasks() {
  const tasks = useValContext(v => v.value);

  console.log('task render!!')

  return <div>
    {tasks.map(task => (<h2 key={task}>{task}</h2>))}
  </div>
}
