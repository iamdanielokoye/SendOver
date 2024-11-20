async function queryFallbackAI(message) {
    try {
      // Dynamically import node-fetch as an ES module
      const { default: fetch } = await import('node-fetch');
  
      const response = await fetch("https://openrouter.ai/api/v1", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.FALLBACK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "nousresearch/hermes-3-llama-3.1-405b:free",
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
        }),
      });
  
      // Check for network issues
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      if (data && data.choices && data.choices[0].message) {
        return data.choices[0].message;
      } else {
        console.error("No valid response from Fallback AI", data);
        return "Sorry, I'm having trouble processing your request right now.";
      }
    } catch (error) {
      // Log more detailed error information
      console.error("Error with Fallback AI:", error);
      return "Sorry, I couldn't process your request at the moment. Please try again later.";
    }
  }
  