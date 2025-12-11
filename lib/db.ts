import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import { Employee } from "./types";

const EMPLOYEES_COLLECTION = "employees";

// Read all employees from Firestore
export async function getEmployees(): Promise<Employee[]> {
  try {
    const employeesRef = collection(db, EMPLOYEES_COLLECTION);
    const q = query(employeesRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const employees: Employee[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      employees.push({
        id: doc.id,
        name: data.name,
        caption: data.caption,
        imageUrl: data.imageUrl || "",
        createdAt:
          data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      });
    });

    return employees;
  } catch (error) {
    console.error("Error reading employees:", error);
    return [];
  }
}

// Get a single employee by ID
export async function getEmployeeById(id: string): Promise<Employee | null> {
  try {
    const docRef = doc(db, EMPLOYEES_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        caption: data.caption,
        imageUrl: data.imageUrl || "",
        createdAt:
          data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting employee:", error);
    return null;
  }
}

// Create a new employee
export async function createEmployee(
  employee: Omit<Employee, "id" | "createdAt">
): Promise<Employee> {
  try {
    const docRef = await addDoc(collection(db, EMPLOYEES_COLLECTION), {
      name: employee.name,
      caption: employee.caption,
      imageUrl: employee.imageUrl || "",
      createdAt: serverTimestamp(),
    });

    const newEmployee = await getEmployeeById(docRef.id);
    if (!newEmployee) {
      throw new Error("Failed to create employee");
    }

    return newEmployee;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
}

// Update an existing employee
export async function updateEmployee(
  id: string,
  updates: Partial<Omit<Employee, "id" | "createdAt">>
): Promise<Employee | null> {
  try {
    const docRef = doc(db, EMPLOYEES_COLLECTION, id);
    await updateDoc(docRef, updates);
    return await getEmployeeById(id);
  } catch (error) {
    console.error("Error updating employee:", error);
    return null;
  }
}

// Delete an employee
export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, EMPLOYEES_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting employee:", error);
    return false;
  }
}
