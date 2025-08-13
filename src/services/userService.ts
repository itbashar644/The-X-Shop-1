import { API_BASE_URL } from "@/types/variables";

export async function getTotalUsersCount(): Promise<{ success: boolean; count?: number; error?: any }> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/count`);
    const result = await response.json();
    if (!response.ok || !result.totalUsers) {
      console.error('Error fetching total users count:', result.error);
      return { success: false, error: result.error || { message: 'Ошибка при загрузке общего количества клиентов' } };
    }
    return { success: true, count: result.totalUsers };
  } catch (error) {
    console.error('Unexpected error fetching total users count:', error);
    return { success: false, error };
  }
} 