import InvoicesList from "./InvoicesList";

function Dashboard() {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="todo-invoices-list-wrapper">
        <InvoicesList />
      </div>
    </div>
  );
}

export default Dashboard;
