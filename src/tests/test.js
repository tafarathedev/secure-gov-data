const baseURI = "http://localhost:4000/data-requests/api";

async function fetchDataRequests() {
  try {
    const response = await fetch(`${baseURI}/`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data requests:", error);
    throw error;
  }
}

// Example usage
fetchDataRequests().then((data) => console.log(data));
