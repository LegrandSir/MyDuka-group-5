import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

// Mock the custom hook
jest.mock('../hooks/useAdminDashboard');

// Mock the section components
jest.mock('../sections/OverviewSection', () => {
  return function OverviewSection({ products }) {
    return <div data-testid="overview-section">Overview: {products.length} products</div>;
  };
});

jest.mock('../sections/SupplyRequestsSection', () => {
  return function SupplyRequestsSection({ supplyRequests, onUpdate, onDelete }) {
    return (
      <div data-testid="supply-requests-section">
        Supply Requests: {supplyRequests.length}
        <button onClick={() => onUpdate(1, 'approved')}>Update Request</button>
        <button onClick={() => onDelete(1)}>Delete Request</button>
      </div>
    );
  };
});

jest.mock('../sections/PaymentsSection', () => {
  return function PaymentsSection({ payments, onAdd, showStore }) {
    return (
      <div data-testid="payments-section">
        Payments: {payments.length}
        <button onClick={() => onAdd({ amount: 100 })}>Add Payment</button>
      </div>
    );
  };
});

jest.mock('../sections/ClerksSection', () => {
  return function ClerksSection({ clerks, onAdd, onToggleStatus }) {
    return (
      <div data-testid="clerks-section">
        Clerks: {clerks.length}
        <button onClick={() => onAdd({ name: 'New Clerk' })}>Add Clerk</button>
        <button onClick={() => onToggleStatus(1)}>Toggle Status</button>
      </div>
    );
  };
});

