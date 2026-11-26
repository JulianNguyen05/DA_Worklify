import React from 'react';
import DashboardShell from '../DashboardShell';
import { EMPLOYER_NAV } from '../navConfig';

export default function EmployerLayout() {
  return <DashboardShell groups={EMPLOYER_NAV} workspaceLabel="Employer" homePath="/employer/dashboard" />;
}
