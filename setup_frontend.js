const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n==========================================');
console.log(' SMARTMATCH FRONTEND SETUP TOOL');
console.log('==========================================\n');

// ==========================================
// ROOT PATH
// ==========================================
const rootDir = path.join(__dirname, 'frontend-app');
const srcDir = path.join(rootDir, 'src');

// ==========================================
// HELPER FUNCTIONS
// ==========================================
function createDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`[CREATE] Folder: ${dirPath}`);
    }
}

function createFile(filePath, content = '') {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
        console.log(`[CREATE] File: ${filePath}`);
    }
}

function installPackages(packages, dev = false) {
    if (!packages.length) return;

    const command = dev
        ? `npm install -D ${packages.join(' ')}`
        : `npm install ${packages.join(' ')}`;

    console.log(`\n[INSTALL] ${command}\n`);

    execSync(command, {
        cwd: rootDir,
        stdio: 'inherit'
    });
}

// ==========================================
// CREATE BASE PROJECT
// ==========================================
function initializeFrontend() {

    if (!fs.existsSync(rootDir)) {

        console.log('[INFO] Creating Vite React project...\n');

        execSync(
            `npm create vite@latest frontend-app -- --template react`,
            {
                cwd: __dirname,
                stdio: 'inherit'
            }
        );
    }
}

// ==========================================
// CREATE FOLDER STRUCTURE
// ==========================================
function generateFolders() {

    const folders = [

        // assets
        'src/assets/images',
        'src/assets/icons',
        'src/assets/fonts',

        // common components
        'src/components/common/Button',
        'src/components/common/Input',
        'src/components/common/Modal',
        'src/components/common/Table',
        'src/components/common/Pagination',
        'src/components/common/Badge',
        'src/components/common/Avatar',
        'src/components/common/FileUpload',
        'src/components/common/SearchBar',
        'src/components/common/Spinner',
        'src/components/common/Toast',
        'src/components/common/ConfirmDialog',

        // layout
        'src/components/layout/MainLayout',
        'src/components/layout/AuthLayout',
        'src/components/layout/AdminLayout',
        'src/components/layout/EmployerLayout',
        'src/components/layout/Navbar',
        'src/components/layout/Sidebar',
        'src/components/layout/Footer',

        // shared
        'src/components/shared/JobCard',
        'src/components/shared/CompanyCard',
        'src/components/shared/ApplicationStatusBadge',
        'src/components/shared/SkillTag',
        'src/components/shared/ScoreIndicator',
        'src/components/shared/EmptyState',

        // pages
        'src/pages/public/HomePage',
        'src/pages/public/JobListPage',
        'src/pages/public/JobDetailPage',
        'src/pages/public/CompanyListPage',
        'src/pages/public/CompanyDetailPage',
        'src/pages/public/NotFoundPage',

        'src/pages/auth/LoginPage',
        'src/pages/auth/RegisterPage',
        'src/pages/auth/ForgotPasswordPage',

        'src/pages/candidate/DashboardPage',
        'src/pages/candidate/ProfilePage',
        'src/pages/candidate/CVBuilderPage',
        'src/pages/candidate/MyApplicationsPage',
        'src/pages/candidate/SettingsPage',

        'src/pages/employer/DashboardPage',
        'src/pages/employer/CompanyProfilePage',
        'src/pages/employer/JobManagementPage',
        'src/pages/employer/JobCreatePage',
        'src/pages/employer/JobEditPage',
        'src/pages/employer/ApplicationListPage',
        'src/pages/employer/ApplicationDetailPage',
        'src/pages/employer/CandidateSearchPage',
        'src/pages/employer/SettingsPage',

        'src/pages/admin/DashboardPage',
        'src/pages/admin/UserManagementPage',
        'src/pages/admin/CompanyModerationPage',
        'src/pages/admin/JobModerationPage',
        'src/pages/admin/CategoryManagementPage',
        'src/pages/admin/ReportExportPage',

        // features
        'src/features/auth',
        'src/features/candidate',
        'src/features/employer',
        'src/features/job',
        'src/features/application',
        'src/features/admin',

        // hooks
        'src/hooks',

        // router
        'src/router',

        // store
        'src/store',

        // services
        'src/services',

        // utils
        'src/utils'
    ];

    folders.forEach(folder => {
        createDir(path.join(rootDir, folder));
    });
}

