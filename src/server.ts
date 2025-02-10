import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkAgentExists, storeAgent, getAgentData, getAllAgents } from './services/supabase';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Check if agent exists
app.get('/exists/:agentName', async (req, res) => {
  try {
    const { agentName } = req.params;
    const exists = await checkAgentExists(agentName);
    res.json({ exists });
  } catch (error) {
    console.error('Error checking agent existence:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get agent data
app.get('/agent/:agentName', async (req, res) => {
  try {
    const { agentName } = req.params;
    const agentData = await getAgentData(agentName);
    
    if (!agentData) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.json(agentData);
  } catch (error) {
    console.error('Error fetching agent data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Store agent data
app.post('/store-agent', async (req, res) => {
  try {
    const { agentName, agentDetails } = req.body;
    
    if (!agentName || !agentDetails) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await storeAgent(agentName, agentDetails);
    res.json({ message: 'Agent stored successfully' });
  } catch (error) {
    console.error('Error storing agent:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all agents
app.get('/agents', async (req, res) => {
  try {
    const { data, error } = await getAllAgents();

    if (error) {
      throw error;
    }
    const mappedResponmse = data?.map((agent) => ({
      name: agent.name,
      personality: agent.personality,
    }));

    res.json(mappedResponmse);
  } catch (error) {
    console.error('Error fetching all agents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 