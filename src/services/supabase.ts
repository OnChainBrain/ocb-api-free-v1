import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function checkAgentExists(agentName: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('agents')
    .select('id')
    .eq('name', agentName)
    .single();

  if (error) {
    console.error('Error checking agent existence:', error.message);
    return false;
  }

  return !!data;
}

export async function storeAgent(agentName: string, agentDetails: any): Promise<void> {
  const { error } = await supabase
    .from('agents')
    .upsert({
      name: agentName,
      ...agentDetails,
      updated_at: new Date().toISOString()
    });

  if (error) {
    throw new Error(`Error storing agent: ${error.message}`);
  }
}

export async function getAgentData(agentName: string): Promise<{ personality: string } | null> {
  const { data, error } = await supabase
    .from('agents')
    .select('personality')
    .eq('name', agentName)
    .single();

  if (error) {
    console.error('Error fetching agent data:', error.message);
    return null;
  }

  return data;
}

export async function getAllAgents(): Promise<{ data: any[] | null; error: any }> {
  const { data, error } = await supabase
    .from('agents')
    .select('*');

  if (error) {
    console.error('Error fetching all agent data:', error.message);
    return { data: null, error };
  }

  return { data, error };
}

export default supabase; 