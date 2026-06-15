import { insforge } from './insforge';

export const loadUserData = async (userId) => {
  try {
    const { data, error } = await insforge.database
      .from('user_data')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error("Error loading user data:", error);
      return null;
    }
    return data || null;
  } catch (error) {
    console.error("Error loading user data:", error);
    return null;
  }
};

export const saveUserData = async (userId, data) => {
  try {
    const payload = {
      id: userId,
      semesters: data.semesters,
      updated_at: new Date().toISOString(),
    };
    if (data.target_cgpa !== undefined) {
      payload.target_cgpa = data.target_cgpa;
    }
    
    const { error } = await insforge.database
      .from('user_data')
      .upsert(payload);
      
    if (error) {
      console.error("Error saving user data:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error saving user data:", error);
    return false;
  }
};

export const clearUserData = async (userId) => {
  try {
    const { error } = await insforge.database
      .from('user_data')
      .delete()
      .eq('id', userId);
      
    if (error) {
      console.error("Error clearing user data:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error clearing user data:", error);
    return false;
  }
};
