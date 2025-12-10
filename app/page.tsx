"use client";

import { useState, useEffect, useRef } from "react";
import { Employee } from "@/lib/types";
import MemeCard from "@/components/MemeCard";
import Link from "next/link";
import { useCameraContext } from "@/lib/CameraContext";

export default function MainPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const memeCardRef = useRef<HTMLDivElement | null>(null);
  const { selectEmployee: setContextEmployee, savedImage } = useCameraContext();

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Auto-select employee when modal opens
  useEffect(() => {
    if (selectedEmployee && isModalOpen) {
      setContextEmployee(selectedEmployee.id);
    } else if (!isModalOpen) {
      setContextEmployee(null);
    }
  }, [selectedEmployee, isModalOpen]);

  // Listen for saved images and refresh the employee list
  useEffect(() => {
    if (savedImage) {
      fetchEmployees();
      // If modal is open, update the selected employee
      if (selectedEmployee) {
        setTimeout(async () => {
          const response = await fetch(`/api/employees/${selectedEmployee.id}`);
          if (response.ok) {
            const updatedEmployee = await response.json();
            setSelectedEmployee(updatedEmployee);
          }
        }, 500);
      }
    }
  }, [savedImage]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
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
          <div className="flex gap-4">
            <Link
              href="/employees"
              className="clay-button px-6 py-3 text-white font-semibold"
            >
              Manage Employees
            </Link>
            <Link
              href="/meme-yourself"
              className="bg-purple-500 hover:bg-purple-600 px-6 py-3 text-white font-semibold rounded-lg transition-all shadow-lg"
            >
              📸 Meme Yourself
            </Link>
          </div>
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
                <MemeCard employee={selectedEmployee} isLarge />
              </div>

              <div className="mb-6 flex justify-center">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
