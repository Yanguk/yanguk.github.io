'use client'

import { Dispatch, PropsWithChildren, useContext, useReducer, createContext } from 'react'
import { Button } from '@/components/ui/button'
import { createSelectorContext, useContextSelector } from './useContextSelector';

type State = { value: string[], description: string }

const TasksContext = createSelectorContext<State>({
  value: [],
  description: 'good'
});

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
  const [tasks, dispatch] = useReducer(taskReducer, {
    value: [],
    description: 'good'
  });

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  )
}

const useValContext = <R,>(selector: (s: State) => R) => {
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
        <Tasks />
      </div>
      <EditDescriptButton />
      <Descriptoin />
    </Provider>
  )
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