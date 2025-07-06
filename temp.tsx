'use client'

import { PropsWithChildren, useRef, useState } from 'react'

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto p-8 space-y-10">
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">Not children</h1>
        <NoChildren />
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">With children</h1>
        <WithChildren>
          <Debugger message="WithChildren Debugger" />
        </WithChildren>
      </div>
    </div>
  )
}

function NoChildren() {
  const [count, setCount] = useState(0)

  return (
    <div className="space-y-3">
      <p className="font-semibold text-blue-700">count: {count}</p>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => setCount(count + 1)}
      >
        Up!
      </button>

      <Debugger message="NoChildren Debugger" />
    </div>
  )
}

function WithChildren({ children }: PropsWithChildren) {
  const [count, setCount] = useState(0)

  return (
    <div className="space-y-3">
      <p className="font-semibold text-blue-700">count: {count}</p>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => setCount(count + 1)}
      >
        Up!
      </button>
      {children}
    </div>
  )
}

function Debugger({ message }: { message: string }) {
  const countRef = useRef(0)

  console.log(`[${++countRef.current}]: ${message}`)

  return <p className="text-xs text-gray-500 mt-2 italic">print({message})</p>
}
