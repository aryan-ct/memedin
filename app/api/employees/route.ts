import { NextRequest, NextResponse } from 'next/server';
import { getEmployees, createEmployee } from '@/lib/db';

// GET all employees
export async function GET() {
  try {
    const employees = await getEmployees();
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

// POST create new employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, caption } = body;

    if (!name || !caption) {
      return NextResponse.json({ error: 'Name and caption are required' }, { status: 400 });
    }

    const newEmployee = await createEmployee({ name, caption });
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}
