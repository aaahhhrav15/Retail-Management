import * as exampleService from '../services/example.service.js';

export const getExamples = async (req, res) => {
  try {
    const examples = await exampleService.getAllExamples();
    res.json({ success: true, data: examples });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createExample = async (req, res) => {
  try {
    const example = await exampleService.createExample(req.body);
    res.status(201).json({ success: true, data: example });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

