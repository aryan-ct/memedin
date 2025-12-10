import { promises as fs } from 'fs';
import path from 'path';
import { MemeData, Employee } from './types';

const DB_PATH = path.join(process.cwd(), 'data', 'employees.json');

// Initialize the database file if it doesn't exist
async function initDB(): Promise<void> {
  try {
    await fs.access(DB_PATH);
  } catch {
    // File doesn't exist, create it with empty data
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify({ employees: [] }, null, 2));
  }
}

// Read all employees from the JSON file
export async function getEmployees(): Promise<Employee[]> {
  await initDB();
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const parsed: MemeData = JSON.parse(data);
    return parsed.employees || [];
  } catch (error) {
    console.error('Error reading employees:', error);
    return [];
  }
}

// Save employees to the JSON file
async function saveEmployees(employees: Employee[]): Promise<void> {
  await initDB();
  const data: MemeData = { employees };
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// Get a single employee by ID
export async function getEmployeeById(id: string): Promise<Employee | null> {
  const employees = await getEmployees();
  return employees.find(emp => emp.id === id) || null;
}

// Create a new employee
export async function createEmployee(employee: Omit<Employee, 'id' | 'createdAt'>): Promise<Employee> {
  const employees = await getEmployees();
  const newEmployee: Employee = {
    ...employee,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  employees.push(newEmployee);
  await saveEmployees(employees);
  return newEmployee;
}

// Update an existing employee
export async function updateEmployee(id: string, updates: Partial<Omit<Employee, 'id' | 'createdAt'>>): Promise<Employee | null> {
  const employees = await getEmployees();
  const index = employees.findIndex(emp => emp.id === id);

  if (index === -1) return null;

  employees[index] = {
    ...employees[index],
    ...updates,
  };

  await saveEmployees(employees);
  return employees[index];
}

// Delete an employee
export async function deleteEmployee(id: string): Promise<boolean> {
  const employees = await getEmployees();
  const filtered = employees.filter(emp => emp.id !== id);

  if (filtered.length === employees.length) return false;

  await saveEmployees(filtered);
  return true;
}
