import { render, screen, waitFor, fireEvent, act, within } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import App from './App';

//Global Setup & Helpers
global.fetch = vi.fn();
global.alert = vi.fn();

// Helper to shorten the repetitive fetch mocking
const mockFetch = (data, ok = true) => {
  fetch.mockResolvedValueOnce({ ok, json: async () => data });
};

// Helper to quickly render the app and navigate to the Vet Dashboard
const renderVetDashboard = async () => {
  await act(async () => { render(<App />); });
  await act(async () => { fireEvent.click(screen.getByText('Vet Login')); });
};

beforeEach(() => {
  vi.clearAllMocks();
});


// PUBLIC PAGES & NAVIGATION
describe('Public Pages & Navigation', () => {
  test('can navigate between Home, Lost Pets, and Pet Details', async () => {
    mockFetch({
      total: 2,
      data: [
        { id: 1, species: 'Dog', breed: 'Husky', status: 'Unidentified' },
        { id: 2, species: 'Cat', breed: 'Siamese', status: 'Pending' }
      ]
    });

    await act(async () => { render(<App />); });
    
    // Navigate to Lost Pets
    const lostPetsNav = screen.getAllByText(/Lost Pets/i)[0];
    await act(async () => { fireEvent.click(lostPetsNav); });
    
    // Check for Husky and click it
    await waitFor(() => { expect(screen.getByText(/Husky/i)).toBeInTheDocument(); });
    const huskyCard = screen.getByText(/Husky/i);
    await act(async () => { fireEvent.click(huskyCard); });
    
    // Verify Pet Details screen
    await waitFor(() => { expect(screen.getByText(/Husky/i)).toBeInTheDocument(); });
  });
});


// VET DASHBOARD
describe('Vet Dashboard: Data & CRUD', () => {

  test('loads initial data and updates summary boxes', async () => {
    mockFetch({
      total: 1, unidentified: 1, contacted: 0,
      data: [{ id: 1, species: 'Dog', breed: 'Golden Retriever', status: 'Unidentified', dateAdmitted: 'Apr 12' }]
    });

    await renderVetDashboard();

    await waitFor(() => {
      expect(screen.getByText(/Animals in clinic custody/i)).toBeInTheDocument();
      expect(screen.getByText(/Golden Retriever/i)).toBeInTheDocument();
    });

    const totalBox = screen.getByText(/Total Pets/i).closest('.summary-box');
    expect(within(totalBox).getByText('1')).toBeInTheDocument();
  });

  test('navigates to the next page using pagination', async () => {
    mockFetch({ total: 10, totalPages: 2, data: [{ id: 1, species: 'Dog', status: 'Unidentified' }] });
    await renderVetDashboard();

    // Mock page 2
    mockFetch({ total: 10, totalPages: 2, data: [{ id: 6, species: 'Cat', status: 'Unidentified' }] });
    
    const nextBtn = await screen.findByRole('button', { name: /Next/i });
    await act(async () => { fireEvent.click(nextBtn); });

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('page=2'));
  });

  test('successfully adds a new pet', async () => {
    mockFetch({ total: 0, unidentified: 0, contacted: 0, data: [] });
    await renderVetDashboard();

    await act(async () => { fireEvent.click(screen.getByText(/Add new/i)); });

    const newPet = { id: 101, species: 'Dog', status: 'Unidentified' };
    mockFetch(newPet); // Mock the POST response
    mockFetch({ total: 1, unidentified: 1, contacted: 0, data: [newPet] }); // Mock the refresh GET response

    // Fill out form
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Dog' } });
    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'Golden Retriever' } }); 
    fireEvent.change(textboxes[1], { target: { value: 'Yellow' } });          
    fireEvent.change(textboxes[2], { target: { value: 'Brown' } });           
    fireEvent.change(textboxes[3], { target: { value: 'Very friendly' } });   
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '3' } });

    // Fake Photo Upload
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['dummy content'], 'dog.png', { type: 'image/png' });
    await act(async () => { fireEvent.change(fileInput, { target: { files: [file] } }); });

    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /Upload pet/i })); });

    await waitFor(() => {
      const label = screen.getByText('Total Pets', { selector: '.summary-label' });
      expect(within(label.closest('.summary-box')).getByText('1')).toBeInTheDocument();
    });
  });

  test('updates status and refreshes summary boxes', async () => {
    mockFetch({ total: 1, unidentified: 1, contacted: 0, data: [{ id: 1, species: 'Dog', status: 'Unidentified' }] });
    await renderVetDashboard();

    const editBtn = await screen.findByTitle(/update/i);
    await act(async () => { fireEvent.click(editBtn); });

    mockFetch({ id: 1, status: 'Owner Contacted' }); // Put response
    mockFetch({ total: 1, unidentified: 0, contacted: 1, data: [{ id: 1, species: 'Dog', status: 'Owner Contacted' }] }); // Refresh response

    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /Save|Update/i })); });

    await waitFor(() => {
      const label = screen.getByText('Owner Contacted', { selector: '.summary-label' });
      expect(within(label.closest('.summary-box')).getByText('1')).toBeInTheDocument();
    });
  });

  test('deletes a pet and reduces total count', async () => {
    mockFetch({ total: 1, unidentified: 1, contacted: 0, data: [{ id: 1, species: 'Dog', status: 'Unidentified' }] });
    await renderVetDashboard();

    const deleteBtn = await screen.findByTitle(/delete/i);
    await act(async () => { fireEvent.click(deleteBtn); });

    mockFetch({ message: "Deleted" }); // Delete response
    mockFetch({ total: 0, unidentified: 0, contacted: 0, data: [] }); // Refresh response

    await act(async () => { fireEvent.click(screen.getByText(/Yes, Erase Pet/i)); });

    await waitFor(() => {
      const label = screen.getByText('Total Pets', { selector: '.summary-label' });
      expect(within(label.closest('.summary-box')).getByText('0')).toBeInTheDocument();
    });
  });

  test('cancels adding, updating, and deleting', async () => {
    mockFetch({ total: 1, data: [{ id: 1, species: 'Dog' }] });
    await renderVetDashboard();

    // Cancel Add
    await act(async () => { fireEvent.click(screen.getByText(/Add new/i)); });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /Cancel|Back/i })); });
    expect(screen.getByText(/Animals in clinic/i)).toBeInTheDocument();

    // Cancel Delete
    await act(async () => { fireEvent.click(await screen.findByTitle(/delete/i)); });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /Cancel|Back|No/i })); });
    expect(screen.getByText(/Animals in clinic/i)).toBeInTheDocument();

    // Cancel Update
    await act(async () => { fireEvent.click(await screen.findByTitle(/update/i)); });
    const textboxes = screen.getAllByRole('textbox');
    if(textboxes.length > 0) fireEvent.change(textboxes[0], { target: { value: 'Changed' } }); 
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /Cancel|Back/i })); });
    expect(screen.getByText(/Animals in clinic/i)).toBeInTheDocument();
  });
  
});


