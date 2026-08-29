import { useNavigate } from 'react-router-dom';
import InvoicesList from "./InvoicesList";
import { hasHeadersAndCookies } from '../services/api';
import { useEffect } from 'react';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasHeadersAndCookies()) {
      navigate('/signin');
      return;
    }
  }, [navigate]);

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
