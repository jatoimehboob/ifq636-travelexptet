const Dashboard = () => {
  return (

    <div className="p-6 w-full bg-gray-100 min-h-screen">

<h1 className="text-3xl font-bold mb-6">
  Dashboard
</h1>

<div className="bg-white p-8 rounded shadow">
  <h2 className="text-2xl font-semibold mb-4 text-blue-600">
    Welcome to Travel Expense Tracker
  </h2>

  <p className="text-gray-600 mb-4">
    Manage your travel expenses efficiently by adding, editing,
    and tracking your expenses in one place.
  </p>

  <div className="space-y-3">
    <div className="bg-blue-50 p-4 rounded">
      📌 Add new travel expenses
    </div>

    <div className="bg-blue-50 p-4 rounded">
      📊 View and manage expense reports
    </div>

    <div className="bg-blue-50 p-4 rounded">
      💰 Track your spending history
    </div>

    <div className="bg-blue-50 p-4 rounded">
      ⚙️ Update account settings securely
    </div>
  </div>
</div>



      </div>

    
  );
};

export default Dashboard;