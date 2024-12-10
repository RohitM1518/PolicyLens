import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { useSelector } from 'react-redux';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import PageHeader from '../components/shared/PageHeader';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { fadeIn, scaleIn } from '../styles/animations';

const insuranceTypes = [
    'Life Insurance',
    'Health Insurance',
    'Motor Insurance',
    'Home Insurance',
    'Travel Insurance',
];

const frequencies = ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'];

export default function Dashboard() {
    const [insurances, setInsurances] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [loading, setLoading] = useState(true);
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const accessToken = useSelector((state) => state?.currentUser?.accessToken);

    const [formData, setFormData] = useState({
        type: '',
        premium: '',
        frequency: '',
        renewalDate: new Date(),
        sumInsured: '',
        reminder: false,
    });

    useEffect(() => {
        const fetchInsurances = async () => {
            try {
                const res = await axios.get(`${backendURL}/insurance`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setInsurances(res.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching insurances:', error);
                setLoading(false);
            }
        };
        fetchInsurances();
    }, []);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedInsurances = [...insurances].sort((a, b) => {
        if (!sortField) return 0;
        const aValue = a[sortField];
        const bValue = b[sortField];
        return sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${backendURL}/insurance/${editingId}`, formData, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setEditingId(null);
            } else {
                const res = await axios.post(`${backendURL}/insurance`, formData, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                console.log(res.data.data)
                setInsurances([...insurances, res.data.data]);
            }
            setFormData({
                type: '',
                premium: '',
                frequency: '',
                renewalDate: new Date(),
                sumInsured: '',
                reminder: false,
            });
            setShowForm(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleEdit = (insurance) => {
        setFormData(insurance);
        setEditingId(insurance._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${backendURL}/insurance/${id}`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setInsurances(insurances.filter(ins => ins._id !== id));
        } catch (error) {
            console.error('Error deleting insurance:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <motion.div {...fadeIn} className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <PageHeader
                                title="My Insurances"
                                subtitle="Manage your insurance policies in one place"
                            />
                            <Button
                                onClick={() => setShowForm(!showForm)}
                                variant="primary"
                            >
                                {showForm ? 'Cancel' : 'Add Insurance'}
                            </Button>
                        </div>

                        {showForm && (
                            <motion.form
                                {...scaleIn}
                                onSubmit={handleSubmit}
                                className="mb-8 bg-gray-50 p-6 rounded-lg"
                            >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Insurance Type
                                            </label>
                                            <select
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                                required
                                            >
                                                <option value="">Select type</option>
                                                {insuranceTypes.map((type) => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Premium Amount
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.premium}
                                                onChange={(e) => setFormData({ ...formData, premium: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Payment Frequency
                                            </label>
                                            <select
                                                value={formData.frequency}
                                                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                                required
                                            >
                                                <option value="">Select frequency</option>
                                                {frequencies.map((freq) => (
                                                    <option key={freq} value={freq}>{freq}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Renewal Date
                                            </label>
                                            <DatePicker
                                                selected={formData.renewalDate}
                                                onChange={(date) => setFormData({ ...formData, renewalDate: date })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                                dateFormat="dd/MM/yyyy"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Sum Insured
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.sumInsured}
                                                onChange={(e) => setFormData({ ...formData, sumInsured: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                                required
                                            />
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.reminder}
                                                onChange={(e) => setFormData({ ...formData, reminder: e.target.checked })}
                                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                            />
                                            <label className="ml-2 block text-sm text-gray-900">
                                                Set Renewal Reminder
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="submit"
                                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary"
                                        >
                                            {editingId ? 'Update Insurance' : 'Add Insurance'}
                                        </button>
                                    </div>
                            </motion.form>
                        )}

                        {insurances.length > 0 ? (
                            <motion.div {...fadeIn} className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {['Type', 'Premium', 'Frequency', 'Renewal Date', 'Sum Insured', 'Reminder', 'Actions'].map((header) => (
                                                <th
                                                    key={header}
                                                    onClick={() => header !== 'Actions' && header !== 'Reminder' && handleSort(header.toLowerCase())}
                                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header !== 'Actions' && header !== 'Reminder' ? 'cursor-pointer hover:text-gray-900' : ''
                                                        }`}
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {sortedInsurances.map((insurance) => (
                                            <tr key={insurance.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{insurance.type}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">₹{insurance.premium}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{insurance.frequency}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {format(new Date(insurance.renewalDate), 'dd/MM/yyyy')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">₹{insurance.sumInsured}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {insurance.reminder ? 'Yes' : 'No'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleEdit(insurance)}
                                                        className="text-primary hover:text-secondary mr-4"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(insurance._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        ) : (
                            <EmptyState
                                icon={ClipboardDocumentListIcon}
                                title="No insurances yet"
                                description="Add your first insurance policy to get started"
                                action={
                                    <Button
                                        onClick={() => setShowForm(true)}
                                        variant="primary"
                                    >
                                        Add Insurance
                                    </Button>
                                }
                            />
                        )}
                    </div>
                </Card>
            </div>
        </motion.div>
    );
}