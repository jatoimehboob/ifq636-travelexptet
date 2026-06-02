const Dashboard = () => {
  return (

    <div className="p-6 w-full bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-5">

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">
            Total Expenses
          </h2>

          <p className="text-3xl font-bold mt-2">
            $12,500
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">
            Monthly Spending
          </h2>

          <p className="text-3xl font-bold mt-2">
            $4,200
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">
            Total Trips
          </h2>

          <p className="text-3xl font-bold mt-2">
            24
          </p>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;