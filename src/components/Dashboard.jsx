import InvoicesList from "./InvoicesList";

function Dashboard({ account, setAccount }) {

  if (!account) return (<p>No account available. Please Log in.</p>);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="todo-summary">
        <p>Summary of your tasks and invoices will appear here.</p>
        <ul>
          <li>Legal name: {account.legalName}</li>
          <li>Domain: {account.domain}</li>
          <li>VAT ID: {account.vatId}</li>
        </ul>
      </div>
      <div className="todo-invoices-list-wrapper">
        <InvoicesList account={account} setAccount={setAccount}/>
      </div>
    </div>
  );
}

export default Dashboard;