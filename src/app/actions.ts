'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

export async function createIssue(data: { description: string, lat?: number, lng?: number, category?: string, reporterId?: string }) {
  try {
    // If no reporter provided, we'll try to find a generic user or just fail
    // For prototype, we'll default to a generic citizen if none provided
    let reporterId = data.reporterId;
    if (!reporterId) {
      const citizen = await prisma.user.findFirst({ where: { role: 'citizen' } });
      reporterId = citizen?.id || 'unknown';
    }

    const newIssue = await prisma.issue.create({
      data: {
        title: data.category || 'General Issue',
        description: data.description,
        category: data.category || 'General Issue',
        severity: 'Medium',
        status: 'Open',
        latitude: data.lat,
        longitude: data.lng,
        reporterId: reporterId,
      }
    });
    
    revalidatePath('/dashboard');
    return { success: true, issueId: newIssue.id };
  } catch (error) {
    console.error('Failed to create issue:', error);
    return { success: false, error: 'Failed to create issue' };
  }
}

export async function getIssues() {
  try {
    const issues = await prisma.issue.findMany({
      orderBy: { createdAt: 'desc' },
      include: { reporter: true }
    });
    
    // Format for client-side consumption
    return issues.map(issue => ({
      id: issue.id.slice(0, 8), // Shorten UUID for compact view
      category: issue.category,
      severity: issue.severity,
      status: issue.status === 'open' ? 'Open' : issue.status === 'in_progress' ? 'In Progress' : 'Resolved',
      date: issue.createdAt.toLocaleDateString(),
      desc: issue.description,
      lat: issue.latitude?.toFixed(4) || 'Unknown',
      lng: issue.longitude?.toFixed(4) || 'Unknown',
      reporterName: issue.reporter.name
    }));
  } catch (error) {
    console.error('Failed to fetch issues:', error);
    return [];
  }
}

export async function registerUser(data: { name: string, email: string, password: string, role?: string }) {
  try {
    const role = data.role || 'citizen';
    if (data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long' };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }

    // Create new citizen
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: role
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Registration failed:', error);
    return { success: false, error: 'Failed to create account. Please try again.' };
  }
}
