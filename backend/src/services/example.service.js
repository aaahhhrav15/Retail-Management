// Example service - replace with your actual business logic

export const getAllExamples = async () => {
  // Replace with actual database queries
  return [
    { id: 1, name: 'Example 1', description: 'This is an example' },
    { id: 2, name: 'Example 2', description: 'This is another example' }
  ];
};

export const createExample = async (data) => {
  // Replace with actual database insertion
  return {
    id: Date.now(),
    ...data,
    createdAt: new Date()
  };
};