// ERROR HANDLING & VALIDATION
describe('Error Handling', () => {

  test('handles photo validation alert when adding a pet', async () => {
    mockFetch({ total: 0, data: [] });
    await renderVetDashboard();
    
    await act(async () => { fireEvent.click(screen.getByText(/Add new/i)); });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /Upload pet/i })); });

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Please upload a photo of the pet.");
    });
  });

  test('shows an alert when deleting a pet fails on the server', async () => {
    mockFetch({ total: 1, data: [{ id: 1, species: 'Dog' }] });
    await renderVetDashboard();

    await act(async () => { fireEvent.click(await screen.findByTitle(/delete/i)); });

    // FORCE A SERVER ERROR
    mockFetch({ error: "Database connection lost" }, false);

    await act(async () => { fireEvent.click(screen.getByText(/Yes, Erase Pet/i)); });

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(expect.stringContaining("Database connection lost"));
    });
  });

  test('handles all form validation alerts in AddPet sequentially', async () => {
    mockFetch({ total: 0, data: [] });
    await renderVetDashboard();
    await act(async () => { fireEvent.click(screen.getByText(/Add new/i)); });

    // pass photo first
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['dummy content'], 'dog.png', { type: 'image/png' });
    await act(async () => { fireEvent.change(fileInput, { target: { files: [file] } }); });

    const uploadBtn = screen.getByRole('button', { name: /Upload pet/i });

    // fail coat colour
    await act(async () => { fireEvent.click(uploadBtn); });
    expect(global.alert).toHaveBeenCalledWith("Please enter the coat colour of the pet.");

    // fail eye colour (fill coat, leave eye)
    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[1], { target: { value: 'Brown' } }); // Fill Coat
    await act(async () => { fireEvent.click(uploadBtn); });
    expect(global.alert).toHaveBeenCalledWith("Please enter the eye colour of the pet.");

    // fail age check (fill eye, set bad age)
    fireEvent.change(textboxes[2], { target: { value: 'Blue' } }); // Fill Eye
    const ageInput = screen.getByRole('spinbutton');
    fireEvent.change(ageInput, { target: { value: '50' } }); // Set invalid age > 30
    await act(async () => { fireEvent.click(uploadBtn); });
    expect(global.alert).toHaveBeenCalledWith("Please enter a valid age between 0 and 30.");
  });


});