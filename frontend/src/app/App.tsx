import { RouterProvider } from 'react-router';
import { router } from './routes';

export type DrugData = {
  batchId: string;
  drugName: string;
  manufacturer: string;
  verified: boolean;
  supplyChain: {
    stage: string;
    location: string;
    date: string;
    status: 'completed' | 'current' | 'pending';
  }[];
  expiryDate: string;
  manufactureDate: string;
  dosage: string;
  activeIngredient: string;
  warnings?: string[];
  anomalyDetected?: boolean;
};

export default function App() {
  return <RouterProvider router={router} />;
}
