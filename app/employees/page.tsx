"use client";

import { useState, useEffect } from "react";
import { Employee } from "@/lib/types";
import Link from "next/link";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({ name: "", caption: "" });
  const [loading, setLoading] = useState(false);

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingEmployee) {
        // Update existing employee
        const response = await fetch(`/api/employees/${editingEmployee.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          await fetchEmployees();
        }
      } else {
        // Create new employee
        const response = await fetch("/api/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          await fetchEmployees();
        }
      }

      closeModal();
    } catch (error) {
      console.error("Error saving employee:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchEmployees();
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const openModal = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({ name: employee.name, caption: employee.caption });
    } else {
      setEditingEmployee(null);
      setFormData({ name: "", caption: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setFormData({ name: "", caption: "" });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1
              className="text-4xl font-normal text-white mb-2"
              style={{ fontFamily: "'Rubik Bubbles'" }}
            >
              MemedIn
            </h1>
            <p className="text-white/80">Manage your team members</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/"
              className="clay-button px-6 py-3 text-white font-semibold"
            >
              Main Page
            </Link>
            <button
              onClick={() => openModal()}
              className="clay-button px-6 py-3 text-white font-semibold"
            >
              + Add Employee
            </button>
          </div>
        </div>

        {/* Employees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <div key={employee.id} className="clay-card p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {employee.name}
                </h3>
                <p className="text-gray-600 italic">"{employee.caption}"</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => openModal(employee)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(employee.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {employees.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-white text-xl">
                No employees yet. Add your first team member!
              </p>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="clay-card p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {editingEmployee ? "Edit Employee" : "Add Employee"}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="clay-input w-full px-4 py-3 text-gray-800"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Caption
                  </label>
                  <textarea
                    value={formData.caption}
                    onChange={(e) =>
                      setFormData({ ...formData, caption: e.target.value })
                    }
                    className="clay-input w-full px-4 py-3 text-gray-800 min-h-[100px]"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="clay-button flex-1 py-3 text-white font-semibold disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 py-3 rounded-lg font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
