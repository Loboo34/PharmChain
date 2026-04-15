import { createHashRouter } from 'react-router';
import { RootLayout } from './components/RootLayout';
import { HomePage } from './components/HomePage';
import { ScanPage } from './components/ScanPage';
import { VerificationResults } from './components/VerificationResults';
import { AboutPage } from './components/AboutPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { StatisticsPage } from './components/StatisticsPage';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { DashboardPage } from './components/DashboardPage';
import { PartnerPage } from './components/PartnerPage';
import { CaseStudyPage } from './components/CaseStudyPage';
import { RoleGuard } from './components/RoleGuard';

export const router = createHashRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'scan', Component: ScanPage },
      { path: 'results', Component: VerificationResults },
      { path: 'about', Component: AboutPage },
      { path: 'how-it-works', Component: HowItWorksPage },
      { path: 'statistics', Component: StatisticsPage },
      { path: 'login', Component: LoginPage },
      { path: 'signup', Component: SignUpPage },
      { path: 'forgot-password', Component: ForgotPasswordPage },
      { path: 'partner', Component: PartnerPage },
      { path: 'case-studies', Component: CaseStudyPage },
      {
        path: 'dashboard',
        element: (
          <RoleGuard>
            <DashboardPage />
          </RoleGuard>
        ),
      },
    ],
  },
]);