// Mock the Card and TabButton components
jest.mock('../components/Card', () => {
  return function Card({ title, value, icon, color }) {
    return (
      <div data-testid={`card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        {title}: {value}
      </div>
    );
  };
});

jest.mock('../components/TabButton', () => {
  return function TabButton({ id, label, isActive, onClick, icon }) {
    return (
      <button
        data-testid={`tab-${id}`}
        onClick={() => onClick(id)}
        className={isActive ? 'active' : ''}
      >
        {label}
      </button>
    );
  };
});

// Helper function to render with router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('AdminDashboard', () => {
  const mockHookData = {
    inventory: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ],
    products: [
      { id: 1, name: 'Product 1' },
      { id: 2, name: 'Product 2' },
      { id: 3, name: 'Product 3' },
    ],
    supplyRequests: [
      { id: 1, product: 'Product A', quantity: 10, status: 'pending' },
      { id: 2, product: 'Product B', quantity: 5, status: 'approved' },
    ],
    payments: [
      { id: 1, amount: 1000, status: 'paid' },
      { id: 2, amount: 500, status: 'unpaid' },
    ],
    clerks: [
      { id: 1, name: 'Clerk 1', email: 'clerk1@test.com', active: true },
      { id: 2, name: 'Clerk 2', email: 'clerk2@test.com', active: false },
    ],
    loading: false,
    addPayment: jest.fn(),
    addClerk: jest.fn(),
    updateRequest: jest.fn(),
    deleteRequest: jest.fn(),
    toggleClerkStatus: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAdminDashboard.mockReturnValue(mockHookData);
  });

  describe('Rendering', () => {
    it('should render the dashboard title and description', () => {
      renderWithRouter(<AdminDashboard />);
      
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Manage clerks, supply requests and payments')).toBeInTheDocument();
    });

    it('should render all KPI cards with correct values', () => {
      renderWithRouter(<AdminDashboard />);
      
      expect(screen.getByTestId('card-inventory-items')).toHaveTextContent('Inventory Items: 2');
      expect(screen.getByTestId('card-supply-requests')).toHaveTextContent('Supply Requests: 2');
      expect(screen.getByTestId('card-payments')).toHaveTextContent('Payments: 2');
    });

    it('should render all tab buttons', () => {
      renderWithRouter(<AdminDashboard />);
      
      expect(screen.getByTestId('tab-overview')).toBeInTheDocument();
      expect(screen.getByTestId('tab-requests')).toBeInTheDocument();
      expect(screen.getByTestId('tab-payments')).toBeInTheDocument();
      expect(screen.getByTestId('tab-clerks')).toBeInTheDocument();
    });

    it('should display overview section by default', () => {
      renderWithRouter(<AdminDashboard />);
      
      expect(screen.getByTestId('overview-section')).toBeInTheDocument();
      expect(screen.getByText('Overview: 3 products')).toBeInTheDocument();
    });

    it('should show loading state when loading is true', () => {
      useAdminDashboard.mockReturnValue({ ...mockHookData, loading: true });
      
      renderWithRouter(<AdminDashboard />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('should switch to supply requests tab when clicked', () => {
      renderWithRouter(<AdminDashboard />);
      
      const requestsTab = screen.getByTestId('tab-requests');
      fireEvent.click(requestsTab);
      
      expect(screen.getByTestId('supply-requests-section')).toBeInTheDocument();
      expect(screen.getByText('Supply Requests: 2')).toBeInTheDocument();
    });

    it('should switch to payments tab when clicked', () => {
      renderWithRouter(<AdminDashboard />);
      
      const paymentsTab = screen.getByTestId('tab-payments');
      fireEvent.click(paymentsTab);
      
      expect(screen.getByTestId('payments-section')).toBeInTheDocument();
      expect(screen.getByText('Payments: 2')).toBeInTheDocument();
    });

    it('should switch to clerks tab when clicked', () => {
      renderWithRouter(<AdminDashboard />);
      
      const clerksTab = screen.getByTestId('tab-clerks');
      fireEvent.click(clerksTab);
      
      expect(screen.getByTestId('clerks-section')).toBeInTheDocument();
      expect(screen.getByText('Clerks: 2')).toBeInTheDocument();
    });

    it('should switch back to overview tab when clicked', () => {
      renderWithRouter(<AdminDashboard />);
      
      // Switch to another tab first
      fireEvent.click(screen.getByTestId('tab-payments'));
      expect(screen.getByTestId('payments-section')).toBeInTheDocument();
      
      // Switch back to overview
      fireEvent.click(screen.getByTestId('tab-overview'));
      expect(screen.getByTestId('overview-section')).toBeInTheDocument();
    });

    it('should only display one section at a time', () => {
      renderWithRouter(<AdminDashboard />);
      
      // Initially on overview
      expect(screen.getByTestId('overview-section')).toBeInTheDocument();
      expect(screen.queryByTestId('supply-requests-section')).not.toBeInTheDocument();
      
      // Switch to requests
      fireEvent.click(screen.getByTestId('tab-requests'));
      expect(screen.queryByTestId('overview-section')).not.toBeInTheDocument();
      expect(screen.getByTestId('supply-requests-section')).toBeInTheDocument();
    });
  });

  describe('Section Interactions', () => {
    it('should call updateRequest when update button is clicked in supply requests', () => {
      renderWithRouter(<AdminDashboard />);
      
      fireEvent.click(screen.getByTestId('tab-requests'));
      
      const updateButton = screen.getByText('Update Request');
      fireEvent.click(updateButton);
      
      expect(mockHookData.updateRequest).toHaveBeenCalledWith(1, 'approved');
    });

    it('should call deleteRequest when delete button is clicked in supply requests', () => {
      renderWithRouter(<AdminDashboard />);
      
      fireEvent.click(screen.getByTestId('tab-requests'));
      
      const deleteButton = screen.getByText('Delete Request');
      fireEvent.click(deleteButton);
      
      expect(mockHookData.deleteRequest).toHaveBeenCalledWith(1);
    });

    it('should call addPayment when add button is clicked in payments section', () => {
      renderWithRouter(<AdminDashboard />);
      
      fireEvent.click(screen.getByTestId('tab-payments'));
      
      const addButton = screen.getByText('Add Payment');
      fireEvent.click(addButton);
      
      expect(mockHookData.addPayment).toHaveBeenCalledWith({ amount: 100 });
    });

    it('should call addClerk when add button is clicked in clerks section', () => {
      renderWithRouter(<AdminDashboard />);
      
      fireEvent.click(screen.getByTestId('tab-clerks'));
      
      const addButton = screen.getByText('Add Clerk');
      fireEvent.click(addButton);
      
      expect(mockHookData.addClerk).toHaveBeenCalledWith({ name: 'New Clerk' });
    });

    it('should call toggleClerkStatus when toggle button is clicked in clerks section', () => {
      renderWithRouter(<AdminDashboard />);
      
      fireEvent.click(screen.getByTestId('tab-clerks'));
      
      const toggleButton = screen.getByText('Toggle Status');
      fireEvent.click(toggleButton);
      
      expect(mockHookData.toggleClerkStatus).toHaveBeenCalledWith(1);
    });
  });

  describe('Data Display', () => {
    it('should pass correct props to OverviewSection', () => {
      renderWithRouter(<AdminDashboard />);
      
      const overviewSection = screen.getByTestId('overview-section');
      expect(overviewSection).toHaveTextContent('Overview: 3 products');
    });

    it('should pass correct props to SupplyRequestsSection', () => {
      renderWithRouter(<AdminDashboard />);
      
      fireEvent.click(screen.getByTestId('tab-requests'));
      
      const requestsSection = screen.getByTestId('supply-requests-section');
      expect(requestsSection).toHaveTextContent('Supply Requests: 2');
    });

    it('should pass correct props to PaymentsSection', () => {
      renderWithRouter(<AdminDashboard />);
      
      fireEvent.click(screen.getByTestId('tab-payments'));
      
      const paymentsSection = screen.getByTestId('payments-section');
      expect(paymentsSection).toHaveTextContent('Payments: 2');
    });

    it('should pass correct props to ClerksSection', () => {
      renderWithRouter(<AdminDashboard />);
      
      fireEvent.click(screen.getByTestId('tab-clerks'));
      
      const clerksSection = screen.getByTestId('clerks-section');
      expect(clerksSection).toHaveTextContent('Clerks: 2');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty inventory array', () => {
      useAdminDashboard.mockReturnValue({
        ...mockHookData,
        inventory: [],
      });
      
      renderWithRouter(<AdminDashboard />);
      
      expect(screen.getByTestId('card-inventory-items')).toHaveTextContent('Inventory Items: 0');
    });

    it('should handle empty supply requests array', () => {
      useAdminDashboard.mockReturnValue({
        ...mockHookData,
        supplyRequests: [],
      });
      
      renderWithRouter(<AdminDashboard />);
      
      expect(screen.getByTestId('card-supply-requests')).toHaveTextContent('Supply Requests: 0');
    });

    it('should handle empty payments array', () => {
      useAdminDashboard.mockReturnValue({
        ...mockHookData,
        payments: [],
      });
      
      renderWithRouter(<AdminDashboard />);
      
      expect(screen.getByTestId('card-payments')).toHaveTextContent('Payments: 0');
    });

    it('should handle empty clerks array', () => {
      useAdminDashboard.mockReturnValue({
        ...mockHookData,
        clerks: [],
      });
      
      renderWithRouter(<AdminDashboard />);
      
      fireEvent.click(screen.getByTestId('tab-clerks'));
      
      expect(screen.getByTestId('clerks-section')).toHaveTextContent('Clerks: 0');
    });
  });

  describe('Styling and Layout', () => {
    it('should apply correct background color to main container', () => {
      const { container } = renderWithRouter(<AdminDashboard />);
      
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass('bg-[#041524]');
    });

    it('should apply active class to the current tab', () => {
      renderWithRouter(<AdminDashboard />);
      
      const overviewTab = screen.getByTestId('tab-overview');
      expect(overviewTab).toHaveClass('active');
      
      fireEvent.click(screen.getByTestId('tab-payments'));
      
      const paymentsTab = screen.getByTestId('tab-payments');
      expect(paymentsTab).toHaveClass('active');
    });
  });
});