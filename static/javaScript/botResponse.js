export function botResponse(prompt){
    return fetch("bot_response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: prompt
        })
      })
      .then(response =>{
        return response.json();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      
}
