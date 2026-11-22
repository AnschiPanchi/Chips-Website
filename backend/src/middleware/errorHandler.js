export function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error";

  if (process.env.NODE_ENV !== "production") {
    console.error(`[${new Date().toISOString()}] ${status} ${message}`);
    if (err.stack) console.error(err.stack);
  }

  res.status(status).json({
    ok: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}

export function notFound(req, res) {
  res.status(404).json({ ok: false, message: `Route ${req.method} ${req.path} not found` });
}
