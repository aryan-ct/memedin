"use client";

import { useState, useEffect, useRef } from "react";
import { Employee } from "@/lib/types";
import MemeCard from "@/components/MemeCard";
import Link from "next/link";

export default function MainPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const memeCardRef = useRef<HTMLDivElement | null>(null);

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

  const refetchEmployee = async (employeeId: string) => {
    try {
      const response = await fetch(`/api/employees/${employeeId}`);
      if (response.ok) {
        const updatedEmployee = await response.json();
        // Update in the employees list
        setEmployees((prev) =>
          prev.map((emp) => (emp.id === employeeId ? updatedEmployee : emp))
        );
        // Update in modal if it's the selected employee
        if (selectedEmployee?.id === employeeId) {
          setSelectedEmployee(updatedEmployee);
        }
      }
    } catch (error) {
      console.error("Error refetching employee:", error);
    }
  };

  const resetEmployeeImage = async (employeeId: string) => {
    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: "" }),
      });
      if (response.ok) {
        const updatedEmployee = await response.json();
        // Update in the employees list
        setEmployees((prev) =>
          prev.map((emp) => (emp.id === employeeId ? updatedEmployee : emp))
        );
        // Update in modal if it's the selected employee
        if (selectedEmployee?.id === employeeId) {
          setSelectedEmployee(updatedEmployee);
        }
      }
    } catch (error) {
      console.error("Error resetting employee image:", error);
    }
  };

  const handleCardClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDownloadMeme = async () => {
    if (!selectedEmployee?.imageUrl || !memeCardRef.current) return;
    try {
      setIsDownloading(true);
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(memeCardRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${selectedEmployee.name}-meme.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download meme", err);
      alert("Unable to download meme right now. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">MemedIn</h1>
            <p className="text-white/90 text-lg">Host Control Panel</p>
          </div>
          {/* <div className="flex gap-4">
            <Link
              href="/employees"
              className="clay-button px-6 py-3 text-white font-semibold"
            >
              Manage Employees
            </Link>
          </div> */}
        </div>

        {/* Meme Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {employees.map((employee) => (
            <div key={employee.id} className="clay-card">
              <MemeCard
                employee={employee}
                onClick={() => handleCardClick(employee)}
              />
            </div>
          ))}

          {employees.length === 0 && (
            <div className="col-span-full text-center py-16">
              <p className="text-white text-2xl mb-4">No memes yet!</p>
              <Link
                href="/employees"
                className="clay-button inline-block px-8 py-4 text-white font-semibold"
              >
                Add Your First Employee
              </Link>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && selectedEmployee && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 max-w-3xl w-full shadow-clay-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  {selectedEmployee.name}'s Meme
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-800 text-4xl font-bold leading-none"
                >
                  ×
                </button>
              </div>

              {/* Large Meme Card */}
              <div className="mb-6 flex justify-center" ref={memeCardRef}>
                <MemeCard
                  employee={selectedEmployee}
                  isLarge
                  showQR={true}
                />
              </div>

              <div className="mb-6 flex justify-center gap-4">
                <button
                  onClick={() => refetchEmployee(selectedEmployee.id)}
                  className="bg-blue-500 hover:bg-blue-600 px-6 py-3 text-white font-semibold rounded-lg transition-all shadow-lg"
                >
                  🔄 Reload
                </button>
                <button
                  onClick={handleDownloadMeme}
                  disabled={!selectedEmployee.imageUrl || isDownloading}
                  className="clay-button px-6 py-3 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedEmployee.imageUrl
                    ? isDownloading
                      ? "Preparing..."
                      : "⬇️ Download Meme"
                    : "No meme to download"}
                </button>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to remove this photo? This cannot be undone."
                      )
                    ) {
                      resetEmployeeImage(selectedEmployee.id);
                    }
                  }}
                  disabled={!selectedEmployee.imageUrl}
                  className="bg-red-500 hover:bg-red-600 px-6 py-3 text-white font-semibold rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🗑️ Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
