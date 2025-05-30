import { createClient } from "../../supabase/client";

export async function checkSupabaseHealth(): Promise<{
  isHealthy: boolean;
  message: string;
  details?: any;
}> {
  try {
    const supabase = createClient();
    const startTime = Date.now();
    
    // Test 1: Basic connectivity with auth session
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      return {
        isHealthy: false,
        message: `Auth service error: ${authError.message}`,
        details: {
          service: "Authentication",
          error: authError,
          timestamp: new Date().toISOString()
        }
      };
    }
    
    // Test 2: Database connectivity by testing table access
    let tableTest = "❌ Failed";
    try {
      const { error: tableError } = await supabase
        .from("users")
        .select("id")
        .limit(1);
        
      if (!tableError) {
        tableTest = "✓ Connected";
      } else if (tableError.code === "PGRST116") {
        // No rows found - table exists but is empty
        tableTest = "✓ Connected (empty)";
      } else {
        tableTest = `❌ ${tableError.message}`;
      }
    } catch (dbError: any) {
      tableTest = `❌ ${dbError.message || "Connection failed"}`;
    }
    
    const responseTime = Date.now() - startTime;
    const isHealthy = tableTest.startsWith("✓");
    
    return {
      isHealthy,
      message: isHealthy 
        ? "Supabase is healthy and accessible" 
        : "Database connection issues detected",
      details: {
        database: tableTest,
        auth: "✓ Available", 
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || "Not configured"
      }
    };
    
  } catch (error: any) {
    return {
      isHealthy: false,
      message: `Connection failed: ${error.message || "Unknown error"}`,
      details: {
        error: error.message || "Unknown error",
        code: error.code || "Unknown",
        timestamp: new Date().toISOString(),
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || "Not configured"
      }
    };
  }
} 