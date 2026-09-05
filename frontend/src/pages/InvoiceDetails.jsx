import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Printer, ArrowLeft } from 'lucide-react';

const InvoiceDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const res = await api.get(`/invoices/${id}`);
      setInvoice(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading invoice...</div>;
  if (!invoice) return <div className="p-8 text-center text-red-500">Invoice not found.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Action Bar - Hidden when printing */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Link to="/invoices" className="flex items-center text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Invoices
        </Link>
        <button
          onClick={handlePrint}
          className="flex items-center px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print / Save PDF
        </button>
      </div>

      {/* Printable Invoice Container */}
      <div className="bg-white p-12 rounded-2xl shadow-lg border border-gray-100 print:shadow-none print:border-none print:p-0">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            {/* Premium Gated Logo Feature */}
            {user?.role === 'premium' && user?.logoUrl ? (
              <img 
                src={`http://localhost:5000${user.logoUrl}`} 
                alt="Company Logo" 
                className="h-16 object-contain mb-4"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="h-16 flex items-center">
                <h1 className="text-3xl font-extrabold text-gray-900">{user?.name}</h1>
              </div>
            )}
            <div className="text-gray-500 text-sm mt-2">
              <p>{user?.email}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-bold text-gray-200 uppercase tracking-wider mb-2">INVOICE</h2>
            <p className="text-lg font-semibold text-gray-800">#{invoice.invoiceNumber}</p>
            <p className="text-gray-500 mt-1">
              Date: {new Date(invoice.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-500">
              Due: <span className="font-medium text-gray-700">{new Date(invoice.dueDate).toLocaleDateString()}</span>
            </p>
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-10 p-6 bg-gray-50 rounded-xl border border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Bill To</h3>
          <p className="text-lg font-bold text-gray-800">{invoice.clientId?.name}</p>
          <p className="text-gray-600 mt-1">{invoice.clientId?.email}</p>
          {invoice.clientId?.phone && <p className="text-gray-600">{invoice.clientId.phone}</p>}
          {invoice.clientId?.billingAddress && (
            <p className="text-gray-600 mt-2 whitespace-pre-wrap">{invoice.clientId.billingAddress}</p>
          )}
        </div>

        {/* Line Items */}
        <div className="mb-8">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 font-semibold text-gray-700 uppercase text-sm tracking-wider">Description</th>
                <th className="py-3 text-right font-semibold text-gray-700 uppercase text-sm tracking-wider w-24">Qty</th>
                <th className="py-3 text-right font-semibold text-gray-700 uppercase text-sm tracking-wider w-32">Unit Price</th>
                <th className="py-3 text-right font-semibold text-gray-700 uppercase text-sm tracking-wider w-32">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.lineItems.map((item, index) => (
                <tr key={index}>
                  <td className="py-4 text-gray-800">{item.description}</td>
                  <td className="py-4 text-right text-gray-600">{item.quantity}</td>
                  <td className="py-4 text-right text-gray-600">${item.unitPrice.toFixed(2)}</td>
                  <td className="py-4 text-right font-medium text-gray-800">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-end pt-6 border-t-2 border-gray-200">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax ({invoice.taxRate}%)</span>
              <span>${invoice.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold text-gray-900 pt-3 border-t border-gray-100">
              <span>Total</span>
              <span>${invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