// ==========================================
// GENERATE PAGE FILES
// ==========================================
function generatePageFiles() {

    const pages = [

        // public
        'src/pages/public/HomePage/index.jsx',
        'src/pages/public/JobListPage/index.jsx',
        'src/pages/public/JobDetailPage/index.jsx',
        'src/pages/public/CompanyListPage/index.jsx',
        'src/pages/public/CompanyDetailPage/index.jsx',
        'src/pages/public/NotFoundPage/index.jsx',

        // auth
        'src/pages/auth/LoginPage/index.jsx',
        'src/pages/auth/RegisterPage/index.jsx',
        'src/pages/auth/ForgotPasswordPage/index.jsx',

        // candidate
        'src/pages/candidate/DashboardPage/index.jsx',
        'src/pages/candidate/ProfilePage/index.jsx',
        'src/pages/candidate/CVBuilderPage/index.jsx',
        'src/pages/candidate/MyApplicationsPage/index.jsx',
        'src/pages/candidate/SettingsPage/index.jsx',

        // employer
        'src/pages/employer/DashboardPage/index.jsx',
        'src/pages/employer/CompanyProfilePage/index.jsx',
        'src/pages/employer/JobManagementPage/index.jsx',
        'src/pages/employer/JobCreatePage/index.jsx',
        'src/pages/employer/JobEditPage/index.jsx',
        'src/pages/employer/ApplicationListPage/index.jsx',
        'src/pages/employer/ApplicationDetailPage/index.jsx',
        'src/pages/employer/CandidateSearchPage/index.jsx',
        'src/pages/employer/SettingsPage/index.jsx',

        // admin
        'src/pages/admin/DashboardPage/index.jsx',
        'src/pages/admin/UserManagementPage/index.jsx',
        'src/pages/admin/CompanyModerationPage/index.jsx',
        'src/pages/admin/JobModerationPage/index.jsx',
        'src/pages/admin/CategoryManagementPage/index.jsx',
        'src/pages/admin/ReportExportPage/index.jsx',
    ];

    pages.forEach(file => {

        const componentName = path.basename(path.dirname(file));

        const content = `
export default function ${componentName}() {
    return (
        <div>
            <h1>${componentName}</h1>
        </div>
    );
}
`;

        createFile(path.join(rootDir, file), content);
    });
}

// ==========================================
// GENERATE CORE FILES
// ==========================================
function generateCoreFiles() {

    createFile(
        path.join(srcDir, 'App.jsx'),
`
export default function App() {
    return (
        <div>
            <h1>SmartMatch Frontend</h1>
        </div>
    );
}
`
    );

    createFile(
        path.join(srcDir, 'main.jsx'),
`
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
`
    );

    createFile(
        path.join(srcDir, 'services', 'axiosClient.js'),
`
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

axiosClient.interceptors.request.use((config) => {

    const token = localStorage.getItem('access_token');

    if (token) {
        config.headers.Authorization = \`Bearer \${token}\`;
    }

    return config;
});

export default axiosClient;
`
    );

    createFile(
        path.join(rootDir, '.env.development'),
`
VITE_API_URL=http://localhost:8080/api
`
    );

    createFile(
        path.join(rootDir, '.env.production'),
`
VITE_API_URL=https://api.smartmatch.com/api
`
    );

    createFile(
        path.join(rootDir, 'jsconfig.json'),
`
{
    "compilerOptions": {
        "baseUrl": "./src"
    }
}
`
    );
}

// ==========================================
// INSTALL LIBRARIES
// ==========================================
function installDependencies() {

    const dependencies = [

        'react-router-dom',

        '@reduxjs/toolkit',
        'react-redux',

        'axios',

        'tailwindcss',
        '@tailwindcss/vite',

        '@headlessui/react',
        'lucide-react',
        'react-hot-toast',

        'clsx',
        'tailwind-merge',

        'react-hook-form',
        'zod',
        '@hookform/resolvers',

        'recharts',

        'react-dropzone',
        'xlsx',
        'jspdf',
        'jspdf-autotable',

        'dayjs',
        'react-paginate'
    ];

    installPackages(dependencies);
}

// ==========================================
// RUN
// ==========================================
try {

    initializeFrontend();

    generateFolders();

    generatePageFiles();

    generateCoreFiles();

    installDependencies();

    console.log('\n==========================================');
    console.log(' FRONTEND SETUP COMPLETED SUCCESSFULLY');
    console.log('==========================================\n');

    console.log('NEXT COMMANDS:\n');

    console.log('cd frontend-app');
    console.log('npm run dev\n');

} catch (error) {

    console.error('\n[ERROR] Setup failed:\n');
    console.error(error.message);
}