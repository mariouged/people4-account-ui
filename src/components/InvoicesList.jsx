import { useEffect, useState } from "react";
import { fetchInvoices } from '../services/invoiceApi';

function InvoicesList({ account, setAccount }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const getInvoices = async () => {
      setLoading(true);
      const result = await fetchInvoices({ account, setAccount });
      setLoading(false);
      setInvoices(result.invoices);
      setError(result.ok ? null : result.message);
    };

    getInvoices();

  }, [account, setAccount]);

  const formatDate = (value) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString();
  };

  const formatAmount = (value) => {
    if (value === undefined || value === null) return "";
    return Number(value).toFixed(2);
  };

  if (loading) {
    return (
      <div className="card">
        <h2>Invoices</h2>
        <p>Loading invoices…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2>Invoices</h2>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Invoices</h2>
      <table className="invoices-table">
        <thead>
          <tr>
            <th>Number</th>
            <th>Issue Date</th>
            <th>Buyer</th>
            <th>Line Extension</th>
            <th>Tax Exclusive</th>
            <th>Tax Amount</th>
            <th>Payable</th>
            <th>Currency</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length === 0 ? (
            <tr>
              <td colSpan={8}>No invoices found.</td>
            </tr>
          ) : (
            invoices.map((inv, index) => (
              <tr key={inv?.invoice?.number ?? index}>
                <td>{inv?.invoice?.number}</td>
                <td>{formatDate(inv?.invoice?.issueDate)}</td>
                <td>{inv?.buyer?.legalName}</td>
                <td>{formatAmount(inv?.totals?.lineExtension)}</td>
                <td>{formatAmount(inv?.totals?.taxExclusive)}</td>
                <td>{formatAmount(inv?.totals?.taxAmount)}</td>
                <td>{formatAmount(inv?.totals?.payable)}</td>
                <td>{inv?.invoice?.currency}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default InvoicesList;