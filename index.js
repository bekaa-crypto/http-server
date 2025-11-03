const http = require("http"); // Import Node.js HTTP module

const port = 3007; // Port number the server will listen on

// Sample friends array
const friends = [
  { id: 0, name: "John Doe", age: 30, city: "New York" },
  { id: 1, name: "Jane Doe", age: 25, city: "Los Angeles" },
  { id: 2, name: "Bob Smith", age: 35, city: "Chicago" },
];

// Create the HTTP server
const server = http.createServer((req, res) => {
  // Split URL into segments (e.g., "/friends/1" -> ["friends","1"])
  const item = req.url.split("/").filter(Boolean);

  // ROOT ROUTE: GET "/"
  if (item.length === 0) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Hello World</h1>");
    return; // Stop execution
  }

  // POST /friends - Add a new friend
  if (req.method === "POST" && item[0] === "friends") {
    let body = ""; // Variable to collect data chunks
    req.on("data", (chunk) => (body += chunk.toString())); // Collect data
    req.on("end", () => {
      try {
        const friend = JSON.parse(body); // Parse incoming JSON
        friends.push(friend); // Add to friends array
        console.log("New friend added:", friend);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Friend added successfully!" }));
      } catch (err) {
        // Handle invalid JSON
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return; // Stop further execution
  }

  // GET /friends or /friends/:id
  if (req.method === "GET" && item[0] === "friends") {
    // If a specific friend ID is requested
    if (item[1]) {
      const friendIndex = Number(item[1]);
      if (friends[friendIndex]) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(friends[friendIndex]));
        return; // Stop execution
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Friend not found" }));
        return; // Stop execution
      }
    }

    // If no ID provided, return all friends
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(friends));
    return;
  }

  // GET /message - Return a simple HTML page
  if (req.method === "GET" && item[0] === "message") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<html><body><ul>");
    res.write("<li>hey eyoab</li>");
    res.write("<li>how are you?</li>");
    res.write("</ul></body></html>");
    res.end();
    return; // Stop execution
  }

  // Unknown routes - 404
  res.writeHead(404, { "Content-Type": "text/html" });
  res.end("<h1>404 Not Found</h1>");
  return; // Stop execution
});

// Optional: handle server errors (e.g., port in use)
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use`);
    process.exit(1); // Exit so you can free the port
  } else {
    console.error("Server error:", err);
  }
});

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// Optional: catch any uncaught exceptions to prevent nodemon from crashing
process.on("uncaughtException", (err) => {
  console.error("Uncaught error:", err);
});
