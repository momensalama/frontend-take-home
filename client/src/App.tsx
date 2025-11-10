import LoadsTable from './components/LoadsTable'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Shipping Loads</h1>
        <LoadsTable />
      </div>
    </div>
  )
}

export default App
