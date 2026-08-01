export function sendSuccess(res, data, message, statusCode = 200) {
  const response = {
    success: true,
    data,
    message,
  };
  res.status(statusCode).json(response);
}

export function sendPaginated(res, data, total, page, limit) {
  const response = {
    success: true,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
  res.status(200).json(response);
}

export function sendError(res, message, statusCode = 500) {
  const response = {
    success: false,
    message,
  };
  res.status(statusCode).json(response);
}
