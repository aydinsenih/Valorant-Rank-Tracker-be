const server = require("./api/server");

const PORT = 4000;

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

module.exports = server;
