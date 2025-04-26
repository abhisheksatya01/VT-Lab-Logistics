const getUUIDFromEndpoint = (endpoint) => {
    const parts = endpoint.split("/");
    return parts[parts.length - 1];
}

module.exports = { getUUIDFromEndpoint };